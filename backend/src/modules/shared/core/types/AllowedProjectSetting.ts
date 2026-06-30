import { AllowedMemberRoles } from "../../../shared/core/types/AllowedMemberRoles";

export const ALLOWED_PROJECT_SETTING = [AllowedMemberRoles.admin, AllowedMemberRoles.member] as const;

export type AllowedProjectSetting = typeof ALLOWED_PROJECT_SETTING[number];
