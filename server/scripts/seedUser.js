const { exists } = require("../models/user.model");

const seedAdmin = async (input) => {
    const mongoose = require("mongoose");
    const User = require("../models/user.model");
    const bcrypt = require("bcryptjs");
    const config = require("../config");

    const dbUrl = `mongodb://${config.db.host}:${config.db.port}/${config.db.name}`;

    mongoose.connect(dbUrl, { useUnifiedTopology: true }, (err) => {
        if (err) throw err;
        console.log("Successfully connected");
    });
    try {
        const hashPassword = await bcrypt.hash(input.password, 10);

        const user = await User.findOne(
            { email: input.email }
        );

        if (user) { 
            console.log("Seeded test user email already exists\n", {email: input.email, password: input.password}); 
            process.exit(0); 
        };

        await User.create({
            firstName: input.firstName,
            lastName: input.lastName,
            email: input.email,
            password: hashPassword,
            accountType: input.accountType,
            dateOfBirth: input.dateOfBirth,
            mobile: input.mobile,
            status: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        console.log("Successfully added test user", {email: input.email, password: input.password});
    } catch (error) {
        console.log(error);
        process.exit(1);
    }

    process.exit(0);
};


module.exports = seedAdmin({
    firstName: "John",
    lastName: "Doe",
    email: "test@surge.com",
    password: "test123",
    accountType: "ADMIN",
    mobile: "076543876",
    dateOfBirth: new Date(),
});

