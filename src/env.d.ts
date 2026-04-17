/// <reference types="astro/client" />

import type { Runtime } from "@astrojs/cloudflare";
import type { AstroObservabilityLocals } from "@workers-powertools/astro";

declare global {
  namespace App {
    interface Locals extends Runtime, AstroObservabilityLocals {}
  }
}
