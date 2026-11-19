import { BasePage } from '../base/BasePage.js';
import { BookingManagementScreen } from './BookingManagementScreen.js';

export class BookingManagementPage extends BasePage {
  screen = new BookingManagementScreen();
  locators = {
    inputApellido: 'input[name="surname"], input#surname',
    inputTicket: 'input[name="bookingCode"], input#pnr',
    btnGestionar: 'button[type="submit"], #btn-manage-booking'
  };
}
