import { supabase } from "@/lib/supabase";
import { getRandomCebuCoordinate } from "@/lib/utils";

import type { AddCaseFormFieldProp, CaseDetailsProp, CaseLists, CaseProp, InjuryProp, ViewCasesFilterProp } from "@/features/dashboard/types/casesTypes";
import { fetchPatientDetails } from "@/features/dashboard/services/patientServices";
import { fetchResponder } from "@/features/personalization/services/profileServices";

export const itemsPerPage = 5;

export const fetchFilteredCases = async (options?: ViewCasesFilterProp): Promise<CaseProp[]> => {
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

	if (options?.sortDirection) {
		const { sortDirection } = options;

		filteredCases = [...filteredCases].sort((a, b) => {
			const aDate = new Date(a.date_recorded).getTime();
			const bDate = new Date(b.date_recorded).getTime();

			if (aDate < bDate) return sortDirection === "asc" ? -1 : 1;
			if (aDate > bDate) return sortDirection === "asc" ? 1 : -1;
			return 0;
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

			const setPatient = await fetchPatientDetails(c.patient_number);

			const setInterventions = await fetchInterventions(c.interventions);

			const setInjuries = await fetchInjuries(c.case_number, c.patient_number);

			return {
				...c,
				patient: setPatient ?? null,
				interventions: setInterventions,
				injuries: setInjuries,
			};
		})
	);

	return casesWithDetails;
};

export const fetchRecentCases = async (): Promise<CaseProp[]> => {
	const { data: cases, error: casesError } = await supabase
		.from("cases")
		.select("*")
		.order("date_recorded", { ascending: false })
		.limit(3);

	if (casesError) throw new Error(casesError.message);
	if (!cases || cases.length === 0) return [];

	const casesWithDetails = await Promise.all(
		cases.map(async (c) => {
			const setPatient = await fetchPatientDetails(c.patient_number);
			const setInterventions = await fetchInterventions(c.interventions);
			const setInjuries = await fetchInjuries(c.case_number, c.patient_number);

			return {
				...c,
				patient: setPatient ?? null,
				interventions: setInterventions,
				injuries: setInjuries,
			};
		})
	);

	return casesWithDetails;
};

export const fetchCaseDetails = async (caseNumber: string): Promise<CaseDetailsProp | null> => {
	const { data: caseDetails, error: caseDetailsError } = await supabase
		.from("cases")
		.select("*")
		.eq('case_number', caseNumber)
		.single();

	if (caseDetailsError) throw new Error(caseDetailsError.message);
	if (!caseDetails) return null;

	let setCase: CaseDetailsProp = caseDetails;

	const patientData = await fetchPatientDetails(caseDetails.patient_number);
	if (patientData) setCase = { ...setCase, patient: patientData };

	console.log(setCase);

	const interventionsData = await fetchInterventions(caseDetails.interventions);
	if (interventionsData) setCase = { ...setCase, interventions: interventionsData };

	const injuriesData = await fetchInjuries(caseDetails.case_number, caseDetails.patient_number);
	if (injuriesData) setCase = { ...setCase, injuries: injuriesData };

	const responderData = await fetchResponder(caseDetails.responder_id);
	if (responderData) setCase = { ...setCase, responder: responderData };

	return setCase;
}

const fetchInterventions = async (ints: string[]): Promise<string[]> => {
	if (!ints || ints.length === 0) return [];

	let setInterventions = await Promise.all(
		ints.map(async (int: string) => {
			const { data: interventionData, error: interventionError } = await supabase
				.from("interventions")
				.select("*")
				.eq("value", int)
				.single();

			if (interventionError) throw new Error(interventionError.message);

			return interventionData.title;
		})
	);

	return setInterventions;
}

const fetchInjuries = async (caseNumber: string, patientNumber: string): Promise<InjuryProp[]> => {
	if (!caseNumber || !patientNumber) return [];

	const { data: injuriesData, error: injuriesError } = await supabase
		.from("injuries")
		.select("*")
		.eq("case_number", caseNumber)
		.eq("patient_number", patientNumber);

	if (injuriesError) throw new Error(injuriesError.message);

	return injuriesData;
}

export const fetchAddCaseLists = async (): Promise<CaseLists> => {
	let setCaseList: CaseLists = {
		interventions: [],
		injuries: [],
		sides: ['Front', 'Back'],
		severities: ['Mild', 'Moderate', 'Severe', 'Critical'],
	}

	const { data: interventions, error: interventionsError } = await supabase
		.from('interventions')
		.select('*')
		.order('created_at', { ascending: false });

	if (interventionsError) throw new Error(interventionsError.message);
	if (interventions) setCaseList = { ...setCaseList, interventions };

	const { data: injuries, error: injuriesError } = await supabase
		.from('injury_type')
		.select('*')
		.order('created_at', { ascending: false });

	if (injuriesError) throw new Error(injuriesError.message);
	if (injuries) setCaseList = { ...setCaseList, injuries };

	return setCaseList;
}

export const createNewCase = async (id: number, newCase: AddCaseFormFieldProp) => {
	if (!id) throw new Error('Unable to create case without identified');
	if (!newCase) throw new Error('Unable to craete new case without case details');

	let returnStatement = null;

	const caseIdentifier = `CASE-${Math.floor(10000 + Math.random() * 90000)}`;
	const patientIdentifier = `PAT-${Math.floor(10000 + Math.random() * 90000)}`;

	const [date, time] = newCase.date_time.split(" ");
	const { latitude, longitude } = getRandomCebuCoordinate();

	const { data: caseData, error: caseError } = await supabase
		.from('cases')
		.insert([{
			case_number: caseIdentifier,
			patient_number: patientIdentifier,
			date_recorded: date,
			time_recorded: time,
			cause: newCase.cause,
			description: newCase.description ?? null,
			interventions: newCase.interventions,
			status: "Active",
			responder_id: id,
			latitude,
			longitude,
			location: newCase.location
		}])
		.select()
		.maybeSingle()

	if (caseError) throw new Error(caseError.message);
	if (caseData) returnStatement = caseData;

	const { data: patientData, error: patientError } = await supabase
		.from('patients')
		.insert([{
			patient_number: patientIdentifier,
			first_name: newCase.first_name,
			last_name: newCase.last_name,
			middle_name: newCase.middle_name,
			suffix: newCase.suffix,
			age: newCase.age,
			contact_info: newCase.contact_info,
			medical_history: newCase.medical_history,
			sex: newCase.sex,
			responder_id: id,
		}])
		.select()
		.maybeSingle()

	if (patientError) throw new Error(patientError.message);
	if (patientData) returnStatement = { ...caseData, patientData };

	if (!newCase.injuries) throw new Error("Injuries is empty");

	let setInjuries: any = [];

	newCase.injuries.forEach(async (injury) => {
		const { data: injuryData, error: injuryError } = await supabase
			.from('injuries')
			.insert([{
				case_number: caseIdentifier,
				patient_number: patientIdentifier,
				location: injury.location,
				type: injury.type,
				severity: injury.severity,
				description: injury.description ?? null,
			}])
			.select()
			.maybeSingle()

		if (injuryError) throw new Error(injuryError.message);
		if (injuryData) setInjuries = [...setInjuries, injuryData];
	});

	return { ...returnStatement, injuries: setInjuries };
}

export const BODY_REGIONS = {
	Front: {
		// HEAD
		head: { x: [40, 60], y: [5, 18], label: 'Head' },
		neck: { x: [45, 55], y: [18, 25], label: 'Neck' },

		// TORSO
		left_chest: { x: [30, 50], y: [25, 45], label: 'Left Chest' },
		right_chest: { x: [50, 70], y: [25, 45], label: 'Right Chest' },
		left_abdomen: { x: [30, 50], y: [45, 60], label: 'Left Abdomen' },
		right_abdomen: { x: [50, 70], y: [45, 60], label: 'Right Abdomen' },

		// ARMS
		left_shoulder: { x: [15, 35], y: [25, 35], label: 'Left Shoulder' },
		right_shoulder: { x: [65, 85], y: [25, 35], label: 'Right Shoulder' },
		left_upper_arm: { x: [15, 35], y: [35, 50], label: 'Left Upper Arm' },
		right_upper_arm: { x: [65, 85], y: [35, 50], label: 'Right Upper Arm' },
		left_forearm: { x: [15, 35], y: [50, 65], label: 'Left Forearm' },
		right_forearm: { x: [65, 85], y: [50, 65], label: 'Right Forearm' },
		left_hand: { x: [15, 35], y: [65, 75], label: 'Left Hand' },
		right_hand: { x: [65, 85], y: [65, 75], label: 'Right Hand' },

		// LEGS
		left_thigh: { x: [35, 48], y: [60, 80], label: 'Left Thigh' },
		right_thigh: { x: [52, 65], y: [60, 80], label: 'Right Thigh' },
		left_knee: { x: [35, 48], y: [80, 85], label: 'Left Knee' },
		right_knee: { x: [52, 65], y: [80, 85], label: 'Right Knee' },
		left_shin: { x: [35, 48], y: [85, 95], label: 'Left Shin' },
		right_shin: { x: [52, 65], y: [85, 95], label: 'Right Shin' },
		left_foot: { x: [30, 50], y: [95, 100], label: 'Left Foot' },
		right_foot: { x: [50, 70], y: [95, 100], label: 'Right Foot' },
	},
	Back: {
		// HEAD
		head: { x: [40, 60], y: [5, 18], label: 'Head' },
		neck: { x: [45, 55], y: [18, 25], label: 'Neck' },

		// TORSO
		left_upper_back: { x: [30, 50], y: [25, 45], label: 'Left Upper Back' },
		right_upper_back: { x: [50, 70], y: [25, 45], label: 'Right Upper Back' },
		left_lower_back: { x: [30, 50], y: [45, 60], label: 'Left Lower Back' },
		right_lower_back: { x: [50, 70], y: [45, 60], label: 'Right Lower Back' },

		// ARMS
		left_shoulder: { x: [15, 35], y: [25, 35], label: 'Left Shoulder' },
		right_shoulder: { x: [65, 85], y: [25, 35], label: 'Right Shoulder' },
		left_upper_arm: { x: [15, 35], y: [35, 50], label: 'Left Upper Arm' },
		right_upper_arm: { x: [65, 85], y: [35, 50], label: 'Right Upper Arm' },
		left_forearm: { x: [15, 35], y: [50, 65], label: 'Left Forearm' },
		right_forearm: { x: [65, 85], y: [50, 65], label: 'Right Forearm' },
		left_hand: { x: [15, 35], y: [65, 75], label: 'Left Hand' },
		right_hand: { x: [65, 85], y: [65, 75], label: 'Right Hand' },

		// LEGS
		left_thigh: { x: [35, 48], y: [60, 80], label: 'Left Thigh' },
		right_thigh: { x: [52, 65], y: [60, 80], label: 'Right Thigh' },
		left_knee: { x: [35, 48], y: [80, 85], label: 'Left Knee' },
		right_knee: { x: [52, 65], y: [80, 85], label: 'Right Knee' },
		left_calf: { x: [35, 48], y: [85, 95], label: 'Left Calf' },
		right_calf: { x: [52, 65], y: [85, 95], label: 'Right Calf' },
		left_foot: { x: [30, 50], y: [95, 100], label: 'Left Foot' },
		right_foot: { x: [50, 70], y: [95, 100], label: 'Right Foot' },
	}
};
