# Surge Internship Project

A sample development project for Surge.

## Getting Started

> Before getting stated, you might need npm `v16.13.1`. 

### Server

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

### Client

```
npm run install
npm run start
```

## TODO

- [x] Analyze below diagram and Create the frontend and backend application.
- [x] Explain the application briefly in the readme file.
- [x] Proper error handling should be implemented.
- [x] Add loading indicators to necessary places.
- [x] Implement backend pagination for list.
- [ ] Search user by name, email or id.
- [x] Routes should be protected for user types.
- [x] Implement token based authentication.
- [x] Write a seed file to add admin to the database directly.
- [ ] Write Unit testing. (Bonus Steps) - mocha, sinonjs.
- [ ] Host backend, frontend and DB in separate docker containers and should be able to up all using docker-compose. (Bonus Steps)
- [ ] Add typescript support for server and react
- [ ] Add eslint support for linting

## ERROR TO NOTE

Here there is a error while we create a new user the temporary password is only will be send to a specific party who is azam.techofficial@gmail.com. To make it work we need to give the new profile status true in MongoDB and we need to the password of the following logged admin Adrew.


## USER CREATE

when you create a user you might be need to use a free or paid email sender website here I've used the follwoing mailgun. but this following mailgun will send mail only to a single user. So when you create a new user you need to paste the admin password which is andrew's password and you need to put status as true in MongoDB or you can directly use your own mail sender system to view. here to login you dont need a admin i've already crated a test user it will be auto run when you run dev the server. the following email and password can be seen the server runtime  

## SEED USER 
email: 'test@surge.com', password: 'test123'. 


## License

Azam Azher ?? 2022.