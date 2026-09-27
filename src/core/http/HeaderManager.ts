import { EnvironmentManager } from '../singleton/EnvironmentManager';

export class HeaderManager {
  public static async injectAuthHeaderIfNeeded(): Promise<void> {
    const authHeader = EnvironmentManager.getInstance().getAuthHeader();
    if (authHeader) {
      // Inyección de cabecera usando protocolo DevTools (CDP) de Chrome
      const puppeteer = await browser.getPuppeteer();
      const pages = await puppeteer.pages();
      const page = pages[0] || (await puppeteer.newPage());
      
      await page.setExtraHTTPHeaders({
        'Authorization2': authHeader
      });
    }
  }
}
