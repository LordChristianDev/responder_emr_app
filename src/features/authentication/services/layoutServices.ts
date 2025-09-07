import { FileText, LayoutDashboard, Map, Settings, User, Users, type LucideIcon } from "lucide-react";

export type AddtionalNavProp = {
	name: string;
	to: string;
}

export type NavigationProp = {
	title: string;
	url: string;
	icon: LucideIcon;
	description?: string;
	additionalNavs?: AddtionalNavProp[];
}

export const mainNavs: NavigationProp[] = [
	{
		title: "Dashboard",
		url: "/dashboard",
		icon: LayoutDashboard,
		description: "Overview & statistics"
	},
	{
		title: "Cases",
		url: "/cases",
		icon: FileText,
		description: "Patient records",
		additionalNavs: [
			{
				name: "Add Case",
				to: "/add-case"
			},
			{
				name: "View Cases",
				to: "/view-cases"
			},
		]
	},
	{
		title: "Map",
		url: "/map",
		icon: Map,
		description: "Incident locations"
	},
	{
		title: "Patients",
		url: "/patients",
		icon: Users,
		description: "List of Patients"
	}
];

export const moreNavs: NavigationProp[] = [
	{
		title: "Profile",
		url: "/profile",
		icon: User,
		description: "Personal information"
	},
	{
		title: "Settings",
		url: "/settings",
		icon: Settings,
		description: "App preferences"
	}
];
