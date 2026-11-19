import { BasePage } from '../base/BasePage.js';
import { ManageMyBookingScreen } from './ManageMyBookingScreen.js';

export class ManageMyBookingPage extends BasePage {
  screen = new ManageMyBookingScreen();
  locators = {
    titleHeader: 'h1, .booking-title'
  };
}