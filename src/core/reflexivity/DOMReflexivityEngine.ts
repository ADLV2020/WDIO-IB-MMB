
export class DOMReflexivityEngine {
  /**
   * Busca en el DOM un elemento interactivo cuyo texto, placeholder, aria-label,
   * value, id o name coincida de forma literal o parcial con el target.
   */
  public static async findElementByReflexivity(targetText: string): Promise<WebdriverIO.Element | null> {
    const selector = [
      `//button[normalize-space(.)='${targetText}' or contains(normalize-space(.), '${targetText}')]`,
      `//a[normalize-space(.)='${targetText}' or contains(normalize-space(.), '${targetText}')]`,
      `//input[@placeholder='${targetText}' or @value='${targetText}' or @name='${targetText}' or @id='${targetText}']`,
      `//label[contains(normalize-space(.), '${targetText}')]/following-sibling::input`,
      `//*[@aria-label='${targetText}' or @title='${targetText}']`,
      `//*[normalize-space(text())='${targetText}' or contains(text(), '${targetText}')]`
    ].join(' | ').trim();

    const elements = await $$(selector);
    for (const el of elements) {
      if (await el.isDisplayed()) {
        return el;
      }
    }
    return null;
  }
}
