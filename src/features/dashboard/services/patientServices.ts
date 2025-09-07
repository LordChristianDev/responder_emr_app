import { supabase } from "@/lib/supabase";
import type { PatientFilterProp, PatientProp } from "@/features/dashboard/types/patientTypes";

export const itemsPerPage = 5;

export const fetchFilteredPatients = async (options?: PatientFilterProp): Promise<PatientProp[]> => {
	let filteredPatients: PatientProp[] = await fetchPatients();

	if (options?.sexFilter && options?.sexFilter !== "All") {
		filteredPatients = filteredPatients.filter((item) => {
			return item.sex === options.sexFilter;
		});
	}

	if (options?.search) {
		filteredPatients = filteredPatients.filter((item) => {
			const sort = options.search!.toLowerCase();
			return item.patient_number.toLowerCase().includes(sort) ||
				item.first_name.toLowerCase().includes(sort) ||
				item.last_name.toLowerCase().includes(sort) ||
				(item?.medical_history && item.medical_history.toLowerCase().includes(sort));
		});
	}

	if (options?.sortDirection) {
		const { sortDirection } = options;

		filteredPatients = [...filteredPatients].sort((a, b) => {
			const aDate = new Date(a.id).getTime();
			const bDate = new Date(b.id).getTime();

			if (aDate < bDate) return sortDirection === "asc" ? -1 : 1;
			if (aDate > bDate) return sortDirection === "asc" ? 1 : -1;
			return 0;
		});
	}

	return filteredPatients;
}

const fetchPatients = async () => {
	let setPatients = [];

	const { data: patientData, error: patientError } = await supabase
		.from("patients")
		.select("*")
		.order("created_at", { ascending: false });

	if (patientError) throw new Error(patientError.message);
	if (patientData) setPatients = patientData;

	return setPatients;
}

export const fetchPatientDetails = async (patientNumber: string): Promise<PatientProp | null> => {
	let setPatient = null;

	const { data: patient, error: patientError } = await supabase
		.from("patients")
		.select("*")
		.eq('patient_number', patientNumber)
		.single();

	if (patientError) throw new Error(patientError.message);
	if (patient) setPatient = patient;

	return setPatient;
}

