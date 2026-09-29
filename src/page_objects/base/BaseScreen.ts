
export abstract class BaseScreen {
  abstract screenName: string;
  abstract aliasesMap: Record<string, string>;

  public normalizeName(name: string): string {
    const cleanKey = name.trim();
    return this.aliasesMap[cleanKey] || cleanKey;
  }
}
