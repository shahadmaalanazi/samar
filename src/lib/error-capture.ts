let lastError: unknown = null;

if (typeof globalThis !== "undefined") {
  const originalError = console.error;
  console.error = (...args: unknown[]) => {
    for (const arg of args) {
      if (arg instanceof Error) {
        lastError = arg;
        break;
      }
    }
    originalError.apply(console, args);
  };
}

export function consumeLastCapturedError(): unknown {
  const err = lastError;
  lastError = null;
  return err;
}
