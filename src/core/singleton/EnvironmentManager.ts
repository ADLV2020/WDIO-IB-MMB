import { INT_ENV } from '../../../config/env/int.env';

export class EnvironmentManager {
  private static instance: EnvironmentManager;
  private currentEnv: typeof INT_ENV;

  private constructor() {
    // Por defecto toma INT, expandible con process.env.ENV
    this.currentEnv = INT_ENV;
  }

  public static getInstance(): EnvironmentManager {
    if (!EnvironmentManager.instance) {
      EnvironmentManager.instance = new EnvironmentManager();
    }
    return EnvironmentManager.instance;
  }

  public getBaseUrl(): string {
    return this.currentEnv.baseUrl;
  }

  public getAuthHeader(): string {
    return this.currentEnv.authHeader;
  }
}
