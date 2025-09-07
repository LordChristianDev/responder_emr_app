export type PatientFilterProp = {
	search?: string;
	sexFilter?: 'All' | 'Male' | 'Female' | 'Others';
	sortDirection?: 'asc' | 'desc';
}

export type PatientProp = {
	id: number;
	created_at: string;
	patient_number: string;
	first_name: string;
	middle_name: string | null;
	last_name: string;
	suffix: string | null;
	age: number | null;
	sex: string;
	contact_info: string;
	medical_history: string | null;
	responder_id: number;
}