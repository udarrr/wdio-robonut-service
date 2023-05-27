import RobotService from './index';
import { Options } from '@wdio/types';

export const config: Options.Testrunner = {
  runner: 'local',
  autoCompileOpts: {
    autoCompile: true,
    tsNodeOpts: {
      project: './tsconfig.json',
      transpileOnly: true,
    },
  },
  specs: ['./test/specs/**/*.ts'],
  exclude: [],
  maxInstances: 1,
  capabilities: [
    {
      browserName: 'chrome',
    },
  ],
  logLevel: 'info',
  bail: 0,
  baseUrl: 'http://localhost',
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
  services: [[RobotService, {}]],
  reporters: ['spec'],
  framework: 'mocha',
  mochaOpts: {
    ui: 'bdd',
    timeout: 12000000,
  },
  // onWorkerStart: function (cid, caps, specs, args, execArgv) {
  // },
  // beforeSession: function (config, capabilities, specs) {
  // },
  // before: function (capabilities, specs) {
  // },
  // beforeCommand: function (commandName, args) {
  // },
  // beforeSuite: function (suite) {
  // },
  // beforeTest: function (test, context) {
  // },
  // beforeHook: function (test, context) {
  // },
  // afterHook: function (test, context, { error, result, duration, passed, retries }) {
  // },
  // afterTest: function(test, context, { error, result, duration, passed, retries }) {
  // },
  // afterSuite: function (suite) {
  // },
  // afterCommand: function (commandName, args, result, error) {
  // },
  // after: function (result, capabilities, specs) {
  // },
  // afterSession: function (config, capabilities, specs) {
  // },
  // onComplete: function(exitCode, config, capabilities, results) {
  // },
  //onReload: function(oldSessionId, newSessionId) {
  //}
};
