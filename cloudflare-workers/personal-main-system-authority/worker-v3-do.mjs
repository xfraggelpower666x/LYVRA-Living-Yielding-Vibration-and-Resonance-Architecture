/**
 * Cloudflare Durable Object adapter for the native v3 replay implementation.
 * This class can be registered through an independently reviewed SQLite export.
 * No Wrangler binding, migration or secret is provisioned by this file.
 */
import { DurableObject } from "cloudflare:workers";
import { NativeV3NonceGate as ReplayCore } from "./worker-v3-route.mjs";

export class NativeV3NonceGate extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    this.replayCore = new ReplayCore(ctx);
  }
  async fetch(request) {
    return this.replayCore.fetch(request);
  }
  async alarm() {
    return this.replayCore.alarm();
  }
}
