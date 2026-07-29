import { readFile, writeFile } from "node:fs/promises";

const htmlPath = new URL("../pages-dist/index.html", import.meta.url);
const scriptPath = new URL(
  "../pages-dist/assets/fallback-app.js",
  import.meta.url,
);
const stylePath = new URL(
  "../pages-dist/fallback-app.css",
  import.meta.url,
);
const scriptMarker = "__FALLBACK_APP_SOURCE__";
const styleMarker = "__APP_STYLE_SOURCE__";

const [html, script, styles] = await Promise.all([
  readFile(htmlPath, "utf8"),
  readFile(scriptPath, "utf8"),
  readFile(stylePath, "utf8"),
]);

if (!html.includes(scriptMarker)) {
  throw new Error("Fallback marker is missing from the generated HTML file.");
}

if (!html.includes(styleMarker)) {
  throw new Error("Style marker is missing from the generated HTML file.");
}

const safeScript = script.replace(/<\/script/gi, "<\\/script");
const safeStyles = styles.replace(/<\/style/gi, "<\\/style");
const selfContainedHtml = html
  .replace(styleMarker, () => safeStyles)
  .replace(scriptMarker, () => safeScript);

await writeFile(htmlPath, selfContainedHtml);
