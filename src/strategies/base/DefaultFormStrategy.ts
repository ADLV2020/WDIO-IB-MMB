import { IFormStrategy } from './IFormStrategy';
import { ReflexivityResolver, PageObjectResolver } from '../../core/chain/ElementResolverChain';

export class DefaultFormStrategy implements IFormStrategy {
  private chainResolver = new ReflexivityResolver();

  constructor() {
    this.chainResolver.setNext(new PageObjectResolver());
  }

  public async typeInput(fieldName: string, value: string, pageObject: any): Promise<void> {
    const element = await this.chainResolver.resolve(fieldName, pageObject);
    await element.waitForDisplayed({ timeout: 10000 });
    await element.setValue(value);
  }

  public async clickButton(buttonName: string, pageObject: any): Promise<void> {
    const element = await this.chainResolver.resolve(buttonName, pageObject);
    await element.waitForClickable({ timeout: 10000 });
    await element.click();
  }
}
