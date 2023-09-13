import { test, expect } from '@playwright/test';
import { HomePage } from '../utils/functions/testBase';
import { patientName } from '../utils/functions/testBase';
import { delay } from '../utils/functions/testBase';

let homePage: HomePage;

test.beforeEach(async ({ page }) =>  {
    const homePage = new HomePage(page);
    await homePage.initiateLogin();

    await expect(page).toHaveURL(/.*home/);

    await homePage.createPatient();
    await homePage.startPatientVisit();
});
/*
test('NCD Consultation form should load all the form sections', async ({ page }) => {
  // setup
  const homePage = new HomePage(page);
  homePage.searchPatient(`${patientName.firstName + ' ' + patientName.givenName}`)

  // replay
  await page.locator('div').filter({ hasText: /^ទម្រង់$/ }).getByRole('button').click();
  await delay(4000);
  const consultationForm = await page.locator('table tbody tr:nth-child(3) td:nth-child(1) a').textContent();
  await expect(consultationForm?.includes('ការពិគ្រោះយោបល់ជំងឺមិនឆ្លង')).toBeTruthy();
  await expect(page.getByText('ការពិគ្រោះយោបល់ជំងឺមិនឆ្លង')).toBeVisible();

  // verify
  await page.getByText('ការពិគ្រោះយោបល់ជំងឺមិនឆ្លង').click();
  await delay(3000);
  const medicalAssessmentSection = await page.locator('div.tab button:nth-child(1) span').textContent();
  await expect(medicalAssessmentSection?.includes('ការវាយតម្លៃវេជ្ជសាស្រ្ត')).toBeTruthy();

  const lifeStyleSection = await page.locator('div.tab button:nth-child(2) span').textContent();
  await expect(lifeStyleSection?.includes('របៀបរស់នៅ')).toBeTruthy();

  const physicalExaminationSection = await page.locator('div.tab button:nth-child(3) span').textContent();
  await expect(physicalExaminationSection?.includes('ការ​ពិនិត្យ​រាងកាយ')).toBeTruthy();

  const diagnosisSection = await page.locator('div.tab button:nth-child(4) span').textContent();
  await expect(diagnosisSection?.includes('រោគវិនិច្ឆ័យ')).toBeTruthy();

  const treatmentPlanSection = await page.locator('div.tab button:nth-child(5) span').textContent();
  await expect(treatmentPlanSection?.includes('ផែនការព្យាបាល')).toBeTruthy();

  const referralSection = await page.locator('div.tab button:nth-child(6) span').textContent();
  await expect(referralSection?.includes('បញ្ជូន')).toBeTruthy();
  await page.getByRole('button', { name: 'បិទ' }).click();
});

test('NCD Consultation form should submit user input successfully', async ({ page }) => {
  // setup
  const homePage = new HomePage(page);
  homePage.searchPatient(`${patientName.firstName + ' ' + patientName.givenName}`)

  // replay
  await page.locator('div').filter({ hasText: /^ទម្រង់$/ }).getByRole('button').click();
  await delay(4000);
  const consultationForm = await page.locator('table tbody tr:nth-child(3) td:nth-child(1) a').textContent();
  await expect(consultationForm?.includes('ការពិគ្រោះយោបល់ជំងឺមិនឆ្លង')).toBeTruthy();
  await expect(page.getByText('ការពិគ្រោះយោបល់ជំងឺមិនឆ្លង')).toBeVisible();

  // verify
  await page.getByText('ការពិគ្រោះយោបល់ជំងឺមិនឆ្លង').click();
  await delay(3000);
  await page.getByRole('button', { name: 'របៀបរស់នៅ' }).click();
  await page.getByLabel('មិនដែលជក់បារីទេ').check();
  await page.locator('#exerciseid_1').check();
  await page.locator('#drinkAlcoholid_1').check();
  await page.getByRole('button', { name: 'Save and close' }).click();
  await expect(page.getByText('The form has been submitted successfully.')).toBeVisible();
  await page.getByRole('button', { name: 'បិទ' }).click();
});
*/
test.afterEach(async ( {page}) =>  {
  const homePage = new HomePage(page);
  await homePage.deletePatient();
  await page.close();
});
