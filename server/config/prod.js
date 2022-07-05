const config = {
  app: {
    port: process.env.SERVER_PORT,
  },
  db: {
    host: process.env.MONGODB_HOST,
    port: process.env.MONGODB_PORT,
    name: process.env.MONGODB_NAME,
  },
  mailgun: {
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_API_DOMAIN,
    fromAddress: process.env.MAILGUN_FROM_ADDRESS,
  },
  jwt: {
    secret: process.env.JWT_SECRET_KEY,
  },
};

module.exports = config;
