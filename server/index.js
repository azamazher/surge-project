const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/user.model");
const Note = require("./models/note.model");
const jwt = require("jsonwebtoken");
const sendMail = require("./utils/sendMail");
const bcrypt = require("bcryptjs");
const generator = require("generate-password");
const config = require("./config");
app.use(cors());
app.use(express.json());

const dbUrl = `mongodb://${config.db.host}:${config.db.port}/${config.db.name}`;

mongoose.connect(dbUrl, { useUnifiedTopology: true }, (err) => {
  if (err) throw err;
  console.log("Successfully connected");
});

// AuthN and AuthZ
app.post("/api/register", async (req, res) => {
  try {
    const tempPassword = generator.generate({
      length: 10,
      numbers: true,
    });
    const hashPassword = await bcrypt.hash(tempPassword, 10);

    await User.create({
      firstName: req.body.firstName,
      email: req.body.email,
      password: hashPassword,
      accountType: req.body.accountType,
      status: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await sendMail({
      to: req.body.email,
      subject: "You've successfully registered",
      body: { email: req.body.email, password: tempPassword },
    });
    return res.json({ status: "ok" });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", error: "Duplicate email" });
  }
});

app.post("/api/login", async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
  });

  if (!user) {
    return { status: "error", error: "Invalid login" };
  }

  const isPasswordValid = await bcrypt.compare(
    req.body.password,
    user.password
  );

  if (isPasswordValid) {
    const token = jwt.sign(
      {
        id: user._id,
        firstName: user.firstName,
        status: user.status,
        accountType: user.accountType,
        email: user.email,
      },
      config.jwt.secret
    );
    return res.json({ status: "ok", user: token });
  } else {
    return res.json({ status: "error", user: false });
  }
});

// Profile
app.post("/api/profile", async (req, res) => {
  const token = req.headers["x-access-token"];
  const decoded = jwt.verify(token, config.jwt.secret);
  const userId = decoded.id;

  try {
    const newPassword = await bcrypt.hash(req.body.password, 10);

    await User.updateOne(
      { _id: userId },
      {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        dateOfBirth: new Date(req.body.dateOfBirth),
        mobile: req.body.mobile,
        password: newPassword,
        status: 1,
        updatedAt: new Date(),
      }
    );
    return res.json({ status: "ok" });
  } catch (err) {
    console.log(error);
    res.json({ status: "error", error: "Duplicate email" });
  }
});

app.get("/api/profile", async (req, res) => {
  const token = req.headers["x-access-token"];
  const decoded = jwt.verify(token, config.jwt.secret);
  const userId = decoded.id;

  try {
    const userDetails = await User.findOne(
      { _id: userId }
    );
    return res.json({ status: "ok", user: userDetails });
  } catch (err) {
    console.log(error);
    res.json({ status: "error", error: "Duplicate email" });
  }
});



// Users
app.get("/api/users", async (req, res) => {
  const token = req.headers["x-access-token"];
  const pagination = {
    limitTo: req.query.limitTo,
    skip: req.query.skip,
  };

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    const total = await User.countDocuments({});

    // TODO: generalize it as a middleware for authorization
    if (!decoded.status && !decoded.accountType === "ADMIN") {
      res.json({ status: "error", error: "access denied" });
    }

    let users = [];

    if (pagination && pagination.skip && pagination.limitTo) {
      users = await User.find({})
        .skip(parseInt(pagination.skip))
        .limit(parseInt(pagination.limitTo));
    } else {
      users = await User.find({});
    }

    return res.json({
      status: "ok",
      data: [...users.map((user) => {
        return {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          dateOfBirth: user.dateOfBirth,
          mobile: user.mobile,
          status: user.status,
          accountType: user.accountType,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        };
      })],
      metadata: {
        total,
        limitTo: pagination && pagination.limitTo ? pagination.limitTo : 0,
        skip: pagination && pagination.skip ? pagination.skip : 0,
      },
    });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", error: "invalid token" });
  }
});


// Notes
app.get("/api/notes", async (req, res) => {
  const token = req.headers["x-access-token"];
  const pagination = {
    limitTo: req.query.limitTo,
    skip: req.query.skip,
  };

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    const userId = decoded.id;

    const total = await Note.countDocuments({
      createdBy: userId,
    });

    let notes = [];

    if (pagination && pagination.skip && pagination.limitTo) {
      notes = await Note.find({
        createdBy: userId,
      })
        .skip(parseInt(pagination.skip))
        .limit(parseInt(pagination.limitTo));
    } else {
      notes = await Note.find({
        createdBy: userId,
      });
    }

    return res.json({
      status: "ok",
      data: [...notes],
      metadata: {
        total,
        limitTo: pagination && pagination.limitTo ? pagination.limitTo : 0,
        skip: pagination && pagination.skip ? pagination.skip : 0,
      },
    });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", error: "invalid token" });
  }
});

app.post("/api/note", async (req, res) => {
  const token = req.headers["x-access-token"];

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    const userId = decoded.id;

    const note = await Note.create({
      title: req.body.title,
      description: req.body.description,
      createdBy: userId,
      createdAt: new Date(),
    });

    return res.json({
      status: "ok",
      note: {
        id: note._id,
        title: req.body.title,
        description: req.body.description,
        createdBy: Note.createdBy,
        createdAt: Note.createdAt,
      },
    });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", error: "invalid token" });
  }
});

app.patch("/api/note/:id", async (req, res) => {
  const token = req.headers["x-access-token"];
  const noteId = req.params.id;

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    const userId = decoded.id;

    const updatedNote = await Note.updateOne(
      { _id: noteId, createdBy: userId },
      {
        $set: {
          title: req.body.title,
          description: req.body.description,
        },
      }
    );

    return res.json({
      status: "ok",
      note: updatedNote,
    });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", error: "invalid token" });
  }
});

app.delete("/api/note/:id", async (req, res) => {
  const token = req.headers["x-access-token"];
  const noteId = req.params.id;

  // TODO: Add valiation for noteId, createdBy user
  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    const userId = decoded.id;

    const deletedNote = await Note.deleteOne({
      _id: noteId,
      createdBy: userId,
    });

    return res.json({
      status: "ok",
      note: deletedNote,
    });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", error: "invalid token" });
  }
});

app.listen(config.app.port, () => {
  console.log(`Server started on ${config.app.port}`);
});
