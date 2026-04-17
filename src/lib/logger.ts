export { Logger } from "@workers-powertools/logger";
export type { LoggerConfig } from "@workers-powertools/logger";

import { Logger } from "@workers-powertools/logger";

export const logger = new Logger({
  serviceName: "astro-agents-starter",
  logLevel: "INFO",
  logBufferingEnabled: true,
});
