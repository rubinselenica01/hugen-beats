/**
 * Fetches Stitch screen screenshot + HTML download URLs via MCP, then downloads with curl.
 * Usage: node scripts/fetch-stitch-screen.mjs
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Stitch, StitchToolClient } from "@google/stitch-sdk";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const mcpPath = path.join(root, ".cursor", "mcp.json");

function loadApiKey() {
  const raw = JSON.parse(fs.readFileSync(mcpPath, "utf8"));
  let key = raw.mcpServers?.stitch?.headers?.["X-Goog-Api-Key"];
  const m = typeof key === "string" && key.match(/^\$\{env:([^}]+)\}$/);
  if (m) key = process.env[m[1]];
  return key;
}

const PROJECT_ID = "13307668784550509451";
const SCREEN_ID = "8ea15eda6ae74464ae6ed09050c4eb18";
const OUT_DIR = path.join(
  root,
  "stitch-export",
  "core-spotify-experience-prd",
  "home-custom-composition",
);

const apiKey = loadApiKey();
if (!apiKey) {
  console.error("Missing API key in .cursor/mcp.json or env interpolation.");
  process.exit(1);
}

const client = new StitchToolClient({
  apiKey,
  baseUrl: "https://stitch.googleapis.com/mcp",
});
const sdk = new Stitch(client);
const project = sdk.project(PROJECT_ID);
const screen = await project.getScreen(SCREEN_ID);

const imageUrl = await screen.getImage();
const htmlUrl = await screen.getHtml();

const raw = await client.callTool("get_screen", {
  projectId: PROJECT_ID,
  screenId: SCREEN_ID,
  name: `projects/${PROJECT_ID}/screens/${SCREEN_ID}`,
});

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(
  path.join(OUT_DIR, "get_screen.raw.json"),
  JSON.stringify(raw, null, 2),
  "utf8",
);

const curlBin = os.platform() === "win32" ? "curl.exe" : "curl";

function curlDownload(url, destFile) {
  if (!url) {
    console.warn("Skipping empty URL for", destFile);
    return;
  }
  const base = ["-L", "-S", "--fail", "-o", destFile];
  try {
    execFileSync(curlBin, [...base, url], {
      stdio: ["ignore", "inherit", "inherit"],
      env: { ...process.env },
    });
  } catch {
    execFileSync(curlBin, [
      ...base,
      "-H",
      `X-Goog-Api-Key: ${apiKey}`,
      url,
    ], { stdio: ["ignore", "inherit", "inherit"] });
  }
}

const screenshotPath = path.join(OUT_DIR, "screenshot.png");
const htmlPath = path.join(OUT_DIR, "screen.html");

curlDownload(imageUrl, screenshotPath);
curlDownload(htmlUrl, htmlPath);

fs.writeFileSync(
  path.join(OUT_DIR, "urls.json"),
  JSON.stringify(
    {
      projectId: PROJECT_ID,
      screenId: SCREEN_ID,
      screenshotDownloadUrl: imageUrl,
      htmlCodeDownloadUrl: htmlUrl,
    },
    null,
    2,
  ),
  "utf8",
);

console.log("Wrote:", OUT_DIR);
console.log("  screenshot:", imageUrl ? screenshotPath : "(none)");
console.log("  html:", htmlUrl ? htmlPath : "(none)");
