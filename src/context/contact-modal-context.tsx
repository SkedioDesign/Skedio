import React, { useState, useEffect } from "react";

import { ContactModalContext } from "@/context/use-contact-modal";

export function ContactModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openContactModal = () => setIsOpen(true);
  const closeContactModal = () => setIsOpen(false);

  useEffect(() => {
    // Listen for custom event
    const handleOpenEvent = () => setIsOpen(true);
    window.addEventListener("open-contact-modal", handleOpenEvent);

    // Delegated click handler for any #contact or data-contact-modal elements
    const handleGlobalClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a, button");
      if (!target) return;

      const href = target.getAttribute("href");
      const isContactTrigger =
        target.hasAttribute("data-contact-modal") ||
        href === "#contact" ||
        target.textContent?.trim().toLowerCase().includes("let's talk");

      if (isContactTrigger) {
        e.preventDefault();
        e.stopPropagation();
        setIsOpen(true);
      }
    };

    document.addEventListener("click", handleGlobalClick, true);

    return () => {
      window.removeEventListener("open-contact-modal", handleOpenEvent);
      document.removeEventListener("click", handleGlobalClick, true);
    };
  }, []);

  return (
    <ContactModalContext.Provider value={{ isOpen, openContactModal, closeContactModal }}>
      {children}
    </ContactModalContext.Provider>
  );
}
