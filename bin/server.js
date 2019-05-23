#!/usr/bin/env node

const chalk = require('chalk');
const spawn = require('cross-spawn');

const script = process.argv[2];
const args = process.argv.slice(3);

var result;

switch (script) {
  case '-v':
  case '--version':
    console.log(require('../package.json').version);
    break;
  case 'start':
  case 'serve':
    result = spawn.sync('node', [require.resolve('../lib/serve')].concat(args), {
      stdio: 'inherit'
    });
    process.exit(result.status);
    break;
  default:
    console.log(`Unknown script ${chalk.cyan(script)}.`);
    break;
}
