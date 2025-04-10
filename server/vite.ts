import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

const getClientPath = (url: string) =>
  url.startsWith("/admin")
    ? path.resolve(__dirname, "../admin")
    : path.resolve(__dirname, "../client");

export async function setupVite(app: Express, server: Server) {
  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: {
      middlewareMode: true,
      hmr: { server },
      allowedHosts: true,
    },
    appType: "custom",
  });

  app.use(vite.middlewares);

  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    const clientPath = getClientPath(url);
    const indexHtmlPath = path.join(clientPath, "index.html");

    try {
      if (!fs.existsSync(indexHtmlPath)) {
        return res.status(404).send("index.html not found");
      }

      let template = await fs.promises.readFile(indexHtmlPath, "utf-8");

      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );

      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (error) {
      vite.ssrFixStacktrace(error as Error);
      next(error);
    }
  });
}

export function serveStatic(app: Express) {
  const getStaticPath = (url: string) =>
    url.startsWith("/admin")
      ? path.resolve(__dirname, "../admin/dist")
      : path.resolve(__dirname, "public");

  app.use("*", (req, res, next) => {
    const staticPath = getStaticPath(req.originalUrl);

    if (!fs.existsSync(staticPath)) {
      return res.status(404).send("Static folder not found");
    }

    express.static(staticPath)(req, res, next);
  });

  app.use("*", (req, res) => {
    const staticPath = getStaticPath(req.originalUrl);
    res.sendFile(path.join(staticPath, "index.html"));
  });
}
