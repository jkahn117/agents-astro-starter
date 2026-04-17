import { sequence } from "astro:middleware";
import { injectObservability } from "@workers-powertools/astro/observability";
import { injectLogger } from "@workers-powertools/astro/logger";
import { injectTracer } from "@workers-powertools/astro/tracer";
import { env } from "cloudflare:workers";
import { logger } from "@/lib/logger";
import { getMetricsBackendFromEnv, metrics } from "@/lib/metrics";
import { tracer } from "@/lib/tracer";

const runtimeEnv = env as unknown as Record<string, unknown>;
const metricsBackend = getMetricsBackendFromEnv(runtimeEnv);

export const onRequest = metricsBackend
  ? injectObservability({
      logger,
      tracer,
      metrics,
      runtimeEnv,
      componentName: "astro",
    })
  : sequence(
      injectLogger({
        logger,
        runtimeEnv,
        componentName: "astro",
      }),
      injectTracer({
        tracer,
        runtimeEnv,
      }),
    );
