module.exports = {
  reactStrictMode: true,
  env: {
    STYTCH_PUBLIC_TOKEN: process.env.STYTCH_PUBLIC_TOKEN,
    IRON_SESSION_PWD: process.env.IRON_SESSION_PWD,
    COOKIE_NAME: process.env.COOKIE_NAME,
    STYTCH_PROJECT_ENV: process.env.STYTCH_PROJECT_ENV,
    STYTCH_SECRET: process.env.STYTCH_SECRET,
    STYTCH_PROJECT_ID: process.env.STYTCH_PROJECT_ID,
    REACT_APP_STYTCH_JS_SDK_URL: process.env.REACT_APP_STYTCH_JS_SDK_URL,
  },
  webpack: (config) => {
    config.experiments = { 
      topLevelAwait: true,
     };
    return config;
  },
};
