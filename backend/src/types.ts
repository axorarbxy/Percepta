import type { Env } from './lib/env.js';

export interface AppEnv {
  Bindings: Env;
  Variables: {
    env: Env;
  };
}
