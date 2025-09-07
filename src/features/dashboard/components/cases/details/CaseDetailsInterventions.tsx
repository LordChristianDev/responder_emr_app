import { Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CaseDetailsInterventions = ({ interventions }: { interventions: string[] }) => {

	const renderInterventions = interventions.map((intervention, index) => {
		return (
			<li key={index} className="flex items-center gap-3">
				<div className="w-2 h-2 bg-secondary rounded-full"></div>
				<span>{intervention}</span>
			</li>
		);
	})

	return (
		<Card className="medical-card">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Activity className="w-5 h-5" />
					Medical Interventions
				</CardTitle>
			</CardHeader>
			<CardContent>
				<ul className="space-y-2">
					{renderInterventions}
				</ul>
			</CardContent>
		</Card>
	);
}

export default CaseDetailsInterventions;