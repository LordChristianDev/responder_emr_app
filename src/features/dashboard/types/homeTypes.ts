import type { LucideIcon } from "lucide-react";
import type { CaseProp } from "@/features/dashboard/types/casesTypes";

export type DashboardProp = {
	numOfPatients: number;
	numOfCasesToday: number;
	numOfCasesThisMonth: number;
	recentCases: CaseProp[];
}

export type CasesProp = {
	id: number;
	first_name: string;
	last_name: string;
	middle_name?: string;
	suffix?: string;
	age?: number;
	incident: string;
	injury: string;
	intervention: string;
	time: string;
	status: "Stable" | "Transferred to EMS";
}

export type StatsProp = {
	label: string;
	value: string;
	icon: LucideIcon;
	color?: string;
}

export type QuickActionsProp = {
	id: number;
	title: string;
	subTitle: string;
	url: string;
	icon: LucideIcon;
}