import { createStart } from "@tanstack/react-start";
import { initClientSentry } from "./lib/sentry-client";

initClientSentry();

export const startInstance = createStart(() => {
  return {};
});
