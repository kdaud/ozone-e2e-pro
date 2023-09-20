import { test, expect } from '@playwright/test';
import { HomePage } from '../utils/functions/testBase';
import { patientName } from '../utils/functions/testBase';

let homePage: HomePage;

test.beforeEach(async ({ page }) =>  {
   const homePage = new HomePage(page);
   await homePage.initiateLogin();

   await expect(page).toHaveURL(/.*home/);
});

test('Creating OpenMRS role syncs the role into Keycloak', async ({ page }) => {
    // setup
    await page.goto(`${process.env.E2E_BASE_URL}/openmrs`);
    await page.getByRole('link', { name: 'Administration' }).click();
    await page.getByRole('link', { name: 'Manage Roles' }).click();
    const homePage = new HomePage(page);
    await homePage.addRole();

    // replay
    await homePage.goToKeycloak();
    await page.getByTestId('realmSelectorToggle').click();
    await page.getByRole('menuitem', { name: 'ozone' }).click();
    await page.getByRole('link', { name: 'Clients' }).click();
    await page.getByRole('link', { name: 'openmrs', exact: true }).click();
    await page.getByTestId('rolesTab').click();

    // verify
    const role = await page.locator("table tbody tr td:nth-child(1) a");
    await expect(role).toHaveText('System Developer');
  });

test.afterEach(async ({ page }) => {
    await page.close();
  });
