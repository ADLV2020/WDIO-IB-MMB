
import { BaseScreen } from '../base/BaseScreen';

export class BookingManagementScreen extends BaseScreen {
  screenName = 'GestionDeReservas';
  aliasesMap: Record<string, string> = {
    // Modal de error
    'Aceptar': 'btnAceptarModalError',
    'Aceptar Error': 'btnAceptarModalError',

    // Pestañas de acceso
    'Con Datos de reserva': 'tabDatosReserva',
    'Con datos de reserva': 'tabDatosReserva',

    // Campos del formulario
    'Apellido': 'inputApellido',
    'Apellido del pasajero': 'inputApellido',
    'Ticket': 'inputPnr',
    'PNR': 'inputPnr',
    'Código de reserva': 'inputPnr',

    // Botón de envío del formulario
    'Acceder a la reserva': 'btnAccederReserva',
    'Gestionar': 'btnAccederReserva'
  };
}
