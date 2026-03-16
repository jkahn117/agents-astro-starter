import { Hono } from "hono";
import { agentsMiddleware } from "hono-agents";
export { DoorManAgent } from "../agents/door-man";

const app = new Hono<{ Bindings: Env }>();

// Add agents middleware - handles WebSocket upgrades and agent HTTP requests
app.use("*", agentsMiddleware());

// Your existing routes continue to work
app.get("/api/hello", (c) => c.json({ message: "Hello!" }));

export default app;
