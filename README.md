# Ozone E2E Test Suite

[![Ozone PRO E2E Tests](https://github.com/ozone-his/ozone-e2e-pro/actions/workflows/pro.yml/badge.svg)](https://github.com/ozone-his/ozone-e2e-pro/actions/workflows/pro.yml)

Welcome to Ozone automated test suite.

- [Setup Steps](#setup-steps)
  * [Step 1. Setup the project](#step-1-setup-the-project)
  * [Step 2. Run Ozone e2e tests](#step-2-run-ozone-e2e-tests)
- [Configurations](#configurations)
- [Project Structure](#project-structure)
- [Guide for writing tests](#guide-for-writing-tests)
- [GitHub Actions integration](#github-actions-integration)

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

Install dependencies
```sh
yarn install
```

### Step 2. Run Ozone e2e tests

```sh
npx playwright test
```
## Configurations

This is underdevelopement/WIP. At the moment, there exists a git-shared
`.env` file used for configuring environment variables.

By default, the test suite will run against Ozone dev server.
You can override it by changing the environment variables beforehand:

```sh
# Ex: Set the server URL here
export E2E_BASE_URL=https://ozone-dev.mekomsolutions.net
```

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

## Guide for writing tests

When writing a new test case, create a new spec in `./e2e/tests`

## GitHub Actions integration
The pro.yml workflow is made up of two jobs of which one is triggered by PRs and another on a push.
The foss.yml workflow is made up of one job that runs tests for Ozone FOSS. Note: You need to pass environment variables for O3, Odoo and SENAITE at runtime.
