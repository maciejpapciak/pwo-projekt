import 'dotenv/config';

const IS_PROD = process.env.NODE_ENV === 'production';
const COOKIE_NAME: string = 'uid';
const FORGET_PASSWORD_PREFIX: string = 'forgetPassword__';
const FORGET_EMAIL_PREFIX: string = 'forgetEmail__';
const CONFIRM_EMAIL_PREFIX: string = 'confirmEmail__';
const CONTAINER_PREFIX: string = 'container-';
// const GITHUB_CALLBACK_URL: string =
//   'https://earnr.rockapi.els/auth/github/callback';
// const GOOGLE_CALLBACK_URL: string =
//   'https://api.elearnr.rocks/auth/google/callback';
const GITHUB_CALLBACK_URL: string =
  'https://localhost:4000/auth/github/callback';
const GOOGLE_CALLBACK_URL: string =
  'https://localhost:4000/auth/google/callback';
const AZURE_BLOB_CDN: string = 'https://elearnr.core.windows.net/';
const PAGE_SIZE: number = 10;

export {
  IS_PROD,
  COOKIE_NAME,
  FORGET_PASSWORD_PREFIX,
  FORGET_EMAIL_PREFIX,
  CONFIRM_EMAIL_PREFIX,
  CONTAINER_PREFIX,
  GITHUB_CALLBACK_URL,
  GOOGLE_CALLBACK_URL,
  AZURE_BLOB_CDN,
  PAGE_SIZE,
};
