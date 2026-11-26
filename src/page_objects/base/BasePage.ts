// src/page_objects/base/BasePage.ts

import { $ } from '@wdio/globals';
import { BaseScreen } from './BaseScreen';

export abstract class BasePage {

  abstract screen: BaseScreen;
  abstract locators: Record<string, string>;

  // Locators globales compartidos por todas las pantallas
  protected globalLocators: Record<string, string> = {

    cookiesBanner: '#onetrust-banner-sdk',
    acceptCookiesBtn: '#onetrust-accept-btn-handler'

  };

  /**
   * Resuelve el locator desde el PageObject.
   * Devuelve null si no está mapeado para permitir que ReflexivityResolver actúe.
   */
  public async getLocator(logicalName: string): Promise<WebdriverIO.Element | null> {

    const normalizedKey = this.screen.normalizeName(logicalName);
    const selector = this.locators[normalizedKey] || this.globalLocators[normalizedKey];

    if (!selector) {
      return null;
    }

    return $(selector);

  }

  /**
   * Acepta el banner de cookies OneTrust si aparece dentro del timeout indicado
   */
  public async acceptCookiesIfVisible(timeout = 15000): Promise<void> {

    try {

      const banner = await $(this.globalLocators.cookiesBanner);
      const isBannerVisible = await banner.waitForDisplayed({ timeout });

      if (isBannerVisible) {

        const acceptBtn = await $(this.globalLocators.acceptCookiesBtn);
        await acceptBtn.waitForClickable({ timeout: 5000 });
        await acceptBtn.click();
        await banner.waitForDisplayed({ reverse: true, timeout: 5000 });

      }
      
    } catch {
      // Si el banner no aparece, continuamos el flujo sin interrumpir el test
    }
  }
}
