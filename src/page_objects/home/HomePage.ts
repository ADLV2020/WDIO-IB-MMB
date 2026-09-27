import { BaseScreen } from '../base/BaseScreen';
import { BasePage } from '../base/BasePage';
import { HomeScreen } from './HomeScreen';

export class HomePage extends BasePage {
  screen = new HomeScreen();
  locators = {
    btnGestionReservas: '//button[contains(text(),"Gestión de Reservas")] | //a[contains(@href,"gestion")]'
  };
}
