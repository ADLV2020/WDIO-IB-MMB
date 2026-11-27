// src/facade/AirlineNavigationFacade.ts

import { browser, expect } from '@wdio/globals';
import { EnvironmentManager } from '@core/singleton/EnvironmentManager';
import { HeaderManager } from '@core/http/HeaderManager';
import { FormStrategyFactory } from '@strategies/factories/FormStrategyFactory';
import { HomePage } from '@page_objects/home/HomePage';
import { BookingManagementPage } from '@page_objects/booking_management/BookingManagementPage';
import { ManageMyBookingPage } from '@page_objects/mmb/ManageMyBookingPage';

export class AirlineNavigationFacade {

  private static pages: Record<string, any> = {
    'HOME': new HomePage(),
    'pantallaHome': new HomePage(),
    'GestionDeReservas': new BookingManagementPage(),
    'ManageMyBooking': new ManageMyBookingPage()
  };

  public static async navigateToHome(_screenName?: string): Promise<void> {
    await HeaderManager.injectAuthHeaderIfNeeded();
    const url = EnvironmentManager.getInstance().getBaseUrl();
    await browser.url(url);
  }

  public static async clickElement(elementName: string, screenName: string): Promise<void> {
    const page = this.getPage(screenName);
    const strategy = FormStrategyFactory.getStrategy(screenName);
    await strategy.clickButton(elementName, page);
  }

  public static async enterText(value: string, fieldName: string, screenName: string): Promise<void> {
    const page = this.getPage(screenName);
    const strategy = FormStrategyFactory.getStrategy(screenName);
    const effectiveValue = this.resolveDynamicParameter(value, fieldName);
    await strategy.typeInput(fieldName, effectiveValue, page);
  }

  public static async selectOption(option: string, selectName: string, screenName: string): Promise<void> {
    const page = this.getPage(screenName);
    const strategy = FormStrategyFactory.getStrategy(screenName);
    await strategy.selectOption(selectName, option, page);
  }

  public static async toggleCheckbox(checkboxName: string, shouldCheck: boolean, screenName: string): Promise<void> {
    const page = this.getPage(screenName);
    const strategy = FormStrategyFactory.getStrategy(screenName);
    await strategy.toggleCheckbox(checkboxName, shouldCheck, page);
  }

  public static async verifyElementText(expectedText: string, fieldName: string, screenName: string): Promise<void> {
    const page = this.getPage(screenName);
    const strategy = FormStrategyFactory.getStrategy(screenName);
    const actualText = await strategy.getElementText(fieldName, page);
    expect(actualText).toContain(expectedText);
  }

  public static async verifyElementVisibility(elementName: string, screenName: string, shouldBeVisible: boolean): Promise<void> {
    const page = this.getPage(screenName);
    const strategy = FormStrategyFactory.getStrategy(screenName);
    const isVisible = await strategy.isElementDisplayed(elementName, page);
    expect(isVisible).toBe(shouldBeVisible);
  }

  public static async verifyElementEnabled(elementName: string, screenName: string, shouldBeEnabled: boolean): Promise<void> {
    const page = this.getPage(screenName);
    const strategy = FormStrategyFactory.getStrategy(screenName);
    const isEnabled = await strategy.isElementEnabled(elementName, page);
    expect(isEnabled).toBe(shouldBeEnabled);
  }

  public static async waitForDisappear(elementName: string, screenName: string): Promise<void> {
    const page = this.getPage(screenName);
    const strategy = FormStrategyFactory.getStrategy(screenName);
    await strategy.waitForElementToDisappear(elementName, page);
  }

  public static async verifyUrlContains(fragment: string, timeout: number = 15000): Promise<void> {
    await browser.waitUntil(
      async () => (await browser.getUrl()).includes(fragment),
      { timeout: timeout, timeoutMsg: `La URL no contiene "${fragment}". URL actual: ${await browser.getUrl()}` }
    );
  }

  private static getPage(screenName: string): any {
    const page = this.pages[screenName];
    if (!page) {
      throw new Error(`[FacadeError] La pantalla "${screenName}" no está registrada en el Facade.`);
    }
    return page;
  }

  public static async verifyScreenAccess(screenName: string): Promise<void> {
    await HeaderManager.injectAuthHeaderIfNeeded();
    const page = this.getPage(screenName);
    expect(page).toBeDefined();
    await browser.pause(2000); // Espera de estabilización
  }

  public static async verifyLiteralText(expectedText: string): Promise<void> {
    const pageSource = await browser.getPageSource();
    expect(pageSource).toContain(expectedText);
  }

  public static async selectDateInCalendar(dateInput: string, screenName: string): Promise<void> {
    const page = this.getPage(screenName);
    const isoDate = this.resolveIsoDate(dateInput);
    await page.selectCalendarDate(isoDate);
  }

  public static async verifyCalendarDateState(
    dateInput: string,
    shouldBeEnabled: boolean,
    screenName: string
  ): Promise<void> {
    const page = this.getPage(screenName);
    const isoDate = this.resolveIsoDate(dateInput);
    const isEnabled = await page.isCalendarDateEnabled(isoDate);
    expect(isEnabled).toBe(shouldBeEnabled);
  }

  /**
   * Valida en bloque las reglas de ventana de días permitidos (ej: desde hoy hasta +30 días)
   * comprobando el día límite inferior, un día intermedio, el límite superior (+maxDays)
   * y el día inmediatamente fuera de rango (+maxDays + 1 y ayer).
   */
  public static async verifyCalendarWindowFromDates(
    minDateInput: string,
    maxDateInput: string,
    screenName: string
  ): Promise<void> {
    const page = this.getPage(screenName);
    const minIsoDate = this.resolveIsoDate(minDateInput);
    const maxIsoDate = this.resolveIsoDate(maxDateInput);
    const dayBeforeMin = this.addDaysToIsoDate(minIsoDate, -1);
    const dayAfterMax = this.addDaysToIsoDate(maxIsoDate, 1);

    // 1. El día anterior al mínimo debe estar prohibido (disabled / círculo rojo)
    expect(await page.isCalendarDateEnabled(dayBeforeMin)).toBe(false);
    // 2. El día mínimo permitido debe estar habilitado
    expect(await page.isCalendarDateEnabled(minIsoDate)).toBe(true);
    // 3. El día máximo permitido debe estar habilitado
    expect(await page.isCalendarDateEnabled(maxIsoDate)).toBe(true);
    // 4. El día posterior al máximo debe estar prohibido (disabled / círculo rojo)
    expect(await page.isCalendarDateEnabled(dayAfterMax)).toBe(false);
  }

  /**
   * Recibe y Convierte "HOY", "HOY+N", "HOY-N" o "YYYY-MM-DD" a formato ISO "YYYY-MM-DD"
   */
  private static resolveIsoDate(input: string): string {
    const clean = input.trim().toUpperCase();
    if (clean === 'HOY') {
      return new Date().toISOString().split('T')[0];
    }
    const match = clean.match(/^HOY([+-]\d+)$/);
    if (match) {
      const todayIso = new Date().toISOString().split('T')[0];
      return this.addDaysToIsoDate(todayIso, Number(match[1]));
    }
    return input.trim();
  }

  private static addDaysToIsoDate(isoDate: string, days: number): string {
    const [y, m, d] = isoDate.split('-').map(Number);
    const date = new Date(Date.UTC(y, m - 1, d));
    date.setUTCDate(date.getUTCDate() + days);
    return date.toISOString().split('T')[0];
  }

  private static resolveDynamicParameter(defaultValue: string, fieldName: string): string {
    const normalizedField = fieldName.trim().toLowerCase();

    if ((normalizedField === 'pnr' || normalizedField === 'localizador') && process.env.PNR?.trim()) {
      return process.env.PNR.trim().toUpperCase();
    }

    if ((normalizedField === 'apellido' || normalizedField === 'surname') && process.env.SURNAME?.trim()) {
      return process.env.SURNAME.trim().toUpperCase();
    }

    return defaultValue;
  }

}
