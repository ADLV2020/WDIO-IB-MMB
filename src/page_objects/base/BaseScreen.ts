// src/page_objects/base/BaseScreen.ts

export abstract class BaseScreen {

  abstract screenName: string;
  abstract aliasesMap: Record<string, string>;

  public normalizeName(name: string): string {

    const cleanKey = name.trim();
    if (this.aliasesMap[cleanKey]) {
      return this.aliasesMap[cleanKey];
    }

    // Búsqueda case-insensitive en aliasesMap
    const lowerKey = cleanKey.toLowerCase();
    const matchedEntry = Object.entries(this.aliasesMap).find(
      ([alias]) => alias.toLowerCase() === lowerKey
    );

    return matchedEntry ? matchedEntry[1] : cleanKey;
    
  }

}
