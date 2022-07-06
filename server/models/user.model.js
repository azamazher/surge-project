const mongoose = require("mongoose");

const User = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: { type: String, required: true, unique: true },
    dateOfBirth: { type: mongoose.Schema.Types.Date},
    mobile: { type: mongoose.Schema.Types.String },
    status: { type: mongoose.Schema.Types.Boolean },
    password: { type: String, required: true },
    accountType: { type: String },
    createdAt: { type: mongoose.Schema.Types.Date, required: true },
    updatedAt: { type: mongoose.Schema.Types.Date, required: true },
  },
  { collection: "users" }
);

const model = mongoose.model("UserData", User);
module.exports = model;
