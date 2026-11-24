import { BaseScreen } from '@page_objects/base/BaseScreen';

export class ManageMyBookingScreen extends BaseScreen {
  screenName = 'ManageMyBooking';
  aliasesMap: Record<string, string> = {};

  public normalizeName(name: string): string {
    return name.trim().toLowerCase();
  }

}
