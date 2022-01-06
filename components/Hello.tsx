import React from "react";
import { useEffect } from "react";
import io from "socket.io-client";
import { Doc } from "yjs";

export default () => {
  useEffect(() => {
    let d = new Doc();
    fetch("/api/ws").finally(() => {
      const socket = io();
      socket.on("connect", () => {
        console.log("connect");
        socket.emit("hello");
      });

      socket.on("hello", (data) => {
        console.log("hello", data);
      });

      socket.on("disconnect", () => {
        console.log("disconnect");
      });
    });
  });

  return <h1>Socket.io inited . yes</h1>;
};
