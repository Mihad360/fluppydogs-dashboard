import { Suspense } from "react";
import LoginPageClient from "./LoginPageClient";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div
          className="min-h-screen"
          style={{ background: "#FAF7FF" }}
        />
      }
    >
      <LoginPageClient />
    </Suspense>
  );
}
