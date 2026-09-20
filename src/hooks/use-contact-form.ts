import { type ChangeEvent, useState } from "react";
import { logWarn } from "@/lib/error-capture";

export type ContactFormStatus = "idle" | "loading" | "sent" | "error";

const FORM_ENDPOINT = "https://formsubmit.co/ajax/skediodesignspace@gmail.com";

export const DEFAULT_FORM_ERROR =
  "Something went wrong. Please try again or email us directly at skediodesignspace@gmail.com";

type UseContactFormArgs = {
  getBody: (honey: string) => Record<string, string>;
  errorCopy?: string;
  onSent?: () => void;
};

export function useContactForm({
  getBody,
  errorCopy = DEFAULT_FORM_ERROR,
  onSent,
}: UseContactFormArgs) {
  const [status, setStatus] = useState<ContactFormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [honey, setHoney] = useState("");

  const handleHoneyChange = (e: ChangeEvent<HTMLInputElement>) => setHoney(e.target.value);

  const submit = async () => {
    if (honey) return;
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...getBody(honey),
          _honey: honey,
          _captcha: "true",
        }),
      });

      if (!res.ok) {
        setStatus("error");
        setErrorMessage(errorCopy);
        return;
      }

      setStatus("sent");
      onSent?.();
    } catch (err: unknown) {
      logWarn("Direct submission notice:", err);
      setStatus("error");
      setErrorMessage(errorCopy);
    }
  };

  const reset = () => {
    setStatus("idle");
    setErrorMessage("");
  };

  return {
    status,
    errorMessage,
    honey,
    handleHoneyChange,
    submit,
    reset,
    isSubmitting: status === "loading",
  };
}
