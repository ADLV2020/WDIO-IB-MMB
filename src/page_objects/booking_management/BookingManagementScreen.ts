import { BaseScreen } from '../base/BaseScreen';
import { BasePage } from '../base/BasePage';

export class BookingManagementScreen extends BaseScreen {
  screenName = 'GestionDeReservas';
  aliasesMap: Record<string, string> = {
    'Apellido': 'inputApellido',
    'Ticket': 'inputTicket',
    'PNR': 'inputTicket',
    'Gestionar': 'btnGestionar'
  };
}
