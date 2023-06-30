import { Page, expect } from '@playwright/test';

export var patientName = {
  firstName : '',
  givenName : ''
}

var patientFullName = '';

const delay = (mills) => {
  let datetime1 = new Date().getTime();
  let datetime2 = datetime1 + mills;
  while(datetime1 < datetime2) {
     datetime1 = new Date().getTime();
    }
}

export class HomePage {
  constructor(readonly page: Page) {}

  readonly patientSearchIcon = () => this.page.locator('[data-testid="searchPatientIcon"]');
  readonly patientSearchBar = () => this.page.locator('[data-testid="patientSearchBar"]');
  readonly floatingSearchResultsContainer = () => this.page.locator('[data-testid="floatingSearchResultsContainer"]');

  async initiateLogin() {
    await this.page.goto(`${process.env.E2E_BASE_URL}`);
    await this.page.getByLabel('Username').fill(`${process.env.E2E_USER_ADMIN_USERNAME}`);
    await this.page.getByRole('button', { name: 'Continue' }).click();
    await this.page.getByLabel('Password').fill(`${process.env.E2E_USER_ADMIN_PASSWORD}`);
    await this.page.getByRole('button', { name: 'Log in' }).click();
    await this.page.locator('label').filter({ hasText: '100102. ចំបក់_HC' }).locator('span').first().click();
    await this.page.getByRole('button', { name: 'Confirm' }).click();
    await this.page.getByRole('button', { name: 'Users' }).click();
    await this.page.getByRole('combobox', { name: 'Select locale' }).selectOption('km');
  }

  async createPatient() {
    patientName = {
      firstName : `e2eTest${Math.floor(Math.random() * 1000)}`,
      givenName : `${(Math.random() + 1).toString(36).substring(2)}`
    }

    patientFullName = patientName.firstName + ' ' + patientName.givenName;

    await this.page.getByRole('button', { name: 'Add Patient' }).click();
    if (await this.page.getByTitle('close notification').isVisible()) {
      await this.page.getByTitle('close notification').first().click();
    }
    await this.page.getByLabel('នាមខ្លួន').clear();
    await this.page.getByLabel('នាមខ្លួន').fill(`${patientName.firstName}`);
    await this.page.getByLabel('នាមត្រកូល').clear();
    await this.page.getByLabel('នាមត្រកូល').fill(`${patientName.givenName}`);
    await this.page.locator('label').filter({ hasText: 'ប្រុស' }).locator('span').first().click();
    await this.page.getByPlaceholder('dd/mm/YYYY').fill('17/08/2001');
    if (await this.page.getByTitle('close notification').isVisible()) {
      await this.page.getByTitle('close notification').first().click();
    }
    await this.page.getByRole('button', { name: 'ចុះឈ្មោះអ្នកជំងឺ' }).click();
    await expect(this.page.getByText('បង្កើតការចុះឈ្មោះអ្នកជំងឺថ្មី')).toBeVisible();
    await this.page.getByRole('button', { name: 'បិទ' }).click();
  }

  async searchPatient(searchText: string) {
    await this.page.getByTestId('searchPatientIcon').click();
    await this.page.getByTestId('patientSearchBar').type(`${patientName.firstName + ' ' + patientName.givenName}`);
    await this.page.getByRole('link', { name: `${patientFullName}`}).click();
  }

  async startPatientVisit() {
    await this.page.getByTestId('searchPatientIcon').click();
    await this.page.getByTestId('patientSearchBar').fill(`${patientName.firstName + ' ' + patientName.givenName}`);
    await this.page.getByRole('link', { name: `${patientName.firstName + ' ' + patientName.givenName}` }).click();
    await this.page.getByRole('button', { name: 'Start a visit' }).click();
    await this.page.locator('label').filter({ hasText: 'មកពិនិត្យជំងឺមិនឆ្លង' }).locator('span').first().click();
    await this.page.locator('[id="single-spa-application\\:\\@openmrs\\/esm-patient-chart-app-page-0"]').getByRole('combobox').nth(3).selectOption('7c950460-1a59-47e5-a5ac-a82f3932e962');
    await this.page.locator('[id="single-spa-application\\:\\@openmrs\\/esm-patient-chart-app-page-0"]').getByRole('combobox').nth(4).selectOption('5c3ce9c9-75bd-4730-8878-08c03ec02e9d');
    await this.page.getByRole('button', { name: 'ចាប់ផ្តើមការមកពិនិត្យជំងឺ' }).click();
    await this.page.getByRole('button', { name: 'បិទ' }).click();
  }

  async endPatientVisit() {
    await this.searchPatient(`${patientFullName}`)
    await this.page.getByRole('button', { name: 'Actions', exact: true }).click();
    await this.page.getByRole('menuitem', { name: 'End visit' }).click();
    await this.page.getByRole('button', { name: 'danger End Visit' }).click();

    await expect(this.page.getByText('Visit ended')).toBeVisible();

    await this.page.getByRole('button', { name: 'Close' }).click();
  }

  async deletePatient(){
    await this.page.goto(`${process.env.E2E_BASE_URL}/openmrs/admin/patients/index.htm`);
    await this.page.getByPlaceholder(' ').type(`${patientFullName}`);
    await this.page.locator('#openmrsSearchTable tbody tr.odd td:nth-child(1)').click();
    await this.page.locator('input[name="voidReason"]').fill('Delete patient created by smoke tests');
    await this.page.getByRole('button', { name: 'Delete Patient', exact: true }).click();

    const message = await this.page.locator('//*[@id="patientFormVoided"]').textContent();
    expect(message?.includes('This patient has been deleted')).toBeTruthy();

    await this.page.getByRole('link', { name: 'Log out' }).click();
  }

}
