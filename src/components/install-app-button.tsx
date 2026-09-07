"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice?: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

function isStandalone() {
  return window.matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone;
}

export function InstallAppButton() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isStandalone()) return;
    setVisible(true);

    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
      setVisible(true);
    }

    function handleInstalled() {
      setVisible(false);
      setInstallPrompt(null);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  async function installApp() {
    if (!installPrompt) {
      window.alert("To install Peak Study Hub, open this site in Chrome or Edge, then use the browser menu and choose Install app or Add to home screen.");
      return;
    }
    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (!choice || choice.outcome !== "dismissed") {
      setVisible(false);
      setInstallPrompt(null);
    }
  }

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={installApp}
      aria-label="Install Peak Study Hub"
      className="inline-flex items-center gap-2 rounded-lg border border-line bg-white px-2.5 py-2 text-sm font-semibold text-ocean shadow-sm hover:border-ocean sm:px-3"
    >
      <Download size={16} aria-hidden="true" />
      <span className="hidden sm:inline">Install</span>
    </button>
  );
}
