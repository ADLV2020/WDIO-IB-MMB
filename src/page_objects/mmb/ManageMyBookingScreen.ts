// src/page_objects/mmb/ManageMyBookingScreen.ts

import { BaseScreen } from '@page_objects/base/BaseScreen';

export class ManageMyBookingScreen extends BaseScreen {
  screenName = 'ManageMyBooking';
  aliasesMap: Record<string, string> = {
    'titulo': 'titleHeader',
    'mensaje disrupcion': 'disruptionMessage',
    'lo sentimos': 'disruptionMessage',
    'aceptar': 'acceptChangesBtn',
    'aceptar cambios': 'acceptChangesBtn',
    'solicitar': 'requestRefundBtn',
    'solicitar reembolso': 'requestRefundBtn',
    'texto reembolso': 'refundOptionsText',
    'opciones reembolso': 'refundOptionsText',
    'banner cookies': 'cookiesBanner',
    'aceptar cookies': 'acceptCookiesBtn'
  };

  public normalizeName(name: string): string {
    return name.trim().toLowerCase();
  }
}
