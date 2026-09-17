"use client";
import { Provider } from "react-redux";
import { store } from "./store";
import NotificationProvider from "@/components/providers/NotificationProvider";
import { SocketProvider } from "@/components/providers/SocketProvider";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <SocketProvider>
        <NotificationProvider>{children}</NotificationProvider>
      </SocketProvider>
    </Provider>
  );
}
