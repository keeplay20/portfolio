"use strict";

const http = require("http");
const fs = require("fs");
const path = require("path");

const BUILD_DIR = path.join(__dirname, "..", "build");
const HOST = "127.0.0.1";
const PORT = 4173;
/** App routes to prerender (add paths when you introduce URL-based routing). */
const ROUTES = ["/"];

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".txt": "text/plain; charset=utf-8",
  ".map": "application/json",
};

function createStaticServer() {
  return http.createServer((req, res) => {
    const urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
    const relative = urlPath === "/" ? "index.html" : urlPath.replace(/^\//, "");
    let filePath = path.join(BUILD_DIR, relative);

    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, "index.html");
    }

    if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
      filePath = path.join(BUILD_DIR, "index.html");
    }

    const ext = path.extname(filePath);
    res.setHeader("Content-Type", MIME[ext] || "application/octet-stream");
    fs.createReadStream(filePath).pipe(res);
  });
}

async function resolveExecutablePath() {
  if (process.env.PUPPETEER_EXECUTABLE_PATH) {
    return process.env.PUPPETEER_EXECUTABLE_PATH;
  }

  if (process.env.VERCEL === "1" || process.env.CI === "true") {
    const chromium = require("@sparticuz/chromium");
    return chromium.executablePath();
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
    "No Chrome/Chromium found. Set PUPPETEER_EXECUTABLE_PATH or SKIP_PRERENDER=1."
  );
}

function routeOutputPath(route) {
  if (route === "/") {
    return path.join(BUILD_DIR, "index.html");
  }
  const trimmed = route.replace(/^\//, "").replace(/\/$/, "");
  return path.join(BUILD_DIR, trimmed, "index.html");
}

async function main() {
  if (process.env.SKIP_PRERENDER === "1") {
    console.log("[prerender] skipped (SKIP_PRERENDER=1)");
    return;
  }

  if (!fs.existsSync(path.join(BUILD_DIR, "index.html"))) {
    throw new Error("[prerender] build/index.html not found — run react-scripts build first.");
  }

  const puppeteer = require("puppeteer-core");
  const chromium = require("@sparticuz/chromium");

  const server = createStaticServer();
  await new Promise((resolve, reject) => {
    server.listen(PORT, HOST, () => resolve());
    server.on("error", reject);
  });

  let browser;
  try {
    const onVercel = process.env.VERCEL === "1" || process.env.CI === "true";
    const executablePath = await resolveExecutablePath();

    browser = await puppeteer.launch({
      executablePath,
      headless: true,
      args: onVercel
        ? chromium.args
        : ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
      defaultViewport: onVercel ? chromium.defaultViewport : { width: 1280, height: 720 },
    });

    for (const route of ROUTES) {
      const page = await browser.newPage();
      const target = `http://${HOST}:${PORT}${route}`;

      await page.goto(target, {
        waitUntil: "networkidle0",
        timeout: 120_000,
      });
      await page.waitForSelector("#root > *", { timeout: 60_000 });
      await page.evaluate(
        () =>
          new Promise((resolve) => {
            requestAnimationFrame(() => requestAnimationFrame(resolve));
          })
      );

      const html = await page.content();
      const outFile = routeOutputPath(route);

      if (route !== "/") {
        fs.mkdirSync(path.dirname(outFile), { recursive: true });
      }

      fs.writeFileSync(outFile, html, "utf8");
      console.log(`[prerender] ${route} → ${path.relative(process.cwd(), outFile)}`);
      await page.close();
    }
  } finally {
    if (browser) {
      await browser.close();
    }
    await new Promise((resolve) => server.close(() => resolve()));
  }
}

main().catch((err) => {
  console.error("[prerender] failed:", err);
  process.exit(1);
});
