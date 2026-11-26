import { Given, When, Then } from '@wdio/cucumber-framework';
import { expect } from '@wdio/globals';
import allureReporter from '@wdio/allure-reporter';
import { AirlineNavigationFacade } from '@facade/AirlineNavigationFacade.js';
import { ManageMyBookingPage } from '@page_objects/mmb/ManageMyBookingPage';

const mmbPage = new ManageMyBookingPage();

Given(/^un usuario con PNR "([^"]*)" y apellido "([^"]*)"$/, async (pnr: string, apellido: string) => {
  //Contexto de datos en sesión/world si se requiere
  allureReporter.addStep(`Usuario con PNR "${pnr}" y apellido "${apellido}" configurado en el contexto de prueba`);
});

Then(/^se accede a la pantalla "([^"]*)"$/, async (screenName: string) => {
  await AirlineNavigationFacade.verifyScreenAccess(screenName);
  allureReporter.addStep(`Acceso a pantalla "${screenName}" procesado de forma exitosa`);
});

Then(/^valida el texto literal "([^"]*)" en la pantalla "([^"]*)"$/, async (expectedText: string, screenName: string) => {
  await AirlineNavigationFacade.verifyLiteralText(expectedText);
  allureReporter.addStep(`Validación de texto literal "${expectedText}" en pantalla "${screenName}" procesada de forma exitosa`);
});


Given(/^se accede a manage my booking$/, async () => {
  //
  await browser.pause(5000);
  allureReporter.addStep('Acceso a pantalla "Manage My Booking" procesado de forma exitosa');
});
When(/^se hace click en gestionar$/, async () => {
  //
  await browser.pause(35000);
  allureReporter.addStep('Click en "Gestionar" procesado de forma exitosa');

});

When('acepta todas las politicas de cookies de Iberia', async () => {
  console.log('🍪 Gestionando banner de cookies...');
  await mmbPage.acceptCookiesIfVisible(15000);
  allureReporter.addStep('Aceptación de políticas de cookies procesada de forma exitosa');
});

Then('se muestra el mensaje de disrupcion {string}', async (expectedText: string) => {
  const actualText = await mmbPage.getDisruptionTitleText();
  expect(actualText).toContain(expectedText);
  allureReporter.addStep(`Validación de mensaje de disrupción "${expectedText}" procesada de forma exitosa`);
});

Then('se muestran las opciones de reembolso con el texto {string}', async (expectedOption: string) => {
  const refundText = await mmbPage.getRefundOptionsText();
  expect(refundText).toContain(expectedOption);
  allureReporter.addStep(`Validación de opciones de reembolso "${expectedOption}" procesada de forma exitosa`);
});

When('hace click en aceptar cambios de disrupcion', async () => {
  const acceptBtn = await $(mmbPage.locators.acceptChangesBtn);
  await acceptBtn.waitForClickable({ timeout: 10000 });
  await acceptBtn.click();
  allureReporter.addStep('Click en "Aceptar cambios" procesado de forma exitosa');
});

When('hace click en solicitar reembolso', async () => {
  const refundBtn = await $(mmbPage.locators.requestRefundBtn);
  await refundBtn.waitForClickable({ timeout: 10000 });
  await refundBtn.click();
  allureReporter.addStep('Click en "Solicitar reembolso" procesado de forma exitosa');
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
  await AirlineNavigationFacade.verifyUrlContains(urlFragment);
  allureReporter.addStep(`Validación de fragmento de URL "${urlFragment}" procesada de forma exitosa`);
});
