import { Link } from "react-router-dom";
import { Clock, User } from "lucide-react";

import { createFullName, formatDate, formatTime } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import type { CaseProp } from "@/features/dashboard/types/casesTypes";

const CasesCard = ({ recentCases }: { recentCases: CaseProp[] }) => {

	const renderRecentCases = recentCases.map((recentCase) => {
		const { case_number, patient, cause, date_recorded, time_recorded, injuries, interventions } = recentCase;
		const { first_name, last_name, age } = patient;

		const fullName = createFullName(first_name, last_name);
		const date = formatDate(date_recorded)
		const time = formatTime(time_recorded)

		const allInjuries = injuries.reduce((acc, i, index) => {
			if (index === 0) return i.type;
			if (index === injuries.length - 1) return acc + " and " + i.type;
			return acc + ", " + i.type;
		}, "");


		const allInterventions = interventions.reduce((acc, i, index) => {
			if (index === 0) return i;
			if (index === injuries.length - 1) return acc + " and " + i;
			return acc + ", " + i;
		}, "");

		return (
			<Link key={case_number} to={`/case/${case_number}`} className="block group">
				<div className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
					<div className="flex items-center justify-between mb-2">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
								<User className="w-5 h-5 text-primary" />
							</div>
							<div>
								<p className="font-medium">{fullName}{age ? `, ${age} years old` : ''}</p>
								<p className="text-sm text-muted-foreground">{cause}</p>
							</div>
						</div>
						<div className="text-right">
							<Badge variant={status === "Stable" ? "secondary" : "outline"}>
								{status}
							</Badge>
							<p className="text-xs text-muted-foreground mt-1">{date} - {time}</p>
						</div>
					</div>
					<div className="text-sm">
						<p><span className="font-medium">Injury:</span> {allInjuries}</p>
						<p><span className="font-medium">Intervention:</span> {allInterventions}</p>
					</div>
				</div>
			</Link>
		);
	});

	return (
		<Card className="medical-card">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Clock className="w-5 h-5" />
					Recent Cases
				</CardTitle>
				<CardDescription>Latest patient interactions</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{renderRecentCases}
				</div>
			</CardContent>
		</Card>
	)
}

export default CasesCard;
