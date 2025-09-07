import { z } from "zod";
import type { PatientProp } from "@/features/dashboard/types/patientTypes";
import type { CertificationProp, OrganizationProp, ResponderRoleProp } from "@/features/personalization/types/profileTypes";

export const InjuryFormSchema = z.object({
	id: z.string().min(1, "Identifier is required"),
	x: z.number().min(1, "X index is required"),
	y: z.number().min(1, "Y index is required"),
	type: z.string().min(1, "Injury Type is required"),
	side: z.string().min(1, "Side is required"),
	location: z.string().min(1, "Location is required"),
	severity: z.string().min(1, "Severity is required"),

	description: z.string().optional(),
});

export type InjuryFormProp = z.infer<typeof InjuryFormSchema>;

export const addCaseFormSchema = z.object({
	// Required fields
	first_name: z.string().min(1, "First name is required"),
	last_name: z.string().min(1, "Last name is required"),
	sex: z.string().min(1, "Sex is required"),
	date_time: z.string().min(1, "Date is required"),
	location: z.string().min(1, "Location is required"),
	cause: z.string().min(1, "Cause is required"),

	// Optional fields (can be empty strings)
	age: z.number().optional(),
	description: z.string().optional(),
	middle_name: z.string().optional(),
	suffix: z.string().optional(),
	contact_info: z.string().optional(),
	medical_history: z.string().optional(),

	// Boolean and arrays
	with_medical_history: z.boolean().optional(),
	injuries: z.array(InjuryFormSchema).min(1, "Need to specify injury"),
	interventions: z.array(z.string()).min(1, "Need to specify intervention"),
});

export type AddCaseFormFieldProp = z.infer<typeof addCaseFormSchema>;

export type CaseLists = {
	interventions: InterventionItemProp[];
	injuries: InjuryItemProp[];
	severities: string[];
	sides: string[];
}

export type InterventionItemProp = {
	id: number;
	created_at: string;
	value: string;
	title: string;
}

export type InjuryItemProp = {
	id: number;
	created_at: string;
	name: string;
	description: string;
}

export type interventionProp = {
	id: string;
	label: string;
}

export type CaseProp = {
	id: number;
	created_at: string;
	case_number: string;
	patient_number: string;
	date_recorded: string;
	time_recorded: string;
	cause: string;
	description: string | null;
	interventions: string[];
	status: string;
	status_description: string;
	responder_id: number;
	latitude: number;
	longitude: number;
	location: string;
	patient: PatientProp;
	injuries: InjuryProp[]
}

export type InjuryProp = {
	id: number;
	created_at: string;
	case_number: string;
	patient_number: string;
	location: string;
	type: string;
	severity: string;
	description: string | null;
}

export type ViewCasesFilterProp = {
	search?: string;
	statusFilter?: 'All' | 'Active' | 'Critical' | 'Stable' | 'Transferred' | 'Closed';
	severityFilter?: 'All' | 'Mild' | 'Moderate' | 'Severe' | 'Critical';
	sortDirection?: 'asc' | 'desc'
}

export type CaseDetailsProp = {
	id: number;
	created_at: string;
	case_number: string;
	patient_number: string;
	date_recorded: string;
	time_recorded: string;
	cause: string;
	description: string | null;
	interventions: string[];
	status: string;
	status_description: string;
	responder_id: number;
	latitude: number;
	longitude: number;
	location: string;

	patient: PatientProp;
	injuries: InjuryProp[];
	responder: ResponderProp;
}

export type ResponderProp = {
	id: number;
	created_at: string;
	updated_at: string | null;
	first_name: string;
	middle_name: string | null;
	last_name: string;
	suffix: string | null;
	avatar_url: string | null;
	cover_url: string | null;
	email: string | null;
	phone: string | null;
	birth_date: string | null;
	address: string | null;
	sex: string | null;
	responder_number: string | null;

	responder_role_id: number | null;
	user_id: number;
	organization_id: number | null;

	organization: OrganizationProp | null;
	responder: ResponderRoleProp | null;
	certifications: CertificationProp[] | null;
}






























