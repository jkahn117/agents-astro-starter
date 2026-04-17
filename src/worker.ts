import { Hono } from "hono";
import { agentsMiddleware } from "hono-agents";
import { handle } from "@astrojs/cloudflare/handler";
import { injectLogger } from "@workers-powertools/hono/logger";
import { injectMetrics } from "@workers-powertools/hono/metrics";
import { injectTracer } from "@workers-powertools/hono/tracer";
import { logger } from "@/lib/logger";
import { getMetricsBackendFromEnv, MetricUnit, metrics } from "@/lib/metrics";
import { tracer } from "@/lib/tracer";

export { CounterAgent } from "./agents/counter";

const app = new Hono<{ Bindings: Env }>();
const apiLogger = logger.withComponent("api");

// Add agents middleware - handles WebSocket upgrades and agent HTTP requests
app.use("*", agentsMiddleware());
app.use("/api/*", injectLogger(logger));
app.use("/api/*", injectTracer(tracer));
app.use("/api/*", async (c, next) => {
  const metricsBackend = getMetricsBackendFromEnv(
    c.env as unknown as Record<string, unknown>,
  );

  if (!metricsBackend) {
    return next();
  }

  return injectMetrics(metrics, {
    backendFactory: () => metricsBackend,
  })(c, next);
});

// Your existing routes continue to work
app.get("/api/hello", (c) => {
  const metricsEnabled = Boolean(
    getMetricsBackendFromEnv(c.env as unknown as Record<string, unknown>),
  );

  apiLogger.info("Handled hello route");

  if (metricsEnabled) {
    metrics.addMetric("helloApiRequested", MetricUnit.Count, 1, {
      route: "/api/hello",
      method: c.req.method,
    });
  }

  return c.json({ message: "Hello from Astro on Cloudflare Workers!" });
});

app.all("*", async (c) => {
  return handle(
    c.req.raw,
    c.env,
    c.executionCtx as Parameters<typeof handle>[2],
  );
});

export default app;
