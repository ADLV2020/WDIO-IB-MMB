// src/strategies/base/IFormStrategy.ts

export interface IFormStrategy {
  typeInput(fieldName: string, value: string, pageObject: any): Promise<void>;
  clickButton(buttonName: string, pageObject: any): Promise<void>;
  selectOption(selectName: string, optionText: string, pageObject: any): Promise<void>;
  toggleCheckbox(checkboxName: string, shouldCheck: boolean, pageObject: any): Promise<void>;
  getElementText(elementName: string, pageObject: any): Promise<string>;
  isElementDisplayed(elementName: string, pageObject: any): Promise<boolean>;
  isElementEnabled(elementName: string, pageObject: any): Promise<boolean>;
  waitForElementToDisappear(elementName: string, pageObject: any, timeout?: number): Promise<void>;
}
