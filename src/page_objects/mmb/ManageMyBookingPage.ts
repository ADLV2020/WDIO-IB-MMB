import { BasePage } from '../base/BasePage';
import { ManageMyBookingScreen } from './ManageMyBookingScreen';

export class ManageMyBookingPage extends BasePage {
  screen = new ManageMyBookingScreen();
  locators = {
    titleHeader: 'h1, .booking-title'
  };
}