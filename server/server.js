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

// In-memory session store
const sessions = {};

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

  socket.on("joinRoom", (roomId) => {
    if (!sessions[roomId]) {
      sessions[roomId] = {
        startTime: Date.now(),
        duration: 3600000, // 1 hour session duration
        extended: false,
        lastSaved: Date.now(), // Initialize lastSaved when the room is created
      };
      console.log(`Session ${roomId} started`);
    }
    socket.join(roomId);

    // Emit session info to the user
    socket.emit("sessionInfo", sessions[roomId]);

    console.log(`User joined room: ${roomId}`);
  });

  socket.on("extendSession", (roomId) => {
    const session = sessions[roomId];
    if (session && !session.extended) {
      session.duration += 3600000; // Add 1 hour
      session.extended = true;
      console.log(`Session ${roomId} extended by 1 hour`);
      socket.emit("sessionExtended", { message: "Session extended by 1 hour" });
    } else {
      socket.emit("sessionExtensionFailed", {
        message: "Session cannot be extended",
      });
    }
  });

  socket.on("codeChange", async ({ roomId, code }) => {
    console.log("code change", code);
    socket.broadcast.to(roomId).emit("receiveCode", code);

    // Ensure that the session for the room exists before trying to access lastSaved
    if (sessions[roomId]) {
      // Debounce save (save after 5 seconds of inactivity)
      if (Date.now() - sessions[roomId].lastSaved > 5000) {
        sessions[roomId].lastSaved = Date.now();

        const document = await Document.findOne({ documentId: roomId });
        if (document) {
          await Document.findOneAndUpdate(
            { documentId: roomId },
            { content: code }
          );
          console.log(`Document ${roomId} saved`);
        } else {
          console.log(`Document ${roomId} not found, creating new document.`);
          const newDocument = new Document({ documentId: roomId, content: code });
          await newDocument.save();
          console.log(`Document ${roomId} created and saved.`);
        }
      }
    } else {
      console.error(`Session for room ${roomId} does not exist.`);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Periodically check for session expiration
setInterval(async () => {
  Object.keys(sessions).forEach(async (sessionId) => {
    const session = sessions[sessionId];
    if (Date.now() - session.startTime > session.duration) {
      io.to(sessionId).emit("sessionExpired", {
        message: "Session has expired",
      });

      await Document.findOneAndDelete({ documentId: sessionId });
      console.log(`Document ${sessionId} deleted after session expired`);

      delete sessions[sessionId];
    }
  });
}, 60000); // Check every 60 seconds

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
