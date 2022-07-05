const mongoose = require("mongoose");

const Note = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, required: true },
    createdAt: { type: mongoose.Schema.Types.Date, required: true },
  },
  { collection: "notes" }
);

const model = mongoose.model("NoteData", Note);
module.exports = model;
