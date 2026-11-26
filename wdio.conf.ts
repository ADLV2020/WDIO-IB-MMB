// wdio.conf.ts

import fs from 'node:fs';
import path from 'node:path';
import type { Options } from '@wdio/types';
import { browser } from '@wdio/globals';
import allureReporterModule from '@wdio/allure-reporter';
import { HeaderManager } from './src/core/http/HeaderManager.js';

// Compatibilidad segura ESM / CommonJS para @wdio/allure-reporter
const allureReporter = (allureReporterModule as any).default ?? allureReporterModule;
const targetEnv = (process.env.ENV || 'INT').toUpperCase();

export const config: Options.Testrunner = {
  runner: 'local',
  autoCompileOpts: {
    autoCompile: true,
    tsNodeOpts: {
      transpileOnly: true,
      project: './tsconfig.json',
    },
  },

  specs: process.env.SPEC
    ? [process.env.SPEC]
    : ['./src/features/*.feature', './src/features/**/*.feature'],
  exclude: [],

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
      ]
    }
  }],

  logLevel: 'error',
  bail: 0,
  baseUrl: 'https://int.iberia.com',
  waitforTimeout: 15000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,

  services: [],
  framework: 'cucumber',
  reporters: [
    'spec',
    ['allure', {
      outputDir: 'allure-results',
      disableWebdriverStepsReporting: true,
      disableWebdriverScreenshotsReporting: false,
      useCucumberStepReporter: true,
      reportedEnvironmentVars: {
        Entorno: targetEnv,
        Navegador: 'Chrome',
        Framework: 'WebdriverIO + Cucumber + TS'
      }
    }]
  ],

  cucumberOpts: {
    require: ['./src/steps/**/*.ts'],
    backtrace: false,
    dryRun: false,
    failFast: false,
    snippets: true,
    source: true,
    strict: false,
    tagExpression: process.env.TAGS || '',
    name: process.env.SCENARIO ? [process.env.SCENARIO] : [],
    timeout: process.env.VSCODE_INSPECTOR_OPTIONS ? 600000 : 60000,
    ignoreUndefinedDefinitions: false
  },

  // ======================================
  // Hooks de Ejecución y Evidencia Allure
  // ======================================
  beforeScenario: async function () {
    await HeaderManager.injectAuthHeaderIfNeeded();
  },

  afterStep: async function (step, _scenario, result) {
    if (!result.passed) {
      try {
        const screenshot = await browser.takeScreenshot();
        const currentUrl = await browser.getUrl();
        if (typeof allureReporter.addAttachment === 'function') {
          allureReporter.addAttachment(
            `❌ Error en paso: ${step.text}`,
            Buffer.from(screenshot, 'base64'),
            'image/png'
          );
          allureReporter.addAttachment('URL del fallo', currentUrl, 'text/plain');
        }
      } catch (err) {
        console.error('No se pudo capturar evidencia tras el fallo del paso:', err);
      }
    }
  },

  afterScenario: async function (world, result) {
    try {
      const statusLabel = result.passed ? '✅ Evidencia Final (PASSED)' : '⚠️ Estado Final (FAILED)';
      const screenshot = await browser.takeScreenshot();
      const currentUrl = await browser.getUrl();

      if (typeof allureReporter.addAttachment === 'function') {
        allureReporter.addAttachment(
          `${statusLabel} - ${world.pickle.name}`,
          Buffer.from(screenshot, 'base64'),
          'image/png'
        );
        allureReporter.addAttachment('URL Final del Escenario', currentUrl, 'text/plain');
      }
    } catch (err) {
      console.error('No se pudo capturar evidencia final del escenario:', err);
    }
  },

  onComplete: function () {
    const resultsDir = path.resolve(process.cwd(), 'allure-results');
    if (fs.existsSync(resultsDir)) {
      const categories = [
        {
          name: 'Localización de Elementos / DOM',
          matchedStatuses: ['broken', 'failed'],
          messageRegex: '.*(ChainError|PageError|element.*not.*displayed|not clickable).*'
        },
        {
          name: 'Error de Autenticación / Red Akamai',
          matchedStatuses: ['broken', 'failed'],
          messageRegex: '.*(401|403|ERR_FAILED|Access Denied).*'
        },
        {
          name: 'Fallo de Validación Funcional (Aserción)',
          matchedStatuses: ['failed'],
          messageRegex: '.*(AssertionError|expect\\(.*\\)\\.to).*'
        }
      ];
      fs.writeFileSync(
        path.join(resultsDir, 'categories.json'),
        JSON.stringify(categories, null, 2)
      );
    }
  }
};
