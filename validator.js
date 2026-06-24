#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const DEFAULT_TARGET_FILE = 'src/index.js';
const DEFAULT_ERROR_LOG = 'error_log.txt';

function log(message, type = 'info') {
  const prefix = { info: 'ℹ️', success: '✅', error: '❌', scan: '🔍' }[type] || 'ℹ️';
  console.log(`${prefix} ${message}`);
}

function main() {
  const targetFilePath = process.argv[2] || DEFAULT_TARGET_FILE;
  const errorLogPath = process.argv[3] || DEFAULT_ERROR_LOG;

  try {
    const code = fs.readFileSync(targetFilePath, 'utf-8');
    log('Scanning for errors...', 'scan');

    const errors = [];
    try {
      new vm.Script(code);
    } catch (e) {
      errors.push(`SyntaxError: ${e.message}`);
    }

    if (errors.length > 0) {
      fs.writeFileSync(errorLogPath, errors.join('\n'));
      log(`Found ${errors.length} issues. Logged to ${errorLogPath}`, 'error');
      process.exit(1);
    } else {
      fs.writeFileSync(errorLogPath, '');
      log('Code is clean!', 'success');
      process.exit(0);
    }
  } catch (error) {
    log(`Fatal error: ${error.message}`, 'error');
    process.exit(1);
  }
}

main();

