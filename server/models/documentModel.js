const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Creating a schema for the document to be stored in the database
const documentSchema = new mongoose.Schema({
  documentId: { type: String, required: true, unique: true },
  content: { type: String, default: "" },

  // This will hold the expiry time and allow us to dynamically update it
  expiry: { type: Date, required: true, default: Date.now },

  createdAt: { type: Date, default: Date.now },
});

// TTL index for 'expiry' field
// MongoDB will automatically remove documents after the expiry date
documentSchema.index({ expiry: 1 }, { expireAfterSeconds: 7200 }); // 2 hours TTL

// Creating a model which is a database with Document
const Document = mongoose.model("Document", documentSchema);

module.exports = Document;
