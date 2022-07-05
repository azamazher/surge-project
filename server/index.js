const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/user.model");
const Note = require("./models/note.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
app.use(cors());
app.use(express.json());

const dbName = "full-mern-stack-video";
const dbUrl = `mongodb://localhost:27017/${dbName}`;
const jwtSecret = "secret123";

mongoose.connect(dbUrl, { useUnifiedTopology: true }, (err) => {
  if (err) throw err;
  console.log("Successfully connected");
});

// Users
app.post("/api/register", async (req, res) => {
  console.log(req.body);
  try {
    const newPassword = await bcrypt.hash(req.body.password, 10);
    await User.create({
      name: req.body.name,
      email: req.body.email,
      password: newPassword,
    });
    return res.json({ status: "ok" });
  } catch (err) {
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
        name: user.name,
        email: user.email,
      },
      jwtSecret
    );
    return res.json({ status: "ok", user: token });
  } else {
    return res.json({ status: "error", user: false });
  }
});

// Notes
app.get("/api/notes", async (req, res) => {
  const token = req.headers["x-access-token"];

  try {
    const decoded = jwt.verify(token, jwtSecret);
    const userId = decoded.id;

    const notes = await Note.find({
      createdBy: userId,
    });

    return res.json({
      status: "ok",
      notes,
    });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", error: "invalid token" });
  }
});

app.post("/api/note", async (req, res) => {
  const token = req.headers["x-access-token"];

  try {
    const decoded = jwt.verify(token, jwtSecret);
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
    const decoded = jwt.verify(token, jwtSecret);
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
    const decoded = jwt.verify(token, jwtSecret);
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

app.listen(1337, () => {
  console.log("Server started on 1337");
});
