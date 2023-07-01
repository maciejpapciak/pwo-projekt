declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    DATABASE_URL: string;
    DATABASE_HOST: string;
    DATABASE_PORT: string;
    DATABASE_USER: string;
    DATABASE_PASSWORD: string;
    DATABASE_PORT: string;
    PORT: string;
    CORS_ORIGIN: string;
    SESSION_SECRET: string;
    REDIS_HOST: string;
    REDIS_PORT: string;
    REDIS_PASSWORD: string;
    SENDINBLUE_USER: string;
    SENDINBLUE_PASS: string;
    GITHUB_CLIENT_ID: string;
    GITHUB_CLIENT_SECRET: string;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    AZURE_STORAGE_CONNSTRING: string;
    AZURE_BLOB_CDN: string;
    STRIPE_SECRETKEY: string;
    STRIPE_WEBHOOK_SECRET: string;
  }
}
