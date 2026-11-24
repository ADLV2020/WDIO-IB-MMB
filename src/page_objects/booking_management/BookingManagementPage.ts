
import { BasePage } from '../base/BasePage';
import { BookingManagementScreen } from './BookingManagementScreen';

export class BookingManagementPage extends BasePage {
  screen = new BookingManagementScreen();
  locators = {
    // 1. Modal de error general
    btnAceptarModalError: '#MOD_ERROR_BOTON_ACCEPT',

    // 2. Tab "Con Datos de reserva"
    tabDatosReserva: 'button[role="tab"][aria-label="Acceso con datos de reserva"]',

    // 3. Formulario de consulta de reserva
    inputApellido: 'input[name="surname"]',
    inputPnr: 'input[name="pnr"]',
    btnAccederReserva: 'button[type="submit"][aria-label="Acceder a la reserva"]'
  };
}
