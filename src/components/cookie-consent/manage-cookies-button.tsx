"use client";

import { useCookieConsent } from "./cookie-context";

export function ManageCookiesButton() {
  const { setModalOpen } = useCookieConsent();

  return (
    <button 
      onClick={() => setModalOpen(true)}
      className="hover:text-foreground transition-colors text-left"
    >
      Manage Cookies
    </button>
  );
}
