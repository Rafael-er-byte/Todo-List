CREATE TABLE "Account" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"provider" text NOT NULL,
	"username" text NOT NULL,
	"urlImageProfile" text,
	"sub" text NOT NULL,
	"isPrimary" boolean DEFAULT false,
	"ownerId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "User" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "UserSettings" (
	"id" uuid PRIMARY KEY NOT NULL,
	"theme" text NOT NULL,
	"lang" text NOT NULL,
	"timezone" text NOT NULL,
	"notificationSettings" jsonb,
	"userId" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "Account" ADD CONSTRAINT "Account_ownerId_User_id_fk" FOREIGN KEY ("ownerId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "UserSettings" ADD CONSTRAINT "UserSettings_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;