// TypeScript type definitions for custom environment variables

declare namespace NodeJS {
  interface ProcessEnv {
    RESEND_API_KEY: string;
    DATABASE_URL: string;
    RECAPTCHA_SECRET_KEY: string;
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY: string;
    ANALYZE?: string;
    // Add other custom env variables here as needed
  }
}
