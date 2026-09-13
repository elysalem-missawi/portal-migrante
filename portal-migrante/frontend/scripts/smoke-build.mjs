import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const distDirectory = fileURLToPath(
  new URL("../dist/", import.meta.url)
);
const indexPath = path.join(distDirectory, "index.html");
const html = await readFile(indexPath, "utf8");

assert.match(
  html,
  /id=["']root["']/,
  "The production HTML must contain the React root element"
);
assert.match(
  html,
  /<script[^>]+type=["']module["'][^>]*>/,
  "The production HTML must load an ES module"
);

const assetUrls = Array.from(
  html.matchAll(/(?:src|href)=["']([^"']+\.(?:js|css))["']/g),
  (match) => match[1]
);
assert.ok(
  assetUrls.some((assetUrl) => assetUrl.endsWith(".js")),
  "The production HTML must reference a JavaScript bundle"
);
assert.ok(
  assetUrls.some((assetUrl) => assetUrl.endsWith(".css")),
  "The production HTML must reference a CSS bundle"
);

const javascriptBundles = [];
for (const assetUrl of assetUrls) {
  const relativePath = assetUrl
    .split("?")[0]
    .replace(/^\/+/, "");
  const assetPath = path.join(distDirectory, relativePath);
  const assetStat = await stat(assetPath);
  assert.ok(
    assetStat.isFile() && assetStat.size > 0,
    "Built asset is missing or empty: " + assetUrl
  );

  if (assetUrl.endsWith(".js")) {
    javascriptBundles.push(await readFile(assetPath, "utf8"));
  }
}

assert.ok(
  javascriptBundles.some((bundle) =>
    bundle.includes("admin/moderation")
  ),
  "The moderation route must be present in the production bundle"
);

const builtAssetFiles = await readdir(
  path.join(distDirectory, "assets")
);
for (const routeChunk of [
  "admin.moderation-",
  "organizations.manage-",
  "organizations.service-form-",
]) {
  assert.ok(
    builtAssetFiles.some(
      (assetFile) =>
        assetFile.startsWith(routeChunk) &&
        assetFile.endsWith(".js")
    ),
    "Missing lazy route chunk: " + routeChunk
  );
}

console.log(
  "Frontend smoke test passed: shell and " +
    builtAssetFiles.length +
    " built assets verified."
);
