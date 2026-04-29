const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const profileRoutes = require("./routes/profileRoutes");
const jobRoutes = require("./routes/jobRoutes");
const connectionRoutes = require("./routes/connectionRoutes");
const eventRoutes = require("./routes/eventRoutes");
const announcementRoutes = require("./routes/announcementRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const searchRoutes = require("./routes/searchRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const chatRoutes = require("./routes/chatRoutes");
const externalRoutes = require("./routes/externalRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");

const http = require("http");
const { Server } = require("socket.io");

// Load environment variables
dotenv.config();
connectDB();

// Initialize Express App
const app = express();
app.use(express.json());
app.use(cors());

// Route Middlewares
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/connections", connectionRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/external", externalRoutes);
app.use("/api/recommendations", recommendationRoutes);

// Create HTTP server
const server = http.createServer(app);

// Setup Socket.io (real-time communication)
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Store online users
global.onlineUsers = {};

io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  // --- 1. User joins ---
  socket.on("join", (userId) => {
    onlineUsers[userId] = socket.id;
    console.log("Online Users:", onlineUsers);
  });

  // --- 2. Real-Time Chat ---
  socket.on("send_message", (data) => {
    console.log("📩 Incoming Message:", data);

    const receiverSocket = onlineUsers[data.receiverId];

    if (receiverSocket) {
      io.to(receiverSocket).emit("new_message", data);
      console.log("📤 Message sent to:", receiverSocket);
    } else {
      console.log("⚠ Receiver offline → message saved only in DB");
    }
  });

  // --- 3. Disconnect handler ---
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    for (const id in onlineUsers) {
      if (onlineUsers[id] === socket.id) {
        delete onlineUsers[id];
        break;
      }
    }
  });
});

// Make io available in controllers
app.set("io", io);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
