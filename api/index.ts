import express from "express";
import { registerRoutes } from "../server/routes";
import { createServer } from "http";

const app = express();
const httpServer = createServer(app);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false, limit: "50mb" }));

let isInitialized = false;

async function initialize() {
  if (!isInitialized) {
    await registerRoutes(httpServer, app);
    isInitialized = true;
  }
}

export default async function handler(req: any, res: any) {
  await initialize();
  app(req, res);
}