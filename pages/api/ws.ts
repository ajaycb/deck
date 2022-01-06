import type { NextApiRequest, NextApiResponse } from "next";
import Server from "socket.io";

const ioHandler = (req: NextApiRequest, res: NextApiResponse) => {
  let server = (res.socket as any).server;

  if (!server.io) {
    console.log("*First use, starting socket.io");

    const io = (Server as any)(server);

    io.on("connection", (socket) => {
      console.log("connected");
      socket.broadcast.emit("a user connected");
      socket.on("hello", (msg) => {
        socket.emit("hello", "world!");
      });
    });

    server.io = io;
  } else {
    console.log("socket.io already running");
  }
  res.end();
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default ioHandler;
