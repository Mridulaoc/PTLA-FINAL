import express, { Express } from "express";
import bodyParser from "body-parser";
import cors, { CorsOptions } from "cors";
import { connectDatabase } from "./infrastructure/database/db";
import dotenv from "dotenv";
dotenv.config();
import passport from "passport";
import path from "path";
import morgan from "morgan";
import { Server, Socket } from "socket.io";
import http from "http";
import { startExpirationCron } from "./infrastructure/services/Cron/expirationCron";
import { socketAuthMiddleware } from "./infrastructure/middleware/socketMiddleware";
import { startBundleExpiryNotificationCron } from "./infrastructure/services/Cron/bundleExpiryNotificationCron";
import userRouter from "./presentation/routes/userRoute";
import adminRouter from "./presentation/routes/adminRoutes";
import { ChatSocketService } from "./infrastructure/services/socketServices/chatSocketService";
import { NotificationSocketService } from "./infrastructure/services/socketServices/notificationSocketService";
import { webRTCSocketService } from "./infrastructure/services/socketServices/webrtcSocketService";
import {
  activeNotificationUsers,
  notificationService,
} from "./infrastructure/services/socketServices/notificationServiceInstance";

const app: Express = express();

app.use(passport.initialize());
const corsOptions: CorsOptions = {
  origin: process.env.CLIENT_URL,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Content-Range", "X-Content-Range"],
  optionsSuccessStatus: 200,
  credentials: true,
};
app.use(cors(corsOptions));

app.use((req, res, next) => {
  res.removeHeader("Cross-Origin-Opener-Policy");
  res.removeHeader("Cross-Origin-Embedder-Policy");
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan("dev"));

const uploadDir = path.join(__dirname, "../uploads");

app.use("/uploads", express.static(uploadDir));

app.use((req, res, next) => {
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
});

app.use("/", userRouter);
app.use("/admin", adminRouter);

app.all("*", (req, res, next) => {
  if (req.path.startsWith("/socket.io")) {
    return next();
  }

  next();
});
const server = http.createServer(app);
const SECRET_KEY = process.env.JWT_SECRET_KEY || "your_secret_key";
export const activeUsers = new Map();
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
  path: "/socket.io/",
  serveClient: false,
});

// Define Namespaces
export const chatNamespace = io.of("/chat");
export const notificationNamespace = io.of("/notification");
const webRTCNamespace = io.of("/webrtc");

// socket authentication middleware
chatNamespace.use(socketAuthMiddleware);
webRTCNamespace.use(socketAuthMiddleware);
notificationNamespace.use(socketAuthMiddleware);

// chat namespace connection
chatNamespace.on("connection", (socket) => {
  const user = socket.data.user;
  activeUsers.set(user.id, {
    socketId: socket.id,
    userType: user.type,
    userName:
      user.type === "admin" ? user.name : `${user.firstName} ${user.lastName}`,
    profileImg: user.profileImg,
    lastActive: new Date(),
  });

  const heartbeatInterval = setInterval(() => {
    socket.emit("heartbeat");
  }, 30000);

  socket.on("heartbeat-response", () => {
    if (activeUsers.has(user.id)) {
      activeUsers.get(user.id).lastActive = new Date();
    }
  });
  const chatService = new ChatSocketService();
  chatService.handleChatSocketEvents(socket, chatNamespace, activeUsers);
  socket.on("disconnect", (reason) => {
    clearInterval(heartbeatInterval);
    activeUsers.delete(user.id);
  });
});

// notification namespace connection
notificationNamespace.on("connection", (socket) => {
  const user = socket.data.user;
  if (!user || !user.id) {
    socket.disconnect();
    return;
  }
  activeNotificationUsers.set(user.id, socket.id);
  if (user.type === "admin") {
    socket.join("admin");
  } else {
    socket.join(`user:${user.id}`);
  }
  socket.emit("notification:connected", {
    userId: user.id,
    userType: user.type,
    status: "connected",
  });

  const heartbeatInterval = setInterval(() => {
    socket.emit("heartbeat");
  }, 30000);

  notificationService.handleNotificationSocketEvents(socket);
  socket.on("disconnect", (reason) => {
    activeNotificationUsers.delete(user.id);
    clearInterval(heartbeatInterval);
  });
});

// webrtc namespace connection
webRTCNamespace.on("connection", (socket) => {
  const heartbeatInterval = setInterval(() => {
    socket.emit("heartbeat");
  }, 30000);

  socket.on("heartbeat-response", () => {
    if (activeUsers.has(socket.data.user?.userId)) {
      activeUsers.get(socket.data.user?.userId).lastActive = new Date();
    }
  });

  const webrtcService = webRTCSocketService(
    socket,
    webRTCNamespace,
    activeUsers
  );

  socket.on("disconnect", (reason) => {
    clearInterval(heartbeatInterval);
  });
});

connectDatabase();
startExpirationCron();
startBundleExpiryNotificationCron();
export { io };
export { server };
export default app;
