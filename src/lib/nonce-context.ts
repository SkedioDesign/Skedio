import { AsyncLocalStorage } from "node:async_hooks";

let storage: AsyncLocalStorage<string> | undefined;
if (typeof window === "undefined") {
  storage = new AsyncLocalStorage<string>();
}

export function runWithNonce<T>(nonce: string, fn: () => Promise<T>): Promise<T> {
  if (!storage) return fn();
  return storage.run(nonce, fn);
}

export function getCurrentNonce(): string | undefined {
  return storage?.getStore();
}
