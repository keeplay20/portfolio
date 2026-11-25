"use strict";

const fs = require("fs");
const path = require("path");
const http = require("http");

const ROOT = path.join(__dirname, "..");
const PUBLIC = path.join(ROOT, "public");
const TEMPLATE = path.join(__dirname, "og-preview.html");
const OUT = path.join(PUBLIC, "preview.png");
const HOST = "127.0.0.1";
const PORT = 4183;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
};

function staticServer() {
  return http.createServer((req, res) => {
    const urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
    const rel =
      urlPath === "/" || urlPath === "/og-preview.html"
        ? "og-preview.html"
        : urlPath.replace(/^\//, "");
    let filePath = path.join(PUBLIC, rel);

    if (rel === "og-preview.html") {
      filePath = TEMPLATE;
    }

    if (!fs.existsSync(filePath)) {
      res.statusCode = 404;
      res.end("Not found");
      return;
    }

    const ext = path.extname(filePath);
    res.setHeader("Content-Type", MIME[ext] || "application/octet-stream");
    fs.createReadStream(filePath).pipe(res);
  });
}

function useBundledChromium() {
  return (
    process.env.VERCEL === "1" ||
    process.env.CI === "1" ||
    process.env.CI === "true"
  );
}

async function resolveExecutablePath(Chromium) {
  if (process.env.PUPPETEER_EXECUTABLE_PATH) {
    return process.env.PUPPETEER_EXECUTABLE_PATH;
  }

  if (useBundledChromium()) {
    return Chromium.executablePath();
  }

  const candidates = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  throw new Error(
    "No Chrome/Chromium found for OG preview. Set PUPPETEER_EXECUTABLE_PATH."
  );
}

async function main() {
  if (process.env.SKIP_OG_PREVIEW === "1") {
    console.log("[og-preview] skipped (SKIP_OG_PREVIEW=1)");
    return;
  }

  const puppeteer = require("puppeteer-core");
  const Chromium = (await import("@sparticuz/chromium")).default;
  const server = staticServer();

  await new Promise((resolve, reject) => {
    server.listen(PORT, HOST, () => resolve());
    server.on("error", reject);
  });

  let browser;
  try {
    const onServerless = useBundledChromium();
    browser = await puppeteer.launch({
      executablePath: await resolveExecutablePath(Chromium),
      headless: true,
      args: onServerless
        ? Chromium.args
        : ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 2 });
    await page.goto(`http://${HOST}:${PORT}/og-preview.html`, {
      waitUntil: "networkidle0",
      timeout: 60_000,
    });

    await page.screenshot({
      path: OUT,
      type: "png",
      clip: { x: 0, y: 0, width: 1200, height: 630 },
    });

    console.log(`[og-preview] wrote ${OUT}`);
  } finally {
    if (browser) await browser.close();
    await new Promise((resolve) => server.close(() => resolve()));
  }
}

main().catch((err) => {
  console.error("[og-preview] failed:", err);
  process.exit(1);
});