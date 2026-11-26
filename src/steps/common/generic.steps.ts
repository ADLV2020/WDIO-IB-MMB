import { Given, When, Then } from '@wdio/cucumber-framework';
import { expect } from '@wdio/globals';
import allureReporter from '@wdio/allure-reporter';
import { AirlineNavigationFacade } from '@facade/AirlineNavigationFacade.js';
import { ManageMyBookingPage } from '@page_objects/mmb/ManageMyBookingPage';

const mmbPage = new ManageMyBookingPage();

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
  await browser.pause(25000);
});
When(/^se ingresa el PNR$/, async () => {
  //
  await browser.pause(25000);
});
When(/^se hace click en gestionar$/, async () => {
  //
  await browser.pause(35000);
});

When('acepta todas las politicas de cookies de Iberia', async () => {
  console.log('🍪 Gestionando banner de cookies...');
  await mmbPage.acceptCookiesIfVisible(15000);
  allureReporter.addStep('Aceptación de políticas de cookies procesada de forma exitosa');
});

Then('se muestra el mensaje de disrupcion {string}', async (expectedText: string) => {
  const actualText = await mmbPage.getDisruptionTitleText();
  expect(actualText).toContain(expectedText);
});

Then('se muestran las opciones de reembolso con el texto {string}', async (expectedOption: string) => {
  const refundText = await mmbPage.getRefundOptionsText();
  expect(refundText).toContain(expectedOption);
});

When('hace click en aceptar cambios de disrupcion', async () => {
  const acceptBtn = await $(mmbPage.locators.acceptChangesBtn);
  await acceptBtn.waitForClickable({ timeout: 10000 });
  await acceptBtn.click();
});

When('hace click en solicitar reembolso', async () => {
  const refundBtn = await $(mmbPage.locators.requestRefundBtn);
  await refundBtn.waitForClickable({ timeout: 10000 });
  await refundBtn.click();
});
