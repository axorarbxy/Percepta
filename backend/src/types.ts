import type { Env } from './lib/env.js';

export interface PerceptaJwtPayload {
  sub: string; // user UUID
  email: string;
  plan: 'free' | 'pro' | 'teams';
  iat?: number;
  exp: number;
}

export interface AppEnv {
  Bindings: Env;
  Variables: {
    env: Env;
    jwtPayload: PerceptaJwtPayload;
  };
}
