import { EnvironmentManager } from '../core/singleton/EnvironmentManager';
import { HeaderManager } from '../core/http/HeaderManager';
import { FormStrategyFactory } from '../strategies/factories/FormStrategyFactory';
import { HomePage } from '../page_objects/home/HomePage';
import { BookingManagementPage } from '../page_objects/booking_management/BookingManagementPage';
import { ManageMyBookingPage } from '../page_objects/mmb/ManageMyBookingPage';

export class AirlineNavigationFacade {
  private static pages: Record<string, any> = {
    'HOME': new HomePage(),
    'pantallaHome': new HomePage(),
    'GestionDeReservas': new BookingManagementPage(),
    'ManageMyBooking': new ManageMyBookingPage()
  };

  public static async navigateToHome(): Promise<void> {
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

  public static async verifyScreenAccess(screenName: string): Promise<void> {
    const page = this.getPage(screenName);
    expect(page).toBeDefined();
    await browser.pause(2000); // Espera de estabilización
  }

  public static async verifyLiteralText(expectedText: string): Promise<void> {
    const pageSource = await browser.getPageSource();
    expect(pageSource).toContain(expectedText);
  }

  private static getPage(screenName: string): any {
    const page = this.pages[screenName];
    if (!page) {
      throw new Error(`[FacadeError] La pantalla "${screenName}" no está registrada en el Facade.`);
    }
    return page;
  }
}
