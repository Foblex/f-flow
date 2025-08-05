function getEnvVar(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

export const GITHUB_CLIENT_ID = getEnvVar('GITHUB_CLIENT_ID');
export const GITHUB_CLIENT_SECRET = getEnvVar('GITHUB_CLIENT_SECRET');
export const GITHUB_CALLBACK_URL = getEnvVar('GITHUB_CALLBACK_URL');
export const JWT_SECRET = getEnvVar('JWT_SECRET');
