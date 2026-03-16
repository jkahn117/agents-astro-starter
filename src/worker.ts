import { Hono } from "hono";
import { agentsMiddleware } from "hono-agents";
import { handle } from "@astrojs/cloudflare/handler";

export { CounterAgent } from "./agents/counter";

const app = new Hono<{ Bindings: Env }>();

// Add agents middleware - handles WebSocket upgrades and agent HTTP requests
app.use("*", agentsMiddleware());

// Your existing routes continue to work
app.get("/api/hello", (c) => c.json({ message: "Hello!" }));

app.all("*", async (c) => {
  return handle(
    c.req.raw,
    c.env,
    c.executionCtx as Parameters<typeof handle>[2],
  );
});

export default app;
