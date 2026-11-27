import { Given, When, Then } from '@wdio/cucumber-framework';
import { expect } from '@wdio/globals';
import allureReporter from '@wdio/allure-reporter';
import { AirlineNavigationFacade } from '@facade/AirlineNavigationFacade.js';
import { ManageMyBookingPage } from '@page_objects/mmb/ManageMyBookingPage';

const mmbPage = new ManageMyBookingPage();

Then(/^valida el texto literal "([^"]*)" en la pantalla "([^"]*)"$/, async (expectedText: string, screenName: string) => {
  await AirlineNavigationFacade.verifyLiteralText(expectedText);
  allureReporter.addStep(`Validación de texto literal "${expectedText}" en pantalla "${screenName}" procesada de forma exitosa`);
});

When('acepta todas las politicas de cookies de Iberia', async () => {
  console.log('🍪 Gestionando banner de cookies...');
  await mmbPage.acceptCookiesIfVisible(15000);
  allureReporter.addStep('Aceptación de políticas de cookies procesada de forma exitosa');
});

// ###################################################################

Given(/^se accede a "([^"]*)"$/, async (screenName: string) => {
  await AirlineNavigationFacade.navigateToHome(screenName);
  allureReporter.addStep(`Acceso a pantalla "${screenName}" procesado de forma exitosa`);
});

When(/^hace click en "([^"]*)" de la pantalla "([^"]*)"$/, async (elementName: string, screenName: string) => {
  await AirlineNavigationFacade.clickElement(elementName, screenName);
  allureReporter.addStep(`Click en elemento "${elementName}" de pantalla "${screenName}" procesado de forma exitosa`);
});

When(/^selecciona "([^"]*)" de la lista "([^"]*)" de la pantalla "([^"]*)"$/, async (option: string, selectName: string, screenName: string) => {
  await AirlineNavigationFacade.selectOption(option, selectName, screenName);
  allureReporter.addStep(`Selección de opción "${option}" en lista "${selectName}" de pantalla "${screenName}" procesada de forma exitosa`);
});

When(/^ingresa "([^"]*)" en el campo "([^"]*)" de la pantalla "([^"]*)"$/, async (value: string, fieldName: string, screenName: string) => {
  await AirlineNavigationFacade.enterText(value, fieldName, screenName);
  allureReporter.addStep(`Ingreso de valor "${value}" en campo "${fieldName}" de pantalla "${screenName}" procesado de forma exitosa`);
});

When(/^marca la casilla "([^"]*)" de la pantalla "([^"]*)"$/, async (checkboxName: string, screenName: string) => {
  await AirlineNavigationFacade.toggleCheckbox(checkboxName, true, screenName);
  allureReporter.addStep(`Marca de casilla "${checkboxName}" en pantalla "${screenName}" procesada de forma exitosa`);
});

When(/^desmarca la casilla "([^"]*)" de la pantalla "([^"]*)"$/, async (checkboxName: string, screenName: string) => {
  await AirlineNavigationFacade.toggleCheckbox(checkboxName, false, screenName);
  allureReporter.addStep(`Desmarca de casilla "${checkboxName}" en pantalla "${screenName}" procesada de forma exitosa`);
});

When(/^espera a que desaparezca "([^"]*)" de la pantalla "([^"]*)"$/, async (elementName: string, screenName: string) => {
  await AirlineNavigationFacade.waitForDisappear(elementName, screenName);
  allureReporter.addStep(`Espera a que desaparezca elemento "${elementName}" de pantalla "${screenName}" procesada de forma exitosa`);
});

Then(/^valida el texto "([^"]*)" en el campo "([^"]*)" de la pantalla "([^"]*)"$/, async (expectedText: string, fieldName: string, screenName: string) => {
  await AirlineNavigationFacade.verifyElementText(expectedText, fieldName, screenName);
  allureReporter.addStep(`Validación de texto "${expectedText}" en campo "${fieldName}" de pantalla "${screenName}" procesada de forma exitosa`);
});

Then(/^valida que el elemento "([^"]*)" esta visible en la pantalla "([^"]*)"$/, async (elementName: string, screenName: string) => {
  await AirlineNavigationFacade.verifyElementVisibility(elementName, screenName, true);
  allureReporter.addStep(`Validación de visibilidad de elemento "${elementName}" en pantalla "${screenName}" procesada de forma exitosa`);
});

Then(/^valida que el elemento "([^"]*)" no esta visible en la pantalla "([^"]*)"$/, async (elementName: string, screenName: string) => {
  await AirlineNavigationFacade.verifyElementVisibility(elementName, screenName, false);
  allureReporter.addStep(`Validación de invisibilidad de elemento "${elementName}" en pantalla "${screenName}" procesada de forma exitosa`);
});

Then(/^valida que el elemento "([^"]*)" esta habilitado en la pantalla "([^"]*)"$/, async (elementName: string, screenName: string) => {
  await AirlineNavigationFacade.verifyElementEnabled(elementName, screenName, true);
  allureReporter.addStep(`Validación de habilitación de elemento "${elementName}" en pantalla "${screenName}" procesada de forma exitosa`);
});

Then(/^valida que la URL contiene "([^"]*)"$/, async (urlFragment: string) => {
  await AirlineNavigationFacade.verifyUrlContains(urlFragment, 35000);
  allureReporter.addStep(`Validación de fragmento de URL "${urlFragment}" procesada de forma exitosa`);
});

When(/^selecciona la fecha "([^"]*)" en el calendario de la pantalla "([^"]*)"$/, async (isoDate: string, screenName: string) => {
  await AirlineNavigationFacade.selectDateInCalendar(isoDate, screenName);
  allureReporter.addStep(`Selección de fecha "${isoDate}" en calendario de "${screenName}" procesada`);
});

Then(/^valida que la fecha "([^"]*)" esta habilitada en el calendario de la pantalla "([^"]*)"$/, async (isoDate: string, screenName: string) => {
  await AirlineNavigationFacade.verifyCalendarDateState(isoDate, true, screenName);
  allureReporter.addStep(`Validación de fecha habilitada "${isoDate}" en calendario de "${screenName}" exitosa`);
});

Then(/^valida que la fecha "([^"]*)" esta deshabilitada en el calendario de la pantalla "([^"]*)"$/, async (isoDate: string, screenName: string) => {
  await AirlineNavigationFacade.verifyCalendarDateState(isoDate, false, screenName);
  allureReporter.addStep(`Validación de fecha prohibida/deshabilitada "${isoDate}" en calendario de "${screenName}" exitosa`);
});

Then(/^valida que el calendario de la pantalla "([^"]*)" permite fechas desde "([^"]*)" hasta "([^"]*)"$/, async (screenName: string, minIsoDate: string, maxIsoDate: string) => {
  await AirlineNavigationFacade.verifyCalendarWindowFromDates(minIsoDate, maxIsoDate, screenName);
  allureReporter.addStep(`Validación de ventana de fechas [${minIsoDate} .. ${maxIsoDate}] en "${screenName}" exitosa`);
});
