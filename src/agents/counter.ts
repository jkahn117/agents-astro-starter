import { Agent, callable } from "agents";
import { injectAgentContext } from "@workers-powertools/agents";
import { logger } from "@/lib/logger";
import { configureMetricsForEnv, MetricUnit, metrics } from "@/lib/metrics";
import { tracer } from "@/lib/tracer";

export type CounterState = {
  count: number;
};

const agentLogger = logger.withComponent("CounterAgent");

export class CounterAgent extends Agent<Env, CounterState> {
  initialState: CounterState = { count: 0 };

  @callable()
  async increment(correlationId?: string) {
    const metricsEnabled = configureMetricsForEnv(
      this.env as unknown as Record<string, unknown>,
    );

    using agentContext = injectAgentContext({
      logger: agentLogger,
      tracer,
      operation: "increment",
      correlationId,
    });

    if (agentContext.correlationId) {
      metrics.setCorrelationId(agentContext.correlationId);
    }

    try {
      return await tracer.captureAsync("CounterAgent.increment", async (span) => {
        const nextCount = this.state.count + 1;

        span.annotations["agent.name"] = "CounterAgent";
        span.annotations["agent.operation"] = "increment";

        agentLogger.info("Incrementing counter", {
          previousCount: this.state.count,
          nextCount,
        });

        this.setState({ count: nextCount });

        if (metricsEnabled) {
          metrics.addMetric("counterIncremented", MetricUnit.Count, 1, {
            agent: "CounterAgent",
            operation: "increment",
          });
        }

        return nextCount;
      });
    } finally {
      if (metricsEnabled) {
        this.ctx.waitUntil(metrics.flush());
      }
    }
  }

  @callable()
  async decrement(correlationId?: string) {
    const metricsEnabled = configureMetricsForEnv(
      this.env as unknown as Record<string, unknown>,
    );

    using agentContext = injectAgentContext({
      logger: agentLogger,
      tracer,
      operation: "decrement",
      correlationId,
    });

    if (agentContext.correlationId) {
      metrics.setCorrelationId(agentContext.correlationId);
    }

    try {
      return await tracer.captureAsync("CounterAgent.decrement", async (span) => {
        const nextCount = this.state.count - 1;

        span.annotations["agent.name"] = "CounterAgent";
        span.annotations["agent.operation"] = "decrement";

        agentLogger.info("Decrementing counter", {
          previousCount: this.state.count,
          nextCount,
        });

        this.setState({ count: nextCount });

        if (metricsEnabled) {
          metrics.addMetric("counterDecremented", MetricUnit.Count, 1, {
            agent: "CounterAgent",
            operation: "decrement",
          });
        }

        return nextCount;
      });
    } finally {
      if (metricsEnabled) {
        this.ctx.waitUntil(metrics.flush());
      }
    }
  }
}
