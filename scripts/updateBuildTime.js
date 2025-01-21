const fs = require('fs');
const path = require('path');

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
