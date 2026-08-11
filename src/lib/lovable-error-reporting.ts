export function reportLovableError(error: unknown, context?: Record<string, unknown>) {
  if (typeof process !== "undefined" && process?.env?.NODE_ENV !== "production") {
    console.error("[Lovable Error Captured]:", error, context);
  }
}
