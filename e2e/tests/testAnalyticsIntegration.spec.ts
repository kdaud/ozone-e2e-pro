import { test, expect } from '@playwright/test';
import { HomePage, delay } from '../utils/functions/testBase';
import { patientName } from '../utils/functions/testBase';

let homePage: HomePage;

test.beforeEach(async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.initiateLogin();

  await expect(page).toHaveURL(/.*home/);
});

test('Creating an OpenMRS patient increases patients count in Superset', async ({ page }) => {
  // setup
  const homePage = new HomePage(page);
  await homePage.goToSuperset();
  await expect(page).toHaveURL(/.*superset/);
  await homePage.selectDBSchema();
  await page.getByRole('textbox').first().clear();
  await page.getByRole('textbox').fill('SELECT COUNT (*) FROM patients;');
  await homePage.runSQLQuery();
  const initialNumberOfItems = await page.getByRole('gridcell', { name: ' ' }).nth(0).textContent();
  let initialCount = Number(initialNumberOfItems);

  // replay
  await page.goto(`${process.env.E2E_BASE_URL}/openmrs/spa/home`);
  await homePage.createPatient();

  // verify
  await homePage.goToSuperset();
  await homePage.returnToSQLEditor();
  await page.getByRole('textbox').first().clear();
  await page.getByRole('textbox').fill('SELECT COUNT (*) FROM patients;');
  await homePage.runSQLQuery();
  const updatedNumberOfItems = await page.getByRole('gridcell', { name: ' ' }).nth(0).textContent();
  let updatedCount = Number(updatedNumberOfItems);

  await expect(updatedCount).toBeGreaterThan(initialCount);
});

test('Creating an OpenMRS patient adds patient to the patients table in Superset', async ({ page }) => {
  // setup
  const homePage = new HomePage(page);
  await homePage.createPatient();

  // reply
  await homePage.goToSuperset();
  await expect(page).toHaveURL(/.*superset/);
  await homePage.selectDBSchema();
  await page.getByRole('textbox').first().clear();
  let sqlQuerry = `SELECT * FROM patients WHERE given_name like '${patientName.firstName}' AND family_name like '${patientName.givenName}'`;
  await page.getByRole('textbox').fill(sqlQuerry);

  // verify
  await homePage.runSQLQuery();
  let givenName = await page.getByRole('gridcell', { name: `${patientName.firstName}` });
  let familyName = await page.getByRole('gridcell', { name: `${patientName.givenName}` })

  await expect(givenName).toHaveText(`${patientName.firstName}`);
  await expect(familyName).toHaveText(`${patientName.givenName}`);;
});

test('Starting an OpenMRS visit increases visits count in Superset', async ({ page }) => {
  // setup
  const homePage = new HomePage(page);
  await homePage.createPatient();
  await homePage.goToSuperset();
  await expect(page).toHaveURL(/.*superset/);
  await homePage.selectDBSchema();
  await page.getByRole('textbox').first().clear();
  await page.getByRole('textbox').fill('SELECT COUNT (*) FROM  visits;');
  await homePage.runSQLQuery();
  const initialNumberOfItems = await page.getByRole('gridcell', { name: ' ' }).nth(0).textContent();
  let initialCount = Number(initialNumberOfItems);

  // replay
  await page.goto(`${process.env.E2E_BASE_URL}/openmrs/spa/home`);
  await homePage.startPatientVisit();

  // verify
  await homePage.goToSuperset();
  await homePage.returnToSQLEditor();
  await page.getByRole('textbox').first().clear();
  await page.getByRole('textbox').fill('SELECT COUNT (*) FROM  visits;');
  await homePage.runSQLQuery();
  const updatedNumberOfItems = await page.getByRole('gridcell', { name: ' ' }).nth(0).textContent();
  let updatedCount = Number(updatedNumberOfItems);

  await expect(updatedCount).toBeGreaterThan(initialCount);
});

test('Starting an OpenMRS visit adds visit to the visits table in Superset', async ({ page }) => {
  // setup
  const homePage = new HomePage(page);
  await homePage.createPatient();
  await homePage.startPatientVisit();

  // reply
  await homePage.goToSuperset();
  await expect(page).toHaveURL(/.*superset/);
  await homePage.selectDBSchema();
  let sqlQuery1 = `SELECT patient_id FROM patients WHERE given_name like '${patientName.firstName}' AND family_name like '${patientName.givenName}'`;
  await page.getByRole('textbox').first().clear();
  await page.getByRole('textbox').fill(sqlQuery1);
  await homePage.runSQLQuery();
  let patientIdLocator = await page.getByRole('gridcell', { name: ' ' }).nth(0).textContent();
  const patientId = Number(patientIdLocator);

  // verify
  await page.getByRole('tab', { name: 'Query history' }).click();
  await delay(2000);
  await page.getByRole('textbox').first().clear();
  await delay(2000);
  let sqlQuery2 = `SELECT * FROM visits WHERE patient_id=${patientId}`;
  await page.getByRole('textbox').fill(sqlQuery2);
  await homePage.runSQLQuery();
  let patientVisitType = 'Facility Visit';
  let patientAgeGroupAtVisit = '20 - 24';
  const patientGender = 'M';
  let visitType = await page.getByRole('gridcell', { name: `${patientVisitType}` });
  let ageGroupAtVisit = await page.getByRole('gridcell', { name: `${patientAgeGroupAtVisit}` });
  const gender = await page.getByRole('gridcell', { name: `${patientGender}` });

  await expect(visitType).toHaveText(`${patientVisitType}`);
  await expect(gender).toHaveText(`${patientGender}`);
  await expect(ageGroupAtVisit).toHaveText(`${patientAgeGroupAtVisit}`);
});

test('Creating an OpenMRS order increases orders count in Superset', async ({ page }) => {
  // setup
  const homePage = new HomePage(page);
  await homePage.createPatient();
  await homePage.startPatientVisit();
  await homePage.goToSuperset();
  await expect(page).toHaveURL(/.*superset/);
  await homePage.selectDBSchema();
  await page.getByRole('textbox').first().clear();
  await page.getByRole('textbox').fill('SELECT COUNT(*) FROM _orders;');
  await homePage.runSQLQuery();
  const initialNumberOfItems = await page.getByRole('gridcell', { name: ' ' }).nth(0).textContent();
  let initialCount = Number(initialNumberOfItems);

  // replay
  await page.goto(`${process.env.E2E_BASE_URL}/openmrs/spa/home`);
  await homePage.searchPatient(`${patientName.firstName + ' ' + patientName.givenName}`);
  await homePage.goToLabOrderForm();
  await page.getByRole('button', { name: 'Add', exact: true }).click();
  await page.locator('#tab select').selectOption('857AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
  await homePage.saveLabOrder();

  // verify
  await homePage.goToSuperset();
  await homePage.returnToSQLEditor();
  await page.getByRole('textbox').first().clear();
  await page.getByRole('textbox').fill('SELECT COUNT(*) FROM _orders;');
  await homePage.runSQLQuery();
  const updatedNumberOfItems = await page.getByRole('gridcell', { name: ' ' }).nth(0).textContent();
  let updatedCount = Number(updatedNumberOfItems);

  await expect(updatedCount).toBeGreaterThan(initialCount);
});

test('Creating an OpenMRS order increases encounters count in Superset', async ({ page }) => {
  // setup
  const homePage = new HomePage(page);
  await homePage.createPatient();
  await homePage.startPatientVisit();
  await homePage.goToSuperset();
  await expect(page).toHaveURL(/.*superset/);
  await homePage.selectDBSchema();
  await page.getByRole('textbox').first().clear();
  await page.getByRole('textbox').fill('SELECT COUNT(*) FROM encounters;');
  await homePage.runSQLQuery();
  const initialNumberOfItems = await page.getByRole('gridcell', { name: ' ' }).nth(0).textContent();
  let initialCount = Number(initialNumberOfItems);

  // replay
  await page.goto(`${process.env.E2E_BASE_URL}/openmrs/spa/home`);
  await homePage.searchPatient(`${patientName.firstName + ' ' + patientName.givenName}`);
  await homePage.goToLabOrderForm();
  await page.getByRole('button', { name: 'Add', exact: true }).click();
  await page.locator('#tab select').selectOption('857AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
  await homePage.saveLabOrder();

  // verify
  await homePage.goToSuperset();
  await homePage.returnToSQLEditor();
  await page.getByRole('textbox').first().clear();
  await page.getByRole('textbox').fill('SELECT COUNT(*) FROM encounters;');
  await homePage.runSQLQuery();
  const updatedNumberOfItems = await page.getByRole('gridcell', { name: ' ' }).nth(0).textContent();
  let updatedCount = Number(updatedNumberOfItems);

  await expect(updatedCount).toBeGreaterThan(initialCount);
});

test('Adding an OpenMRS patient condition increases conditions count in Superset', async ({ page }) => {
  // setup
  const homePage = new HomePage(page);
  await homePage.createPatient();
  await homePage.startPatientVisit();
  await homePage.goToSuperset();
  await expect(page).toHaveURL(/.*superset/);
  await homePage.selectDBSchema();
  await page.getByRole('textbox').first().clear();
  await page.getByRole('textbox').fill('SELECT COUNT (*) FROM _conditions;');
  await homePage.runSQLQuery();
  const initialNumberOfItems = await page.getByRole('gridcell', { name: ' ' }).textContent();
  let initialCount = Number(initialNumberOfItems);

  // replay
  await page.goto(`${process.env.E2E_BASE_URL}/openmrs/spa/home`);
  await homePage.searchPatient(`${patientName.firstName + ' ' + patientName.givenName}`);
  await homePage.addPatientCondition();

  // verify
  await homePage.goToSuperset();
  await homePage.returnToSQLEditor();
  await page.getByRole('textbox').first().clear();
  await page.getByRole('textbox').fill('SELECT COUNT (*) FROM _conditions;');
  await homePage.runSQLQuery();
  const updatedNumberOfItems = await page.getByRole('gridcell', { name: ' ' }).textContent();
  let updatedCount = Number(updatedNumberOfItems);

  await expect(updatedCount).toBeGreaterThan(initialCount);
});

test('Adding an OpenMRS patient biometrics increases observations count in Superset', async ({ page }) => {
  // setup
  const homePage = new HomePage(page);
  await homePage.createPatient();
  await homePage.startPatientVisit();
  await homePage.goToSuperset();
  await expect(page).toHaveURL(/.*superset/);
  await homePage.selectDBSchema();
  await page.getByRole('textbox').first().clear();
  await page.getByRole('textbox').fill('SELECT COUNT (*) FROM observations;');
  await homePage.runSQLQuery();
  const initialNumberOfItems = await page.getByRole('gridcell', { name: ' ' }).nth(0).textContent();
  let initialCount = Number(initialNumberOfItems);

  // replay
  await page.goto(`${process.env.E2E_BASE_URL}/openmrs/spa/home`);
  await homePage.searchPatient(`${patientName.firstName + ' ' + patientName.givenName}`);
  await homePage.addPatientBiometrics();

  // verify
  await homePage.goToSuperset();
  await homePage.returnToSQLEditor();
  await page.getByRole('textbox').first().clear();
  await page.getByRole('textbox').fill('SELECT COUNT (*) FROM observations;');
  await homePage.runSQLQuery();
  const updatedNumberOfItems = await page.getByRole('gridcell', { name: ' ' }).nth(0).textContent();
  let updatedCount = Number(updatedNumberOfItems);

  await expect(updatedCount).toBeGreaterThan(initialCount);
});

test('Adding an OpenMRS patient appointment increases appointments count in Superset', async ({ page }) => {
  // setup
  const homePage = new HomePage(page);
  await homePage.createPatient();
  await homePage.startPatientVisit();
  await homePage.goToSuperset();
  await expect(page).toHaveURL(/.*superset/);
  await homePage.selectDBSchema();
  await page.getByRole('textbox').first().clear();
  await page.getByRole('textbox').fill('SELECT COUNT(*) FROM appointments;');
  await homePage.runSQLQuery();

  const initialNumberOfItems = await page.getByRole('gridcell', { name: ' ' }).nth(0).textContent();
  let initialCount = Number(initialNumberOfItems);

  // replay
  await page.goto(`${process.env.E2E_BASE_URL}/openmrs/spa/home`);
  await homePage.searchPatient(`${patientName.firstName + ' ' + patientName.givenName}`);
  await homePage.addPatientAppointment();

  // verify
  await homePage.goToSuperset()
  await homePage.returnToSQLEditor();
  await page.getByRole('textbox').first().clear();
  await page.getByRole('textbox').fill('SELECT COUNT(*) FROM appointments;');
  await homePage.runSQLQuery();

  const updatedNumberOfItems = await page.getByRole('gridcell', { name: ' ' }).nth(0).textContent();
  let updatedCount = Number(updatedNumberOfItems);

  await expect(updatedCount).toBeGreaterThan(initialCount);
});

test.afterEach(async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.deletePatient();
  await page.close();
});
