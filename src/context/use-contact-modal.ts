import { createContext, useContext } from "react";

export interface ContactModalContextType {
  isOpen: boolean;
  openContactModal: () => void;
  closeContactModal: () => void;
}

export const ContactModalContext = createContext<ContactModalContextType | undefined>(undefined);

export function useContactModal() {
  const context = useContext(ContactModalContext);
  if (!context) {
    throw new Error("useContactModal must be used within a ContactModalProvider");
  }
  return context;
}

export function triggerContactModal() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("open-contact-modal"));
  }
}
