import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createRequire } from 'module';

// get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// create require function
const require = createRequire(import.meta.url);

// generate version info
const generateVersionInfo = () => {
  const packageJson = require('../package.json');
  const buildDate = new Date().toISOString().split('T')[0].replace(/-/g, '.');
  const buildTime = new Date().toISOString().replace('T', ' ').split('.')[0];

  return `
VITE_APP_VERSION=${packageJson.version}
VITE_APP_BUILD_DATE=${buildDate}
VITE_APP_BUILD_TIME=${buildTime}
  `.trim();
};

// update .env file
const updateEnvFile = () => {
  const envPath = path.resolve(__dirname, '../.env');
  const versionInfo = generateVersionInfo();

  fs.writeFileSync(envPath, versionInfo, 'utf8');
  console.log('版本資訊已更新：');
  console.log(versionInfo);
};

try {
  updateEnvFile();
} catch (error) {
  console.error('更新版本資訊時發生錯誤：', error);
  process.exit(1);
}
