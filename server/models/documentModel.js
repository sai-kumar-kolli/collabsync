const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Creating a schema for the document to be stored in the database
const documentSchema = new Schema({
  documentId: { type: String, required: true, unique: true },
  content: { type: String, default: "" },
  lastUpdated: { type: Date, default: Date.now },
});
// Middleware to update 'lastUpdated' before saving the document
documentSchema.pre("save", function (next) {
  this.lastUpdated = Date.now();
  next();
});

//creating a model which is databse with Document
const Document = mongoose.model("Document", documentSchema);

module.exports = Document;
