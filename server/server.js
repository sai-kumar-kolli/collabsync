require("dotenv").config(); // Load environment variables
const express = require("express");
const http = require("http");
const path = require("path");
const socketIO = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const server = http.createServer(app);
const documentRoutes = require("./routes/documentRoutes");
const Document = require("./models/documentModel");

// Enable CORS for HTTP routes
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json()); // To handle JSON request bodies

// Connect MongoDB with Mongoose
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// API Routes
app.use("/api/documents", documentRoutes);

// Serve static files (React app)
app.use(express.static(path.join(__dirname, "../client/build")));

// Catch-all for React client-side routing
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

// WebSocket Setup
const io = socketIO(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("New user connected");

  // Join room when user connects
  socket.on("joinRoom", async (roomId) => {
    try {
      // Join the room
      socket.join(roomId);
      console.log(`User joined room: ${roomId}`);

      // Check if the document exists and emit session info
      const document = await Document.findOne({ documentId: roomId });
      if (document) {
        socket.emit("sessionInfo", {
          startTime: document.createdAt,
          duration: 3600000, // 1 hour
          sessionId: document.documentId,
        });
      } else {
        console.log(`No document found for roomId: ${roomId}`);
      }
    } catch (error) {
      console.error(`Error joining room ${roomId}:`, error);
    }
  });

  // Extend session duration (reset TTL)
  socket.on("extendSession", async (roomId) => {
    try {
      const document = await Document.findOne({ documentId: roomId });
      console.log("im in seesion expiry place", document, roomId);
      if (document) {
        // Reset TTL by updating the createdAt field to current time
        let time = new Date();
        document.createdAt = time;
        await document.save();
        socket.emit("sessionExtended", {
          message: "Session extended by 1 hour",
          sessionId: roomId,
          createdAt: time,
        });
        console.log(`Session for room ${roomId} extended by 1 hour`);
      } else {
        socket.emit("sessionExtensionFailed", {
          message: "Document not found, cannot extend session",
        });
      }
    } catch (error) {
      console.error(`Error extending session for room ${roomId}:`, error);
      socket.emit("sessionExtensionFailed", {
        message: "Session extension failed due to server error",
      });
    }
  });

  // Handle real-time code changes
  socket.on("codeChange", async ({ roomId, code }) => {
    try {
      // Broadcast the code change to other users in the same room
      socket.broadcast.to(roomId).emit("receiveCode", code);

      // Save the code to the database with a debounce-like mechanism (save every 5 seconds)
      const document = await Document.findOne({ documentId: roomId });
      if (document) {
        document.content = code;
        await document.save();
        console.log(`Document ${roomId} saved`);
      } else {
        console.log(`Document ${roomId} not found during code change`);
      }
    } catch (error) {
      console.error(`Error saving document for room ${roomId}:`, error);
    }
  });
  // Handle session expiry and document cleanup
  socket.on("sessionExpiry", async (roomId) => {
    console.log(`Session ${roomId} expired. Cleaning up...`);

    // Delete the document and session data
    await Document.findOneAndDelete({ documentId: roomId });
    socket.emit("sessionCleanup", { message: "Session and document deleted." });
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// 404 Middleware for Unmatched Routes
app.use((req, res, next) => {
  res.status(404).json({ error: "Resource not found" });
});

// Error-Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start the server
const port = process.env.PORT || 4200;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
