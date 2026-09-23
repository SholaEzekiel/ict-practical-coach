"use client";

import { useEffect } from "react";

export function PwaCleanup() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => {
        if (registration.scope.startsWith(window.location.origin)) {
          void registration.unregister();
        }
      });
    }).catch(() => {
      // Cleanup should not interrupt study activities if service workers are unavailable.
    });
  }, []);

  return null;
}
