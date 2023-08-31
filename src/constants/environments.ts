import * as dotenv from 'dotenv';
dotenv.config();

export const CREDENTIALS = {
  disneyplus: {
    email: process.env.DISNEYPLUS_EMAIL || '',
    password: process.env.DISNEYPLUS_PASSWORD || '',
    pincode: process.env.DISNEYPLUS_PINCODE || '',
  },
};

export const PATHS = {
  chromeExecutablePath: process.env.CHROME_EXECUTABLE_PATH || '',
};
