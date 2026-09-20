import type { AsyncLocalStorage } from "node:async_hooks";

let storage: AsyncLocalStorage<string> | undefined;
let storagePromise: Promise<AsyncLocalStorage<string>> | undefined;

async function getStorage(): Promise<AsyncLocalStorage<string> | undefined> {
  if (typeof window !== "undefined") return undefined;
  storagePromise ??= import("node:async_hooks").then(({ AsyncLocalStorage }) => {
    storage ??= new AsyncLocalStorage<string>();
    return storage;
  });
  return storagePromise;
}

export async function runWithNonce<T>(nonce: string, fn: () => Promise<T>): Promise<T> {
  const als = await getStorage();
  if (!als) return fn();
  return als.run(nonce, fn);
}

export function getCurrentNonce(): string | undefined {
  return storage?.getStore();
}
