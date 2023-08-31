import { Page } from 'puppeteer';
import { SELECTORS } from './constants/selectors';
import { CREDENTIALS } from './constants/environments';
import { URLS } from './constants/urls';

export const loginDisneyplus = async (page: Page): Promise<void> => {
  const selector = SELECTORS.disneyplus;
  const credential = CREDENTIALS.disneyplus;
  const url = URLS.disneyplus;

  // 디즈니 플러스 접속
  await page.goto(url.login);

  // 이메일 입력
  await page.waitForSelector(selector.email);
  await page.type(selector.email, credential.email);
  await page.keyboard.press('Enter');

  // 비밀번호 입력
  await page.waitForSelector(selector.password);
  await page.type(selector.password, credential.password);
  await page.keyboard.press('Enter');

  // 프로필 선택
  await page.waitForSelector(selector.profile);
  await page.click(selector.profile);

  // 핀번호 입력
  await page.keyboard.type(credential.pincode);

  // 페이지 로딩 기다리기
  await page.waitForSelector(selector.home);
};

export const moveToContentPage = async (page: Page): Promise<void> => {
  // 테스트 콘텐츠
  page.goto(
    'https://www.disneyplus.com/ko-kr/video/46eba18a-1812-41ed-af0b-9986cd9ccc0b',
  );
};
