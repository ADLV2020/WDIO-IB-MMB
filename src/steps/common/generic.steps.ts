import { Given, When, Then } from '@wdio/cucumber-framework';
import { AirlineNavigationFacade } from '@facade/AirlineNavigationFacade.js';

Given(/^un usuario con PNR "([^"]*)" y apellido "([^"]*)"$/, async (pnr: string, apellido: string) => {
  //Contexto de datos en sesión/world si se requiere
});

Given(/^se accede a "([^"]*)"$/, async (screenName: string) => {
  await AirlineNavigationFacade.navigateToHome(screenName);
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


Given(/^se accede a portal$/, async () => {
  await AirlineNavigationFacade.navigateToHome('HOME');
});
Given(/^se accede a manage my booking$/, async () => {
  //
  await browser.pause(5000);
});
When(/^se ingresa el apellido$/, async () => {
  //
  await browser.pause(5000);
});
When(/^se ingresa el PNR$/, async () => {
  //
  await browser.pause(5000);
});
When(/^se hace click en gestionar$/, async () => {
  //
  await browser.pause(5000);
});
