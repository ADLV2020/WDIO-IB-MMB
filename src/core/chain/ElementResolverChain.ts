import { DOMReflexivityEngine } from '../reflexivity/DOMReflexivityEngine';

export interface ElementResolver {
  setNext(resolver: ElementResolver): ElementResolver;
  resolve(targetName: string, pageObject?: any): Promise<WebdriverIO.Element>;
}

export abstract class BaseElementResolver implements ElementResolver {
  private nextResolver?: ElementResolver;

  public setNext(resolver: ElementResolver): ElementResolver {
    this.nextResolver = resolver;
    return resolver;
  }

  public async resolve(targetName: string, pageObject?: any): Promise<WebdriverIO.Element> {
    if (this.nextResolver) {
      return this.nextResolver.resolve(targetName, pageObject);
    }
    throw new Error(`[ChainError] No se pudo encontrar el elemento: "${targetName}" por Reflexividad ni por PageObject.`);
  }
}

export class ReflexivityResolver extends BaseElementResolver {
  public async resolve(targetName: string, pageObject?: any): Promise<WebdriverIO.Element> {
    const element = await DOMReflexivityEngine.findElementByReflexivity(targetName);
    if (element && (await element.isExisting())) {
      return element;
    }
    return super.resolve(targetName, pageObject);
  }
}

export class PageObjectResolver extends BaseElementResolver {
  public async resolve(targetName: string, pageObject?: any): Promise<WebdriverIO.Element> {
    if (pageObject && typeof pageObject.getLocator === 'function') {
      const element = await pageObject.getLocator(targetName);
      if (element) return element;
    }
    return super.resolve(targetName, pageObject);
  }
}
