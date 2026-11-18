/**
 * Uploads a package and its source archive to an existing Firefox add-on on AMO as a new listed version (add-ons API v5).
 *
 *   node scripts/release/amo.ts <package.xpi> <source.zip>
 *
 * Environment:
 *   AMO_JWT_ISSUER   API key from https://addons.mozilla.org/developers/addon/api/key/ (looks like user:123:456)
 *   AMO_JWT_SECRET   API secret from the same page
 *   AMO_ADDON_ID     the add-on's guid, slug or numeric id
 *   AMO_EXPECTED_VERSION  optional; fails if the uploaded package reports another version
 */
import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { basename } from "node:path";
import { signJwt } from "./jwt.ts";

const API = "https://addons.mozilla.org/api/v5";
const POLL_MS = 5_000;
const POLL_LIMIT_MS = 5 * 60_000;

const xpiPath = process.argv[2];
const sourcePath = process.argv[3];
if (!xpiPath || !sourcePath) fail("Usage: node scripts/release/amo.ts <package.xpi> <source.zip>");
const issuer = env("AMO_JWT_ISSUER");
const secret = env("AMO_JWT_SECRET");
const addon = env("AMO_ADDON_ID");

type Upload = {
  uuid: string;
  processed: boolean;
  valid: boolean;
  version?: string;
  validation?: { messages?: { type: string; message: string }[] };
};
type Version = { id: number; version: string };

const uploadForm = new FormData();
uploadForm.append("channel", "listed");
uploadForm.append("upload", new Blob([readFileSync(xpiPath)], { type: "application/x-xpinstall" }), basename(xpiPath));
let upload = await call<Upload>("POST", `${API}/addons/upload/`, uploadForm);
console.log(`Upload ${upload.uuid}: ${upload.processed ? "processed" : "validating"}`);

for (const started = Date.now(); !upload.processed; ) {
  if (Date.now() - started > POLL_LIMIT_MS) fail("Validation still running after 5 minutes; check the Developer Hub.");
  await new Promise((r) => setTimeout(r, POLL_MS));
  upload = await call<Upload>("GET", `${API}/addons/upload/${upload.uuid}/`);
  console.log(`Upload ${upload.uuid}: ${upload.processed ? "processed" : "validating"}`);
}

const messages = upload.validation?.messages;
for (const m of messages ?? []) (m.type === "error" ? console.error : console.warn)(`${m.type}: ${m.message}`);
if (!upload.valid) {
  if (!messages) console.error(JSON.stringify(upload.validation));
  fail("AMO rejected the package; the messages above say why.");
}

const expected = process.env.AMO_EXPECTED_VERSION;
if (expected && upload.version && upload.version !== expected) {
  fail(`Uploaded package reports version ${upload.version}, expected ${expected}.`);
}

const versionForm = new FormData();
versionForm.append("upload", upload.uuid);
versionForm.append("source", new Blob([readFileSync(sourcePath)], { type: "application/zip" }), basename(sourcePath));
const created = await call<Version>("POST", `${API}/addons/addon/${addon}/versions/`, versionForm);
console.log(`Created listed version ${created.version} (id ${created.id}) with source; it is awaiting review.`);

async function call<T>(method: string, url: string, body?: FormData): Promise<T> {
  // A fresh token per request: AMO caps a token's lifetime at 5 minutes, and polling can outlive one.
  const now = Math.floor(Date.now() / 1000);
  const token = signJwt({ iss: issuer, jti: randomUUID(), iat: now, exp: now + 60 }, secret);
  // No Content-Type here: fetch sets multipart/form-data with the boundary for FormData bodies.
  const res = await fetch(url, { method, headers: { Authorization: `JWT ${token}` }, body });
  const text = await res.text();
  if (!res.ok) fail(`${method} ${url} failed with ${res.status}:\n${text}`);
  return (text ? JSON.parse(text) : {}) as T;
}

function env(name: string): string {
  const value = process.env[name];
  if (!value) fail(`Missing environment variable ${name}`);
  return value;
}

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}
