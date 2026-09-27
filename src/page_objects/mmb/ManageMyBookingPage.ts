import { BaseScreen } from '../base/BaseScreen';
import { BasePage } from '../base/BasePage';

export class ManageMyBookingPage extends BasePage {
  screen = new ManageMyBookingScreen();
  locators = {
    titleHeader: 'h1, .booking-title'
  };
}