// src/strategies/base/DefaultFormStrategy.ts

import { $ } from '@wdio/globals';
import { IFormStrategy } from './IFormStrategy';
import { ReflexivityResolver, PageObjectResolver } from '../../core/chain/ElementResolverChain';

export class DefaultFormStrategy implements IFormStrategy {
  private chainResolver = new PageObjectResolver();

  constructor() {
    this.chainResolver.setNext(new ReflexivityResolver());
  }

  public async typeInput(fieldName: string, value: string, pageObject: any, timeout = 10000): Promise<void> {
    const element = await this.chainResolver.resolve(fieldName, pageObject);
    await element.waitForDisplayed({ timeout });
    await element.clearValue();
    await element.setValue(value);
  }

  public async clickButton(buttonName: string, pageObject: any, timeout = 10000): Promise<void> {
    const element = await this.chainResolver.resolve(buttonName, pageObject);
    await element.waitForClickable({ timeout });
    await element.click();
  }

  public async selectOption(selectName: string, optionText: string, pageObject: any, timeout = 10000): Promise<void> {
    const element = await this.chainResolver.resolve(selectName, pageObject);
    await element.waitForDisplayed({ timeout });
    const tagName = (await element.getTagName()).toLowerCase();

    if (tagName === 'select') {
      await element.selectByVisibleText(optionText);
    } else {
      // Soporte para dropdowns custom (Angular/HTML)
      await element.click();
      const optionEl = await $(`//*[normalize-space(.)='${optionText}' and not(self::script)]`);
      await optionEl.waitForClickable({ timeout });
      await optionEl.click();
    }
  }

  public async toggleCheckbox(checkboxName: string, shouldCheck: boolean, pageObject: any, timeout = 10000): Promise<void> {
    const element = await this.chainResolver.resolve(checkboxName, pageObject);
    await element.waitForExist({ timeout });
    const isSelected = await element.isSelected();

    if (isSelected !== shouldCheck) {
      if (await element.isClickable()) {
        await element.click();
      } else {
        // Fallback para checkboxes estilizados donde el click lo recibe el <label for="id">
        const inputId = await element.getAttribute('id');
        if (inputId) {
          const label = await $(`label[for="${inputId}"]`);
          await label.waitForClickable({ timeout });
          await label.click();
        } else {
          await element.click();
        }
      }
    }
  }

  public async getElementText(elementName: string, pageObject: any, timeout = 10000): Promise<string> {
    const element = await this.chainResolver.resolve(elementName, pageObject);
    await element.waitForDisplayed({ timeout });
    const tagName = (await element.getTagName()).toLowerCase();
    const rawText = tagName === 'input' || tagName === 'textarea'
      ? await element.getValue()
      : await element.getText();
    return rawText.replace(/\s+/g, ' ').trim();
  }

  public async isElementDisplayed(elementName: string, pageObject: any, timeout = 15000): Promise<boolean> {
    try {
      const element = await this.chainResolver.resolve(elementName, pageObject);
      await element.waitForDisplayed({ timeout });
      return true;
    } catch {
      return false;
    }
  }

  public async isElementEnabled(elementName: string, pageObject: any, timeout = 15000): Promise<boolean> {
    const element = await this.chainResolver.resolve(elementName, pageObject);
    await element.waitForExist({ timeout });
    return await element.isEnabled();
  }

  public async waitForElementToDisappear(elementName: string, pageObject: any, timeout = 15000): Promise<void> {
    try {
      const element = await this.chainResolver.resolve(elementName, pageObject);
      await element.waitForDisplayed({ reverse: true, timeout });
    } catch {
      // Si ya no existe en el DOM, consideramos que ha desaparecido
    }
  }
}
