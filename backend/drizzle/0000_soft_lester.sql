CREATE TYPE "public"."context_profile" AS ENUM('everyday', 'responder', 'focus');--> statement-breakpoint
CREATE TYPE "public"."cue_channel" AS ENUM('audio', 'haptic', 'text', 'voice');--> statement-breakpoint
CREATE TYPE "public"."cue_type" AS ENUM('obstacle', 'person', 'sound', 'text', 'navigation', 'custom');--> statement-breakpoint
CREATE TYPE "public"."device_channel" AS ENUM('audio', 'haptic', 'text');--> statement-breakpoint
CREATE TYPE "public"."device_type" AS ENUM('earbuds', 'smartwatch', 'phone');--> statement-breakpoint
CREATE TYPE "public"."plan" AS ENUM('free', 'pro', 'teams');--> statement-breakpoint
CREATE TYPE "public"."severity" AS ENUM('info', 'warning', 'critical');--> statement-breakpoint
CREATE TABLE "context_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"audio_weight" real NOT NULL,
	"haptic_weight" real NOT NULL,
	"text_weight" real NOT NULL,
	"sensitivity" integer NOT NULL,
	"description" text,
	CONSTRAINT "context_profiles_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "cues" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"cue_type" "cue_type" NOT NULL,
	"channel" "cue_channel" NOT NULL,
	"severity" "severity" NOT NULL,
	"title" text NOT NULL,
	"body" text,
	"scene_context" jsonb,
	"user_responded" boolean DEFAULT false NOT NULL,
	"response_latency_ms" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "devices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"device_name" text NOT NULL,
	"device_type" "device_type" NOT NULL,
	"channel_assigned" "device_channel" NOT NULL,
	"last_seen_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"policy_audio_weight" real DEFAULT 0.33 NOT NULL,
	"policy_haptic_weight" real DEFAULT 0.33 NOT NULL,
	"policy_text_weight" real DEFAULT 0.34 NOT NULL,
	"alert_sensitivity" integer DEFAULT 50 NOT NULL,
	"quiet_hours_start" text,
	"quiet_hours_end" text,
	"active_context_profile" "context_profile" DEFAULT 'everyday' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "profiles_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"display_name" text,
	"plan" "plan" DEFAULT 'free' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "cues" ADD CONSTRAINT "cues_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "devices" ADD CONSTRAINT "devices_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "cues_user_id_created_at_idx" ON "cues" USING btree ("user_id","created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "devices_user_id_idx" ON "devices" USING btree ("user_id");