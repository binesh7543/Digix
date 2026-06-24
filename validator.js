#!/usr/bin/env node
const fs = require('fs');
const vm = require('vm');

const targetFilePath = 'src/index.js';
const errorLogPath = 'error_log.txt';

try {
  const code = fs.readFileSync(targetFilePath, 'utf-8');
  
  // 1. सिंटैक्स चेक
  new vm.Script(code);
  
  // 2. इंपोर्ट चेक (क्या Hono इम्पोर्ट है?)
  if (!code.includes('import { Hono }')) {
    throw new Error('Cannot find module: Missing Hono import');
  }

  // 3. एक्सपोर्ट चेक
  if (!code.includes('export default app')) {
    throw new Error('No default export: Missing export default app');
  }

  console.log('✅ सब सही है!');
  fs.writeFileSync(errorLogPath, ''); // फाइल खाली कर दो
  process.exit(0);

} catch (e) {
  console.log('❌ एरर मिला: ' + e.message);
  fs.writeFileSync(errorLogPath, e.message); // एरर को फाइल में लिखो
  process.exit(1);
}
