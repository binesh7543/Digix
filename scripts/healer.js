#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const PATTERNS_FILE = 'patterns.json';
const DEFAULT_ERROR_LOG = 'error_log.txt';
const DEFAULT_TARGET_FILE = 'src/index.js';

function log(message, type = 'info') {
  const icons = { info: 'ℹ️', success: '✅', error: '❌', healing: '🔧' };
  console.log(`${icons[type] || 'ℹ️'} ${message}`);
}

function main() {
  const errorLogPath = process.argv[2] || DEFAULT_ERROR_LOG;
  const targetFilePath = process.argv[3] || DEFAULT_TARGET_FILE;

  try {
    const patternsData = JSON.parse(fs.readFileSync(PATTERNS_FILE, 'utf-8'));
    const errorLogContent = fs.readFileSync(errorLogPath, 'utf-8');
    let targetContent = fs.readFileSync(targetFilePath, 'utf-8');

    log('Analyzing errors...', 'info');

    patternsData.patterns.forEach(p => {
      const regex = new RegExp(p.error_pattern, 'i');
      if (regex.test(errorLogContent)) {
        log(`Fixing: ${p.name}`, 'healing');
        
        if (p.fix_action.type === 'prepend') {
          targetContent = p.fix_action.code + targetContent;
        } else if (p.fix_action.type === 'regex_replace') {
          targetContent = targetContent.replace(new RegExp(p.fix_action.search, 'gm'), p.fix_action.replace);
        } else if (p.fix_action.type === 'append') {
          targetContent = targetContent + p.fix_action.code;
        }
      }
    });

    fs.writeFileSync(targetFilePath, targetContent);
    log('Healing complete!', 'success');
  } catch (error) {
    log(`Healing failed: ${error.message}`, 'error');
    process.exit(1);
  }
}

main();

