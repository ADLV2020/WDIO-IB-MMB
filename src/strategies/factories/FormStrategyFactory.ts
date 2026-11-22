import { IFormStrategy } from '../base/IFormStrategy';
import { DefaultFormStrategy } from '../base/DefaultFormStrategy';

export class FormStrategyFactory {
  private static strategies: Record<string, IFormStrategy> = {};

  public static getStrategy(screenName: string): IFormStrategy {
    // Si se requiere un comportamiento único por pantalla se evalúa aquí
    if (!this.strategies[screenName]) {
      this.strategies[screenName] = new DefaultFormStrategy();
    }
    return this.strategies[screenName];
  }
}
