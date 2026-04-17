// Environment configuration

export const getEnv = () => ({
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(process.env.PORT || "3000"),
  HOST: process.env.HOST || "0.0.0.0",
  CACHE_TTL: parseInt(process.env.CACHE_TTL || "3600000"),
  RATE_LIMIT_WINDOW: parseInt(process.env.RATE_LIMIT_WINDOW || "900000"),
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX || "100"),
  LOG_LEVEL: process.env.LOG_LEVEL || "info"
});

export const isDevelopment = () => process.env.NODE_ENV !== "production";
export const isProduction = () => process.env.NODE_ENV === "production";
