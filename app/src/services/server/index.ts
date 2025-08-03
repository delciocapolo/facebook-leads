import http from "node:http";
import express from "express";
import cors from "cors";
import { Server as SocketServer } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new SocketServer(server, {
   cors: {
      origin: "*",
      methods: ["GET", "POST"],
   },
   pingInterval: 5000,
   pingTimeout: 5000,
});

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/heathy', (_, res) => res.status(200).json({ message: "Server is up" }));

// SOCKET HANDLER
io.on('connection', (socket) => {
   const socketId = socket.id;
   socket.join(socketId);
});

app.all('*', (req, res) => {
   return res
      .status(404)
      .json({ message: `Route not found ${req.originalUrl}` });
});

export {
   server,
   app,
   io,
};
