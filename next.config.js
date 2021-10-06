module.exports = {
  reactStrictMode: true,
  env: {
    STYTCH_PUBLIC_TOKEN: process.env.STYTCH_PUBLIC_TOKEN,
    COOKIE_NAME: process.env.COOKIE_NAME,
    STYTCH_PROJECT_ENV: process.env.STYTCH_PROJECT_ENV,
  },
  webpack: (config) => {
    config.experiments = { 
      topLevelAwait: true,
     };
    return config;
  },
};
