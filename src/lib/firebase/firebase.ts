import { envConfig } from "@/config/envConfig";
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getMessaging, Messaging, isSupported } from "firebase/messaging";

function getFirebaseApp(): FirebaseApp | null {
  if (!envConfig.firebase.apiKey || !envConfig.firebase.projectId) {
    return null;
  }

  try {
    return getApps().length === 0
      ? initializeApp(envConfig.firebase)
      : getApps()[0];
  } catch (error) {
    console.error("Firebase init skipped:", error);
    return null;
  }
}

const app = getFirebaseApp();

export const getMessagingInstance = async (): Promise<Messaging | null> => {
  if (typeof window === "undefined") return null;
  if (!app || !envConfig.firebase.apiKey || !envConfig.firebase.projectId) {
    return null;
  }

  try {
    const supported = await isSupported();
    if (!supported) return null;
    return getMessaging(app);
  } catch (err) {
    console.error("Firebase messaging not supported:", err);
    return null;
  }
};

export default app;
