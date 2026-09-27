import type { Options } from '@wdio/types';
import path from 'path';

export const config: Options.Testrunner = {
  // ====================
  // Configuración Runner
  // ====================
  runner: 'local',
  autoCompileOpts: {
    autoCompile: true,
    tsNodeOpts: {
      transpileOnly: true,
      project: './tsconfig.json'
    }
  },

  // ==================
  // Ubicación de Specs
  // ==================
  specs: [
    '../src/features/**/*.feature'
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
        '--disable-gpu',
        '--window-size=1920,1080',
        '--no-sandbox',
        '--disable-dev-shm-usage',
        '--ignore-certificate-errors'
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
  services: ['chromedriver'],
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
    requireModule: [],
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
  /**
   * Captura automática de pantalla en caso de fallo en un paso de Cucumber
   */
  afterStep: async function (step, scenario, result) {
    if (!result.passed) {
      await browser.takeScreenshot();
    }
  }
};
