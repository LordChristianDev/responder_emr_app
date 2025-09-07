export type ProfileProp = {
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

export type OrganizationProp = {
	id: number;
	name: string;
	description: string;
	created_at: string;
}

export type ResponderRoleProp = {
	id: number;
	title: string;
	description: string;
	level: string;
	shift_type: string;
	created_at: string;
}

export type CertificationProp = {
	id: number;
	name: string;
	description: string;
	organization: string;
	expiry_duration: number;
	created_at: string;
}

export type ProfileAvatarProp = {
	id: string;
	file: File;
	url: string;
	type: string;
}