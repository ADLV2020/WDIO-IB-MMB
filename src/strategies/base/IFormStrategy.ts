export interface IFormStrategy {
  typeInput(fieldName: string, value: string, pageObject: any): Promise<void>;
  clickButton(buttonName: string, pageObject: any): Promise<void>;
}
