import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("GitHub Pages build contains the application entry point", async () => {
  const html = await readFile("pages-dist/index.html", "utf8");
  assert.match(html, /Unterrichtsdokumentation/);
  assert.match(html, /assets\/.*\.js/);
  assert.match(html, /assets\/.*\.css/);
  assert.match(html, /fallback-app\.js/);

  const fallback = await readFile("pages-dist/assets/fallback-app.js");
  assert.ok(fallback.byteLength > 100_000);
});

test("the application uses file exports instead of browser persistence", async () => {
  const app = await readFile("src/App.tsx", "utf8");
  assert.match(app, /exportPdf/);
  assert.match(app, /exportExcel/);
  assert.doesNotMatch(app, /localStorage|sessionStorage/);
});
