import { createDbClient } from './client.js';
import { contextProfiles } from './schema.js';
import { validateEnv } from '../lib/env.js';

if (typeof process !== 'undefined' && typeof process.loadEnvFile === 'function') {
  try {
    process.loadEnvFile('.dev.vars');
  } catch {
    try {
      process.loadEnvFile('.env');
    } catch {}
  }
}

const env = validateEnv(process.env);
const db = createDbClient(env.DATABASE_URL);

/**
 * Seeds the 3 default context profile presets: 'everyday', 'responder', 'focus'.
 * Uses ON CONFLICT to ensure idempotent execution.
 */
export async function seedContextProfiles() {
  console.log('🌱 Seeding Percepta context profiles...');

  const presets = [
    {
      name: 'everyday',
      audioWeight: 0.33,
      hapticWeight: 0.33,
      textWeight: 0.34,
      sensitivity: 50,
      description:
        'Balanced sensory awareness for daily routines and ambient navigation.',
    },
    {
      name: 'responder',
      audioWeight: 0.5,
      hapticWeight: 0.35,
      textWeight: 0.15,
      sensitivity: 80,
      description:
        'High-priority acoustic & haptic alerts designed for emergency response and active mobility.',
    },
    {
      name: 'focus',
      audioWeight: 0.1,
      hapticWeight: 0.7,
      textWeight: 0.2,
      sensitivity: 30,
      description:
        'Subtle haptic-first cues minimizing auditory distractions during deep work or study.',
    },
  ];

  for (const preset of presets) {
    await db
      .insert(contextProfiles)
      .values(preset)
      .onConflictDoUpdate({
        target: contextProfiles.name,
        set: {
          audioWeight: preset.audioWeight,
          hapticWeight: preset.hapticWeight,
          textWeight: preset.textWeight,
          sensitivity: preset.sensitivity,
          description: preset.description,
        },
      });

    console.log(`  ✓ Seeded preset: "${preset.name}"`);
  }

  console.log('✅ Context profiles seeded successfully.');
}

// Execute if run directly
seedContextProfiles().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
