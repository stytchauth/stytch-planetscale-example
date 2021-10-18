module.exports = {
  reactStrictMode: true,
  webpack: (config) => {
    config.experiments = { 
      topLevelAwait: true,
     };
    return config;
  },
};
