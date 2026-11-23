import { EnvironmentManager } from '../singleton/EnvironmentManager';

export class HeaderManager {
  public static async injectAuthHeaderIfNeeded(): Promise<void> {
    const authHeader = EnvironmentManager.getInstance().getAuthHeader();

    if (authHeader && Object.keys(authHeader).length > 0) {
      try {
        // Habilitamos el dominio de red en CDP (igual que en el proyecto anterior)
        await browser.sendCommand('Network.enable', {});

        // Pasamos authHeader directamente, ya que int.env.ts ya trae { 'Authorization2': 'Basic ...' }
        await browser.sendCommand('Network.setExtraHTTPHeaders', {
          headers: authHeader
        });

        console.log(`✅ [HeaderManager] Cabeceras inyectadas correctamente vía CDP.`);
      } catch (error) {
        console.error(`❌ [HeaderManager] Error inyectando cabeceras vía CDP:`, error);
        throw error;
      }
    }
  }
}
