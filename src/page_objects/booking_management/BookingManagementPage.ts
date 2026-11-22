import { BasePage } from '../base/BasePage';
import { BookingManagementScreen } from './BookingManagementScreen';

export class BookingManagementPage extends BasePage {
  screen = new BookingManagementScreen();
  locators = {
    inputApellido: 'input[name="surname"], input#surname',
    inputTicket: 'input[name="bookingCode"], input#pnr',
    btnGestionar: 'button[type="submit"], #btn-manage-booking'
  };
}
