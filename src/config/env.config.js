import dotenv from 'dotenv';
import { cleanEnv, str } from 'envalid';

// Ensure the environment file loads correctly
dotenv.config({ 
  path: `.env.${process.env.NODE_ENV || 'development'}`
});
// Validate and export environment variables
const env = cleanEnv(process.env, {
  MONGO_URI: str(),
  PORT: str(),
  JWT_SECRET: str(),
  JWT_REFRESH_SECRET: str(),
  ARCJET_KEY: str({ default: "" }),
  ARCJET_ENV: str({ default: "development" }),
  NODE_ENV: str({ default: "development" }),
  CORS_ORIGIN: str({ default: "*" }),
  EMAIL_USER:str(),
  EMAIL_PASSWORD: str(),
  QSTASH_CURRENT_SIGNING_KEY: str(),
  QSTASH_NEXT_SIGNING_KEY: str(),
  QSTASH_URL: str(),
  QSTASH_TOKEN: str(),
 
});

// Export individual variables
export const MONGO_URI = env.MONGO_URI;
export const PORT = env.PORT;
export const JWT_SECRET = env.JWT_SECRET;
export const JWT_REFRESH_SECRET = env.JWT_REFRESH_SECRET;
export const ARCJET_KEY = env.ARCJET_KEY;
export const ARCJET_ENV = env.ARCJET_ENV;
export const NODE_ENV = env.NODE_ENV;
export const CORS_ORIGIN = env.CORS_ORIGIN;
export const EMAIL_PASSWORD = env.EMAIL_PASSWORD;

export default env;
