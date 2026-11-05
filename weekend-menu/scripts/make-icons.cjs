// Renders public/icon.svg to the PNG sizes the PWA manifest needs (uses the preinstalled Playwright).
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const svg = fs.readFileSync(path.join(__dirname, '../public/icon.svg'), 'utf8');
  const browser = await chromium.launch();
  for (const [file, size] of [['pwa-192.png', 192], ['pwa-512.png', 512], ['apple-touch-icon.png', 180]]) {
    const page = await browser.newPage({ viewport: { width: size, height: size } });
    await page.setContent(`<style>*{margin:0}svg{width:${size}px;height:${size}px;display:block}</style>${svg.replace('rx="112"', 'rx="0"')}`);
    await page.screenshot({ path: path.join(__dirname, '../public', file) });
    await page.close();
  }
  await browser.close();
})();
