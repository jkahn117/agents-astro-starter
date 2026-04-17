export { Tracer } from "@workers-powertools/tracer";
export type { TracerConfig } from "@workers-powertools/tracer";

import { Tracer } from "@workers-powertools/tracer";

export const tracer = new Tracer({
  serviceName: "astro-agents-starter",
});
