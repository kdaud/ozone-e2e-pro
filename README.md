# Ozone Pro E2E Tests

[![Ozone E2E Tests](https://github.com/ozone-his/ozone-e2e-pro/actions/workflows/e2e.yml/badge.svg)](https://github.com/ozone-his/ozone-e2e-pro/actions/workflows/e2e.yml)

Welcome to Ozone FOSS test suite that uses [Playwright](https://playwright.dev)
framework. 

- [Setup Steps](#setup-steps)
  * [Step 1. Setup the project](#step-1-setup-the-project)
  * [Step 2. Run e2e tests](#step-2-run-the-smoke-tests)
- [Configurations](#configurations)
- [Project Structure](#project-structure)
- [Guide for writing the tests](#guide-for-writing-the-tests)
- [Github Action integration](#github-action-integration)

<small><i><a href='http://ecotrust-canada.github.io/markdown-toc/'>(Table of contents generated with markdown-toc)</a></i></small>

## Setup Steps

### Step 1. Setup the project

Clone the project

```sh
git clone https://github.com/ozone-his/ozone-e2e-pro
```
Navigate into the project

```sh
cd ozone-e2e-pro
```
Pull 'master' branch from upstream and checkout it out.

Install dependencies
```sh
yarn install
```

### Step 2. Run e2e tests

```sh
npx playwright test
```
## Configurations

Set the server urls for O3, Odoo and SENAITE within the git-shared
`.env` file used for configuring server attributes.

## Project Structure 

The project uses the Playwright test runner and,
generally, follows a very simple project structure:

```
e2e
|__ tests
|   ^ Contains test cases
|__ utils
|   ^ Contains utilities needed to setup and tear down 
|     tests as well as methods required by the tests to run
```

## Github Action integration
The e2e.yml workflow is made up of one job that is triggered by PRs, and on a push.
