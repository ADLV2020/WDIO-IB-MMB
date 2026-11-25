// src/page_objects/mmb/ManageMyBookingPage.ts

import { browser, $ } from '@wdio/globals';
import { BasePage } from '../base/BasePage';
import { ManageMyBookingScreen } from './ManageMyBookingScreen';

export class ManageMyBookingPage extends BasePage {
  screen = new ManageMyBookingScreen();

  locators = {
    titleHeader: 'h1, .booking-title',
    // Elementos de Disrupción MMB
    disruptionMessage: '[data-ng-bind-html="disruptionCtrl.model.common.title"]',
    acceptChangesBtn: 'button[ng-click*="acceptChanges"]',
    requestRefundBtn: 'button[ng-click*="goToRefund"]',
    refundOptionsText: 'section[ng-if*="flagShowRefundArea"] p.ib-msg-alert__text--title',
    // Banner de Cookies (OneTrust)
    cookiesBanner: '#onetrust-banner-sdk',
    acceptCookiesBtn: '#onetrust-accept-btn-handler'
  };

  /**
   * Comprueba si la URL actual corresponde a una reserva en estado de disrupción
   */
  public async isDisruptedBooking(): Promise<boolean> {
    const currentUrl = await browser.getUrl();
    return currentUrl.includes('#!/disrptn');
  }

  /**
   * Comprueba si la URL actual corresponde al dashboard normal de MMB
   */
  public async isNormalBookingDashboard(): Promise<boolean> {
    const currentUrl = await browser.getUrl();
    return currentUrl.includes('#!/ibdash');
  }

  /**
   * Obtiene el texto normalizado del mensaje de disrupción ("Lo sentimos, el horario...")
   */
  public async getDisruptionTitleText(): Promise<string> {
    const el = await $(this.locators.disruptionMessage);
    await el.waitForDisplayed({ timeout: 15000 });
    return (await el.getText()).trim();
  }

  /**
   * Obtiene el texto limpio de las opciones de reembolso disponibles
   */
  public async getRefundOptionsText(): Promise<string> {
    const el = await $(this.locators.refundOptionsText);
    await el.waitForDisplayed({ timeout: 15000 });
    const rawText = await el.getText();
    return rawText.replace(/\s+/g, ' ').trim();
  }

  /**
   * Acepta cookies si el banner OneTrust aparece en el timeout dado; si no, continúa
   */
  public async acceptCookiesIfVisible(timeout = 15000): Promise<void> {
    try {
      const banner = await $(this.locators.cookiesBanner);
      const isBannerVisible = await banner.waitForDisplayed({ timeout });

      if (isBannerVisible) {
        const acceptBtn = await $(this.locators.acceptCookiesBtn);
        await acceptBtn.waitForClickable({ timeout: 5000 });
        await acceptBtn.click();
        await banner.waitForDisplayed({ reverse: true, timeout: 5000 });
        console.log('✅ Banner de cookies aceptado');
      }
    } catch {
      console.log('⚠️ Banner de cookies NO apareció en el tiempo estipulado, continuando flujo...');
    }
  }
}
