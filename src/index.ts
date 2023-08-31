import puppeteer from 'puppeteer';
import { loginDisneyplus, moveToContentPage } from './disney-plus';
import { PATHS } from './constants/environments';

async function disneyplus() {
  const browser = await puppeteer.launch({
    headless: false,
    ignoreHTTPSErrors: true,
    slowMo: 100,
    executablePath: PATHS.chromeExecutablePath,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
    ],
  });
  const page = await browser.newPage();

  await loginDisneyplus(page);
  await moveToContentPage(page);
}

disneyplus();
