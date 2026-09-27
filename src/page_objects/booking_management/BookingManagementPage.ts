import { BaseScreen } from '../base/BaseScreen';
import { BasePage } from '../base/BasePage';

export class BookingManagementPage extends BasePage {
  screen = new BookingManagementScreen();
  locators = {
    inputApellido: 'input[name="surname"], input#surname',
    inputTicket: 'input[name="bookingCode"], input#pnr',
    btnGestionar: 'button[type="submit"], #btn-manage-booking'
  };
}
