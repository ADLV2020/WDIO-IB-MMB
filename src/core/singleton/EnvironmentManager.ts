// src/core/singleton/EnvironmentManager.ts

import { INT_ENV, PRE_ENV } from '@env/int.env';

export class EnvironmentManager {
  
  private static instance: EnvironmentManager;
  private currentEnv: typeof INT_ENV;

  private constructor() {
    const rawEnv = (process.env.ENV || 'INT').toUpperCase();
    const resolvedEnv = rawEnv === 'DEFAULT' ? 'INT' : rawEnv;
    this.currentEnv = resolvedEnv === 'PRE' ? PRE_ENV : INT_ENV;
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

  public getAuthHeader(): { [key: string]: string } | undefined {
    return this.currentEnv.authHeader;
  }

}
