# Surge Server


## Development

```
npm run install
npm run dev (this automatically runs the seed script)
```

If you need to only run the seed script,

```
npm run seed:user
```

Add the following keys to the process environemnt or `server/config/dev.js`,

```sh
MAILGUN_API_KEY
MAILGUN_API_DOMAIN
MAILGUN_FROM_ADDRESS
JWT_SECRET_KEY
```

Seeded admin user credentials,

```sh
    email: "test@surge.com"
    password: "test123"
```