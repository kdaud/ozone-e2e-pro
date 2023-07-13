import { test, expect } from '@playwright/test';
import { HomePage } from '../utils/functions/testBase';
import { patientName } from '../utils/functions/testBase';

let homePage: HomePage;

test.beforeEach(async ({ page }) =>  {
    const homePage = new HomePage(page);
    await homePage.initiateLogin();

    await expect(page).toHaveURL(/.*home/);

    await homePage.createPatient();
});

test(' Patient with lab order becomes client with analysis request in SENAITE', async ({ page }) => {
  // setup
  const homePage = new HomePage(page);
  await homePage.createLabOrder();
  await homePage.goToSENAITE();
  await expect(page).toHaveURL(/.*senaite/);

  // replay
  await homePage.searchClientInSENAITE();

  // verify
  const client = await page.locator('table tbody tr:nth-child(1) td.contentcell.title div span a');
  await expect(client).toContainText(`${patientName.firstName + ' ' + patientName.givenName}`);
});

test('Editing patient details with a synced lab test order edits client details in SENAITE', async ({ page }) => {
  // setup
  const homePage = new HomePage(page);
  await homePage.createLabOrder();
  await homePage.goToSENAITE();
  await homePage.searchClientInSENAITE();
  const client = await page.locator('table tbody tr:nth-child(1) td.contentcell.title div span a');
  await expect(client).toContainText(`${patientName.firstName + ' ' + patientName.givenName}`);

  // replay
  await page.goto(`${process.env.E2E_BASE_URL}/openmrs/spa/home`);
  await homePage.searchPatient(`${patientName.firstName + ' ' + patientName.givenName}`);
  await homePage.updatePatientDetails();

  // verify
  await homePage.goToSENAITE();
  await homePage.searchUpdatedClientInSENAITE();

  await expect(client).toContainText('Winniefred' + ' ' + `${patientName.givenName }`);
  patientName.firstName = 'Winniefred';
});

test.afterEach(async ( {page}) =>  {
  const homePage = new HomePage(page);
  await homePage.deletePatient();
  await page.close();
});
