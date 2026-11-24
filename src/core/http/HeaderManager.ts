
import { browser } from '@wdio/globals';
import type { CDPSession, Page } from 'puppeteer-core';
import { INT_ENV, PRE_ENV } from '../../../config/env/int.env.js';

export class HeaderManager {
  private static configuredPages = new WeakSet<Page>();
  private static listenerAttached = false;

  public static async injectAuthHeaderIfNeeded(): Promise<void> {
    const envName = (process.env.ENV || 'INT').toUpperCase();
    if (envName !== 'INT' && envName !== 'PRE') return;

    const envConfig = envName === 'PRE' ? PRE_ENV : INT_ENV;
    const authHeaderEntries = Object.entries(envConfig.authHeader);

    const puppeteerBrowser = await browser.getPuppeteer();

    // 1. Aplicar a todas las pestañas abiertas actualmente
    const pages = await puppeteerBrowser.pages();
    for (const page of pages) {
      await this.attachInterceptorToPage(page, authHeaderEntries);
    }

    // 2. Aplicar automáticamente a cualquier pestaña nueva que se abra durante la navegación
    if (!this.listenerAttached) {
      puppeteerBrowser.on('targetcreated', async (target) => {
        if (target.type() === 'page') {
          const newPage = await target.page();
          if (newPage) {
            await this.attachInterceptorToPage(newPage, authHeaderEntries);
          }
        }
      });
      this.listenerAttached = true;
    }
  }

  private static async attachInterceptorToPage(
    page: Page,
    authHeaderEntries: [string, string][]
  ): Promise<void> {
    if (this.configuredPages.has(page)) return;
    this.configuredPages.add(page);

    const client: CDPSession = await page.createCDPSession();

    // Evita que Chrome use respuestas 401/403 cacheadas por Akamai
    await client.send('Network.setCacheDisabled', { cacheDisabled: true });

    // Intercepta TODAS las peticiones (incluidas OPTIONS preflight) hacia *.iberia.com
    await client.send('Fetch.enable', {
      patterns: [
        {
          urlPattern: '*://*.iberia.com/*',
          requestStage: 'Request',
        },
      ],
    });

    client.on('Fetch.requestPaused', async (event) => {
      const { requestId, request } = event;

      const headers = Object.entries(request.headers).map(([name, value]) => ({
        name,
        value: String(value),
      }));

      // Inyectar Authorization2 (y cualquier otra cabecera definida en authHeader)
      for (const [headerName, headerValue] of authHeaderEntries) {
        const idx = headers.findIndex(
          (h) => h.name.toLowerCase() === headerName.toLowerCase()
        );
        if (idx === -1) {
          headers.push({ name: headerName, value: headerValue });
        } else {
          headers[idx].value = headerValue;
        }
      }

      try {
        await client.send('Fetch.continueRequest', {
          requestId,
          headers,
        });
      } catch {
        // Ignorar peticiones canceladas por el navegador
      }
    });
  }
}
