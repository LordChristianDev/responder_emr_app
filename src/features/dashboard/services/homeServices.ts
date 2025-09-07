import { FileText, MapPin, Plus, User } from "lucide-react";

import { supabase } from "@/lib/supabase";

import type { DashboardProp, QuickActionsProp } from "@/features/dashboard/types/homeTypes";
import { fetchRecentCases } from "@/features/dashboard/services/casesServices";

export const quickActions: QuickActionsProp[] = [
	{
		id: 1,
		title: "New Case",
		subTitle: "Register new case",
		url: "/add-case",
		icon: Plus,
	},
	{
		id: 2,
		title: "Recent Cases",
		subTitle: "View patient cases",
		url: "/view-cases",
		icon: FileText,
	},
	{
		id: 3,
		title: "Map View",
		subTitle: "Incident iocations",
		url: "/map",
		icon: MapPin,
	},
	{
		id: 4,
		title: "Profile",
		subTitle: "View your info",
		url: "/profile",
		icon: User,
	},
]

export const fetchDashboard = async (): Promise<DashboardProp> => {
	let dashboardData = {} as DashboardProp;

	const numOfPatients = await numberOfPatients();
	dashboardData = { ...dashboardData, numOfPatients };

	const numOfCasesToday = await numberOfCasesToday();
	dashboardData = { ...dashboardData, numOfCasesToday };

	const numOfCasesThisMonth = await numberOfCasesThisMonth();
	dashboardData = { ...dashboardData, numOfCasesThisMonth };

	const recentCases = await fetchRecentCases();
	if (recentCases) dashboardData = { ...dashboardData, recentCases };

	console.log(dashboardData);

	return dashboardData ?? null;
}

const numberOfPatients = async (): Promise<number> => {
	const { count, error } = await supabase
		.from("patients")
		.select("*", { count: "exact", head: true })

	if (error) throw new Error(error.message);

	return count ?? 0;
}

const numberOfCasesToday = async (): Promise<number> => {
	const today = new Date();
	const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
	const startOfNextDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

	const { count, error } = await supabase
		.from("cases")
		.select("*", { count: "exact", head: true })
		.gte("date_recorded", startOfDay.toISOString())
		.lt("date_recorded", startOfNextDay.toISOString());

	if (error) throw new Error(error.message);

	return count ?? 0;
};

const numberOfCasesThisMonth = async (): Promise<number> => {
	const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
	const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1);

	const { count, error } = await supabase
		.from("cases")
		.select("*", { count: "exact", head: true })
		.gte("date_recorded", startOfMonth.toISOString())
		.lt("date_recorded", endOfMonth.toISOString());

	if (error) throw new Error(error.message);

	return count ?? 0;
};


























