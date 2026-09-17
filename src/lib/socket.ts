import { envConfig } from "@/config/envConfig";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(envConfig.socketUrl || "/", {
      autoConnect: false,
      transports: ["websocket"],
    });
  }
  return socket;
};

export const resetSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket.removeAllListeners();
    socket = null;
  }
};
