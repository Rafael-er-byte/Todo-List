ALTER TABLE "Account" DROP CONSTRAINT "Account_ownerId_User_id_fk";
--> statement-breakpoint
ALTER TABLE "UserSettings" DROP CONSTRAINT "UserSettings_userId_User_id_fk";
--> statement-breakpoint
ALTER TABLE "Account" ADD CONSTRAINT "Account_ownerId_User_id_fk" FOREIGN KEY ("ownerId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "UserSettings" ADD CONSTRAINT "UserSettings_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;