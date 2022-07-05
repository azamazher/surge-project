const config = {
  app: {
    port: process.env.SERVER_PORT || 1337,
  },
  db: {
    host: process.env.MONGODB_HOST || "localhost",
    port: process.env.MONGODB_PORT || 27017,
    name: process.env.MONGODB_NAME || "surge-project",
  },
  mailgun: {
    apiKey: process.env.MAILGUN_API_KEY || "<YOUR_MAILGUN_API_KEY_GOES_HERE>",
    domain:
      process.env.MAILGUN_API_DOMAIN || "<YOUR_MAILGUN_API_DOMAIN_GOES_HERE>",
    fromAddress:
      process.env.MAILGUN_FROM_ADDRESS ||
      "<YOUR_MAILGUN_FROM_ADDRESS_GOES_HERE>",
  },
  jwt: {
    secret: process.env.JWT_SECRET_KEY || "<YOUR_JWT_SECRET_KEY_GOES_HERE>",
  },
};

module.exports = config;
