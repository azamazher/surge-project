// index.js
const env = process.env.NODE_ENV || "dev";

const getConfig = (env) => {
  const envConfig = require(`./${env}`);

  let localConfig;
  try {
    localConfig = require(`./${env}.local`);
  } catch (error) {
    localConfig = {};
  }

  return { env, ...envConfig, ...localConfig };
};

module.exports = getConfig(env === "development" ? "dev" : env);
