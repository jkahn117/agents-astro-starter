export {
  Metrics,
  MetricUnit,
  PipelinesBackend,
} from "@workers-powertools/metrics";
export type {
  MetricContext,
  MetricEntry,
  PipelineBinding,
} from "@workers-powertools/metrics";

import { Metrics, PipelinesBackend } from "@workers-powertools/metrics";
import type { MetricsBackend, PipelineBinding } from "@workers-powertools/metrics";

export const metrics = new Metrics({
  namespace: "astro_agents_starter",
  serviceName: "astro-agents-starter",
});

export function configureMetricsForEnv(env: Record<string, unknown>): boolean {
  const metricsBackend = getMetricsBackendFromEnv(env);

  if (!metricsBackend) {
    return false;
  }

  metrics.setBackend(metricsBackend);
  return true;
}

export function getMetricsBackendFromEnv(
  env: Record<string, unknown>,
): MetricsBackend | undefined {
  const metricsPipelineCandidate = env["METRICS_PIPELINE"];

  if (
    !metricsPipelineCandidate
    || typeof metricsPipelineCandidate !== "object"
    || !("send" in metricsPipelineCandidate)
    || typeof metricsPipelineCandidate.send !== "function"
  ) {
    return undefined;
  }

  return new PipelinesBackend({
    binding: metricsPipelineCandidate as PipelineBinding,
  });
}
