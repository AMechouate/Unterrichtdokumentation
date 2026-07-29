import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("renders the Tertia documentation workspace", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Tertia Unterrichtsdokumentation<\/title>/i);
  assert.match(html, /Unterrichtsdokumentation/);
  assert.match(html, /Teilnehmer/);
  assert.match(html, /Selbstlernphase in ILIAS/);
  assert.match(html, /Besonderheiten/);
  assert.match(html, /E-Mail vorbereiten/);
  assert.match(html, /Demo · Beispieldaten/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});

test("keeps seed data valid and removes the starter preview", async () => {
  const data = JSON.parse(await readFile(new URL("../data/course.json", import.meta.url), "utf8"));

  assert.equal(typeof data.course, "string");
  assert.ok(data.participants.length >= 5);
  assert.ok(data.participants.every((participant) => participant.id && participant.name && participant.initials));
  await assert.rejects(access(new URL("../app/_sites-preview/SkeletonPreview.tsx", import.meta.url)));
});
