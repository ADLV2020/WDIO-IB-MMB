import type { Options } from '@wdio/types';
import { browser } from '@wdio/globals';
import { HeaderManager } from './src/core/http/HeaderManager.js';

export const config: Options.Testrunner = {
  // ====================
  // Configuración Runner
  // ====================
  runner: 'local',
  autoCompileOpts: {
    autoCompile: true,
    tsNodeOpts: {
      transpileOnly: true,
      project: './tsconfig.json',
    },
  },

  // ==================
  // Ubicación de Specs
  // ==================
  specs: [
    './src/features/*.feature',
    './src/features/**/*.feature'
  ],
  exclude: [],

  // ===================
  // Capacidades Browser
  // ===================
  maxInstances: 1,
  capabilities: [{
    maxInstances: 1,
    browserName: 'chrome',
    'goog:chromeOptions': {
      args: [
        '--start-maximized',
        '--disable-blink-features=AutomationControlled',
        '--disable-popup-blocking',
        '--disable-gpu',
        '--no-sandbox',
        '--disable-dev-shm-usage',
        '--ignore-certificate-errors',
        '--log-level=3',
        '--silent'
        // '--window-size=1920,1080'
      ]
    }
  }],

  // ===================
  // Config Nivel de Log
  // ===================
  logLevel: 'error',
  bail: 0,
  baseUrl: 'https://int.iberia.com',
  waitforTimeout: 15000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,

  // =====================
  // Servicios y Reportes
  // =====================
  services: [],
  framework: 'cucumber',
  reporters: [
    'spec',
    ['allure', {
      outputDir: 'allure-results',
      disableWebdriverStepsReporting: true,
      disableWebdriverScreenshotsReporting: false,
      useCucumberStepReporter: true
    }]
  ],

  // ======================================
  // Opciones de Framework (Cucumber)
  // ======================================
  cucumberOpts: {
    require: ['./src/steps/**/*.ts'],
    backtrace: false,
    dryRun: false,
    failFast: false,
    snippets: true,
    source: true,
    strict: false,
    tagExpression: '',
    timeout: 60000,
    ignoreUndefinedDefinitions: false
  },

  // ======================================
  // Hooks
  // ======================================
  beforeScenario: async function () {
    await HeaderManager.injectAuthHeaderIfNeeded();
  },

  beforeStep: async function () {
    await HeaderManager.injectAuthHeaderIfNeeded();
  },

  afterStep: async function (_step: unknown, _scenario: unknown, result: { passed: boolean; error?: unknown }) {
    if (!result.passed) {
      await browser.takeScreenshot();
    }
  }

};
