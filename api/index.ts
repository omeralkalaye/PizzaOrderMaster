import express from "express";
import { json } from "express";
import { registerRoutes } from "./routes";

const app = express();
app.use(json());

registerRoutes(app);

export default app;