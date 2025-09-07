import { z } from "zod";
import type { CertificationProp, OrganizationProp, ResponderRoleProp } from "@/features/personalization/types/profileTypes";

export const updateProfileFormSchema = z.object({
	// Required Fields
	first_name: z.string().min(1, "First name is required"),
	last_name: z.string().min(1, "Last name is required"),
	birth_date: z.string().min(1, "Birth date is required"),
	address: z.string().min(1, "Address is required"),
	email: z.string().min(1, "Email address is required"),
	phone: z.string().min(1, "Phone number is required"),
	sex: z.string().min(1, "Gender is required"),

	// Optional fields
	middle_name: z.string().optional(),
	suffix: z.string().optional(),
});

export type UpdateProfileFormFieldProp = z.infer<typeof updateProfileFormSchema>;

export const updateCredentialFormSchema = z.object({
	// Required Fields
	responderNumber: z.string().min(1, "Responder # is required"),
	organization: z.number().min(1, "Organization is required"),
	responderRole: z.number().min(1, "Responder Role is required"),

	// Arrays
	certifications: z.array(z.number()).min(1, "Must have at least 1 certificate"),
});

export type UpdateCredentialFormFieldProp = z.infer<typeof updateCredentialFormSchema>;

export type UpdateProfileLists = {
	organizationList: OrganizationProp[];
	responderList: ResponderRoleProp[];
	certificationList: CertificationProp[];
}

export type SettingsNotificationsProp = {
	emergency: boolean;
	caseUpdates: boolean;
	systemAlerts: boolean;
	emailDigest: boolean;
}

export type SettingsProp = {
	theme: string;
	notifications: SettingsNotificationsProp;
	language: string;
	autoSave: boolean;
	offlineMode: boolean;
}

export type SettingsConfigProp = {
	notifications?: SettingsNotificationsProp;
	language?: string;
	autoSave?: boolean;
	offlineMode?: boolean;
}
