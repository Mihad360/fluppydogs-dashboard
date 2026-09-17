"use client";

import { useSocketContext } from "@/components/providers/SocketProvider";

export const useSocket = () => {
  return useSocketContext();
};
