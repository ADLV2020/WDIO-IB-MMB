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
    await strategy.typeInput(fieldName, value, page);
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

  public static async verifyUrlContains(fragment: string): Promise<void> {
    await browser.waitUntil(
      async () => (await browser.getUrl()).includes(fragment),
      { timeout: 15000, timeoutMsg: `La URL no contiene "${fragment}". URL actual: ${await browser.getUrl()}` }
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

}
