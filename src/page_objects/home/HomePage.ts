import { BasePage } from '../base/BasePage.js';
import { HomeScreen } from './HomeScreen.js';

export class HomePage extends BasePage {
  screen = new HomeScreen();
  locators = {
    btnGestionReservas: '//button[contains(text(),"Gestión de Reservas")] | //a[contains(@href,"gestion")]'
  };
}
