import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import path from "path";
import { fileURLToPath } from "url"; // Import fileURLToPath

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get("/", (req, res) => {
  const filePath = path.join(clientDistPath, "index.html");
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error(`Error serving file: ${err.message}`);
      res.status(500).send("Internal Server Error");
    }
  });
});

app.use((req, res, next) => {
  if (req.path.endsWith("/")) {
    req.url = req.url.slice(0, -1); // Remove trailing slash
  }
  next();
});

// Serve static files for the admin project
const adminDistPath = path.resolve(__dirname, "../admin/dist");
app.use("/admin", express.static(adminDistPath));

// Catch-all route for admin to serve index.html
app.get("/admin/*", (req, res) => {
  res.sendFile(path.join(adminDistPath, "index.html"));
});

const clientDistPath = path.resolve(__dirname, "../client/dist");
app.use(express.static(clientDistPath));

// Catch-all route to serve index.html for client-side routing
app.get("/*", (req, res, next) => {
  let requestedPath = req.path;

  // If the request is for a static file, let express.static handle it
  if (
    requestedPath.endsWith(".js") ||
    requestedPath.endsWith(".css") ||
    requestedPath.endsWith(".map") ||
    requestedPath.endsWith(".png") ||
    requestedPath.endsWith(".jpg") ||
    requestedPath.endsWith(".svg")
  ) {
    console.log("Static file request, passing to express.static");
    return next();
  }

  // Serve the index.html file for all other routes
  const filePath = path.join(clientDistPath, "index.html");
  res.sendFile(filePath, (err) => {
    console.log("filepath", filePath);
    if (err) {
      console.error(`Error serving file: ${err.message}`);
      res.status(500).send("Internal Server Error");
    }
  });
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 3001;
  server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
})();
