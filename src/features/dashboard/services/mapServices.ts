import { supabase } from "@/lib/supabase";
import type { CaseProp } from "@/features/dashboard/types/casesTypes";
import type { MapCasesFilterProp } from "@/features/dashboard/types/mapTypes";

export const fetchMapCases = async (options?: MapCasesFilterProp) => {
	let filteredCases: CaseProp[] = await fetchCases();

	if (options?.statusFilter && options?.statusFilter !== "All") {
		filteredCases = filteredCases.filter((item) => {
			return item.status === options.statusFilter;
		});
	}

	if (options?.severityFilter && options?.severityFilter !== "All") {
		filteredCases = filteredCases.filter((item) => {
			return item.injuries.filter(injury => injury.severity === options.severityFilter);

		});
	}

	if (options?.search) {
		filteredCases = filteredCases.filter((item) => {
			const sort = options.search!.toLowerCase();
			return item.case_number.toLowerCase().includes(sort) ||
				item.patient_number.toLowerCase().includes(sort) ||
				item.cause.toLowerCase().includes(sort);
		});
	}

	return filteredCases;
}

const fetchCases = async (): Promise<CaseProp[]> => {
	const { data: cases, error: casesError } = await supabase
		.from("cases")
		.select("*")
		.order("created_at", { ascending: false });

	if (casesError) throw new Error(casesError.message);
	if (!cases || cases.length === 0) return [];

	const casesWithDetails = await Promise.all(
		cases.map(async (c) => {
			const { data: patientData, error: patientError } = await supabase
				.from("patients")
				.select("*")
				.eq("patient_number", c.patient_number)
				.maybeSingle();

			if (patientError) throw new Error(patientError.message);

			// Fetch injuries
			const { data: injuriesData, error: injuriesError } = await supabase
				.from("injuries")
				.select("*")
				.eq("case_number", c.case_number)
				.eq("patient_number", c.patient_number);

			if (injuriesError) throw new Error(injuriesError.message);

			return {
				...c,
				patient: patientData ?? null,
				injuries: injuriesData ?? [],
			};
		})
	);

	return casesWithDetails;
};