import { BaseScreen } from './BaseScreen';

export abstract class BasePage {
  abstract screen: BaseScreen;
  abstract locators: Record<string, string>;

  public async getLocator(logicalName: string): Promise<WebdriverIO.Element> {
    const normalizedKey = this.screen.normalizeName(logicalName);
    const selector = this.locators[normalizedKey];
    if (!selector) {
      throw new Error(`[PageError] No existe un locator mapeado para "${logicalName}" en ${this.screen.screenName}`);
    }
    return $(selector);
  }
}
