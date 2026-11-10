import { relations } from 'drizzle-orm';
import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  real,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

export const planEnum = pgEnum('plan', ['free', 'pro', 'teams']);

export const contextProfileEnum = pgEnum('context_profile', [
  'everyday',
  'responder',
  'focus',
]);

export const cueTypeEnum = pgEnum('cue_type', [
  'obstacle',
  'person',
  'sound',
  'text',
  'navigation',
  'custom',
]);

export const cueChannelEnum = pgEnum('cue_channel', [
  'audio',
  'haptic',
  'text',
  'voice',
]);

export const severityEnum = pgEnum('severity', [
  'info',
  'warning',
  'critical',
]);

export const deviceTypeEnum = pgEnum('device_type', [
  'earbuds',
  'smartwatch',
  'phone',
]);

export const deviceChannelEnum = pgEnum('device_channel', [
  'audio',
  'haptic',
  'text',
]);

// ---------------------------------------------------------------------------
// Tables
// ---------------------------------------------------------------------------

/**
 * 1. users
 * Core user accounts and subscription plans.
 */
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  displayName: text('display_name'),
  plan: planEnum('plan').default('free').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

/**
 * 2. profiles (1:1 with users)
 * Sensory weights, sensitivity settings, quiet hours, and active context preset.
 */
export const profiles = pgTable('profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: 'cascade' }),
  policyAudioWeight: real('policy_audio_weight').default(0.33).notNull(),
  policyHapticWeight: real('policy_haptic_weight').default(0.33).notNull(),
  policyTextWeight: real('policy_text_weight').default(0.34).notNull(),
  alertSensitivity: integer('alert_sensitivity').default(50).notNull(),
  quietHoursStart: text('quiet_hours_start'), // format: HH:MM
  quietHoursEnd: text('quiet_hours_end'),     // format: HH:MM
  activeContextProfile: contextProfileEnum('active_context_profile')
    .default('everyday')
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

/**
 * 3. cues (awareness history — core sensory data)
 * Real-time sensory augmentation events dispatched to user hardware.
 */
export const cues = pgTable(
  'cues',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    cueType: cueTypeEnum('cue_type').notNull(),
    channel: cueChannelEnum('channel').notNull(),
    severity: severityEnum('severity').notNull(),
    title: text('title').notNull(),
    body: text('body'),
    sceneContext: jsonb('scene_context'), // Raw vision/audio model output for debugging
    userResponded: boolean('user_responded').default(false).notNull(),
    responseLatencyMs: integer('response_latency_ms'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('cues_user_id_created_at_idx').on(table.userId, table.createdAt.desc()),
  ]
);

/**
 * 4. devices
 * User registered hardware peripherals (earbuds, smartwatch, phone).
 */
export const devices = pgTable(
  'devices',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    deviceName: text('device_name').notNull(),
    deviceType: deviceTypeEnum('device_type').notNull(),
    channelAssigned: deviceChannelEnum('channel_assigned').notNull(),
    lastSeenAt: timestamp('last_seen_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('devices_user_id_idx').on(table.userId),
  ]
);

/**
 * 5. context_profiles (presets)
 * System sensory templates ('everyday', 'responder', 'focus').
 */
export const contextProfiles = pgTable('context_profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull().unique(), // 'everyday', 'responder', 'focus'
  audioWeight: real('audio_weight').notNull(),
  hapticWeight: real('haptic_weight').notNull(),
  textWeight: real('text_weight').notNull(),
  sensitivity: integer('sensitivity').notNull(),
  description: text('description'),
});

// ---------------------------------------------------------------------------
// Relations
// ---------------------------------------------------------------------------

export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(profiles, {
    fields: [users.id],
    references: [profiles.userId],
  }),
  cues: many(cues),
  devices: many(devices),
}));

export const profilesRelations = relations(profiles, ({ one }) => ({
  user: one(users, {
    fields: [profiles.userId],
    references: [users.id],
  }),
}));

export const cuesRelations = relations(cues, ({ one }) => ({
  user: one(users, {
    fields: [cues.userId],
    references: [users.id],
  }),
}));

export const devicesRelations = relations(devices, ({ one }) => ({
  user: one(users, {
    fields: [devices.userId],
    references: [users.id],
  }),
}));

// ---------------------------------------------------------------------------
// Inferred TypeScript Types
// ---------------------------------------------------------------------------

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;

export type Cue = typeof cues.$inferSelect;
export type NewCue = typeof cues.$inferInsert;

export type Device = typeof devices.$inferSelect;
export type NewDevice = typeof devices.$inferInsert;

export type ContextProfile = typeof contextProfiles.$inferSelect;
export type NewContextProfile = typeof contextProfiles.$inferInsert;
