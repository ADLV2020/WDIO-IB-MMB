import { BaseScreen } from '../base/BaseScreen';

export class HomeScreen extends BaseScreen {
  screenName = 'HOME';
  aliasesMap: Record<string, string> = {
    'Gestión de Reservas': 'btnGestionReservas',
    'Gestion de Reservas': 'btnGestionReservas',
    'Gestionar Reserva': 'btnGestionReservas'
  };
}
