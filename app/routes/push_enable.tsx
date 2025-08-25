import { useEffect } from "react";
import { getFcmToken, listenForMessages } from "@/utils/firebase.client";

export default function Index() {
  useEffect(() => {
    getFcmToken().then(async (token) => {
      if (token) {
        await fetch("/api/register-token", {
          method: "POST",
          body: JSON.stringify({ token }),
          headers: { "Content-Type": "application/json" },
        });
      }
    });

    listenForMessages();
  }, []);

  return <h1>📡 Firebase Push 활성화됨</h1>;
}
