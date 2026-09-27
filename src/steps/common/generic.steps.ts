import { Given, When, Then } from '@cucumber/cucumber';
import { AirlineNavigationFacade } from '../../facade/AirlineNavigationFacade';

Given(/^un usuario con PNR "([^"]*)" y apellido "([^"]*)"$/, async (pnr: string, apellido: string) => {
  // Contexto de datos en sesión/world si se requiere
});

Given(/^se accede a "([^"]*)"$/, async (screenName: string) => {
  await AirlineNavigationFacade.navigateToHome();
});

When(/^hace click en "([^"]*)" de la pantalla "([^"]*)"$/, async (elementName: string, screenName: string) => {
  await AirlineNavigationFacade.clickElement(elementName, screenName);
});

When(/^ingresa "([^"]*)" en el campo "([^"]*)" de la pantalla "([^"]*)"$/, async (value: string, fieldName: string, screenName: string) => {
  await AirlineNavigationFacade.enterText(value, fieldName, screenName);
});

Then(/^se accede a la pantalla "([^"]*)"$/, async (screenName: string) => {
  await AirlineNavigationFacade.verifyScreenAccess(screenName);
});

Then(/^valida el texto literal "([^"]*)" en la pantalla "([^"]*)"$/, async (expectedText: string, screenName: string) => {
  await AirlineNavigationFacade.verifyLiteralText(expectedText);
});
