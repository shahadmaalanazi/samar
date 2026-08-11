// fix-manifest.mjs
// Runs after vite build to patch the small dev-mode manifest
// with the correct production asset paths from the hashed manifest.

import { readFileSync, writeFileSync, readdirSync } from "fs";
import { join } from "path";

const SERVER_DIR = join(
  process.cwd(),
  ".netlify/functions-internal/server"
);

// Find the big hashed manifest (e.g. _tanstack-start-manifest_v-CTssHRIL.mjs)
const files = readdirSync(SERVER_DIR);
const hashedManifest = files.find(
  (f) =>
    f.startsWith("_tanstack-start-manifest_v-") && f.endsWith(".mjs")
);

if (!hashedManifest) {
  console.error("[fix-manifest] ERROR: Could not find hashed manifest file!");
  process.exit(1);
}

const hashedManifestPath = join(SERVER_DIR, hashedManifest);
const smallManifestPath = join(SERVER_DIR, "_tanstack-start-manifest_v.mjs");

const hashedContent = readFileSync(hashedManifestPath, "utf-8");

// Verify the hashed manifest has production paths (not dev entries)
if (hashedContent.includes("virtual:tanstack-start-dev-client-entry")) {
  console.error("[fix-manifest] ERROR: Hashed manifest ALSO has dev entries – aborting.");
  process.exit(1);
}

// Replace the small dev manifest with the content of the hashed production manifest
writeFileSync(smallManifestPath, hashedContent, "utf-8");

console.log(`[fix-manifest] ✓ Patched _tanstack-start-manifest_v.mjs with production paths from ${hashedManifest}`);
