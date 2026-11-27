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

    // Elementos de Cambio de Fecha/Hora
    flightChangeOptionTitle: '//p[contains(normalize-space(.), "Cambio de fecha/hora")]',
    flightChangeLimitText: 'p[ng-if*="dateLimitBookingSearch"]',
    // Botones que despliegan el datepicker asociado a flight-date0 (IDA) y flight-date1 (VUELTA)
    departureDateTrigger: '//label[@for="flight-date0"]/preceding-sibling::button[contains(@class,"ib-input__button")]',
    returnDateTrigger: '//label[@for="flight-date1"]/preceding-sibling::button[contains(@class,"ib-input__button")]',
    searchFlightsBtn: 'button[ng-click*="searchChangesFlights"]',
    changeAllFlightsCheckbox: '#optional_check',
    sisterCitiesCheckbox: '#sisterCitiesCheck_check',

    // Elementos del Calendario Popup (uib-datepicker)
    datepickerPopup: 'ul.uib-datepicker-popup[ng-if="isOpen"]',
    datepickerNextMonthBtn: 'ul.uib-datepicker-popup button.uib-right',
    datepickerPreviousMonthBtn: 'ul.uib-datepicker-popup button.uib-left',
    datepickerMonthTitle: 'ul.uib-datepicker-popup button.uib-title strong',

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

  /**
   * Navega en el calendario abierto hasta el mes/año de la fecha objetivo (formato YYYY-MM-DD)
   * y devuelve el elemento <button> correspondiente a ese día.
   */
  public async navigateToCalendarDayButton(isoDate: string): Promise<WebdriverIO.Element> {
    const popup = await $(this.locators.datepickerPopup);
    await popup.waitForDisplayed({ timeout: 10000 });

    const [yearStr, monthStr, dayStr] = isoDate.split('-');
    const compactDate = `${yearStr}${monthStr}${dayStr}`; // Ej: "20261126"
    const paddedDay = dayStr.padStart(2, '0'); // Ej: "01" o "26"
    const unpaddedDay = String(Number(dayStr)); // Ej: "1" o "26"
    const targetMonthYear = this.formatSpanishMonthYear(Number(yearStr), Number(monthStr));

    // 1. Navegar siempre hasta que el título del calendario coincida con el mes y año objetivo
    for (let i = 0; i < 14; i++) {
      const titleEl = await $(this.locators.datepickerMonthTitle);
      const currentMonthTitle = (await titleEl.getText()).trim().toLowerCase();

      if (currentMonthTitle === targetMonthYear) {
        break;
      }

      const currentDateValue = this.parseSpanishMonthYearToComparable(currentMonthTitle);
      const targetDateValue = Number(yearStr) * 12 + Number(monthStr);

      if (targetDateValue > currentDateValue) {
        const nextBtn = await $(this.locators.datepickerNextMonthBtn);
        await nextBtn.click();
      } else {
        const prevBtn = await $(this.locators.datepickerPreviousMonthBtn);
        await prevBtn.click();
      }
    }

    // 2. Estrategia A: Buscar por ID con fecha compacta (-YYYYMMDD) si la plantilla lo incluye
    const byIdButton = await $(`ul.uib-datepicker-popup td[id$="-${compactDate}"] button`);
    if (await byIdButton.isExisting()) {
      return byIdButton;
    }

    // 3. Estrategia B: Buscar el día activo del mes actual (excluyendo días 'text-muted' de meses adyacentes)
    const byDayNumberXpath =
      `//ul[contains(@class,"uib-datepicker-popup")]//td[contains(@class,"uib-day")]` +
      `//button[.//span[not(contains(@class,"text-muted")) and (normalize-space(.)="${paddedDay}" or normalize-space(.)="${unpaddedDay}")]]`;

    const byDayButton = await $(byDayNumberXpath);
    await byDayButton.waitForExist({ timeout: 5000 });
    return byDayButton;
  }

  /**
   * Valida si una fecha específica (YYYY-MM-DD) está habilitada (puntero normal)
   * o deshabilitada (atributo disabled -> cursor not-allowed / círculo rojo prohibido).
   */
  public async isCalendarDateEnabled(isoDate: string): Promise<boolean> {
    const dayButton = await this.navigateToCalendarDayButton(isoDate);
    await dayButton.moveTo();

    const disabledAttr = await dayButton.getAttribute('disabled');
    const parentTd = await dayButton.parentElement();
    const ariaDisabled = await parentTd.getAttribute('aria-disabled');

    return disabledAttr === null && ariaDisabled !== 'true' && (await dayButton.isEnabled());
  }

  /**
   * Selecciona una fecha habilitada (YYYY-MM-DD) en el calendario abierto.
   */
  public async selectCalendarDate(isoDate: string): Promise<void> {
    const dayButton = await this.navigateToCalendarDayButton(isoDate);
    await dayButton.moveTo();
    const isEnabled = await dayButton.isEnabled();
    if (!isEnabled) {
      throw new Error(`[CalendarError] La fecha "${isoDate}" está deshabilitada (prohibida) en el calendario y no se puede seleccionar.`);
    }
    await dayButton.click();
  }

  private formatSpanishMonthYear(year: number, month: number): string {
    const months = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    return `${months[month - 1]} ${year}`;
  }

  private parseSpanishMonthYearToComparable(label: string): number {
    const months = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    const parts = label.toLowerCase().split(/\s+/);
    const monthIndex = months.indexOf(parts[0]);
    const year = Number(parts[1]);
    return year * 12 + (monthIndex + 1);
  }

}
