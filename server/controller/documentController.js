const Document = require("../models/documentModel");

// Retrieve the document from the database or create a new one
exports.getOrCreateDocument = async (req, res) => {
  try {
    // Check if the document already exists
    let document = await Document.findOne({
      documentId: req.params.documentId,
    });
    console.log("document", document);
    // If it exists, return the existing document
    if (document) {
      return res.status(200).json(document);
    }

    // Otherwise, create a new document
    const newDocument = new Document({
      documentId: req.params.documentId,
      content: req.body.content || "",
    });

    await newDocument.save();
    res.status(201).json(newDocument);
  } catch (error) {
    console.error("Error fetching or creating document:", error);

    // Handle duplicate key error more gracefully
    if (error.code === 11000) {
      return res.status(409).json({ message: "Document already exists" });
    }

    res.status(500).json({ message: "Server error" });
  }
};

// // Create a new document
// exports.createDocument = async (req, res) => {
//   try {
//     const document = new Document({
//       documentId: req.params.documentId,
//       content: req.body.content,
//     });
//     await document.save();
//     res.status(201).json(document);
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

// Update a document
exports.updateDocument = async (req, res) => {
  try {
    const updatedDocument = await Document.findOneAndUpdate(
      { documentId: req.params.documentId },
      { content: req.body.content, lastUpdated: Date.now() },
      { new: true }
    );
    res.json(updatedDocument);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
// Delete a document by ID
exports.deleteDocument = async (req, res) => {
  try {
    const document = await Document.findOneAndDelete({
      documentId: req.params.documentId,
    });

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    res.status(200).json({ message: "Document deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
