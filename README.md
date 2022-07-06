# Surge Internship Project

A sample development project for Surge.

## Getting Started

> Before getting stated, you might need npm `v16.13.1`. 

### Server

```
npm run install
npm run dev
```

Add the following keys to the process environemnt or `server/config/dev.js`,

```sh
MAILGUN_API_KEY
MAILGUN_API_DOMAIN
MAILGUN_FROM_ADDRESS
JWT_SECRET_KEY
```

### Client

```
npm run install
npm run start
```

## TODO

- [ ] Analyze below diagram and Create the frontend and backend application.
- [ ] Explain the application briefly in the readme file.
- [ ] Proper error handling should be implemented.
- [ ] Add loading indicators to necessary places.
- [ ] Implement backend pagination for list.
- [ ] Search user by name, email or id.
- [ ] Routes should be protected for user types.
- [x] Implement token based authentication.
- [ ] Write a seed file to add admin to the database directly.
- [ ] Write Unit testing. (Bonus Steps) - mocha, sinonjs.
- [ ] Host backend, frontend and DB in separate docker containers and should be able to up all using docker-compose. (Bonus Steps)
- [ ] Add typescript support for server and react
- [ ] Add eslint support for linting

## License

Azam Azher © 2022.