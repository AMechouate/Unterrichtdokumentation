import { readFile, writeFile } from "node:fs/promises";

const htmlPath = new URL("../pages-dist/index.html", import.meta.url);
const scriptPath = new URL(
  "../pages-dist/assets/fallback-app.js",
  import.meta.url,
);
const marker = "__FALLBACK_APP_SOURCE__";

const [html, script] = await Promise.all([
  readFile(htmlPath, "utf8"),
  readFile(scriptPath, "utf8"),
]);

if (!html.includes(marker)) {
  throw new Error("Fallback marker is missing from the generated HTML file.");
}

const safeScript = script.replace(/<\/script/gi, "<\\/script");
await writeFile(htmlPath, html.replace(marker, () => safeScript));
