import { AlertTriangle } from "lucide-react";

import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { InjuryProp } from "@/features/dashboard/types/casesTypes";

const CaseDetailsInjuries = ({ injuries }: { injuries: InjuryProp[] }) => {

	const renderInjuries = injuries.map((injury, index) => {
		const { location, type, severity, description } = injury;

		return (
			<div key={index} className="p-4 border border-border rounded-lg">
				<div className={cn(
					"flex items-start justify-between",
					description ? "mb-2" : ""
				)}>
					<h4 className="font-semibold">{location} - {type}</h4>
					<Badge variant={
						severity === "Critical" ? "destructive" :
							severity === "Severe" ? "destructive" :
								severity === "Moderate" ? "default" : "secondary"
					}>
						{severity}
					</Badge>
				</div>
				{description && <p className="text-muted-foreground">{description}</p>}
			</div >
		);
	});

	return (
		<Card className="medical-card">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<AlertTriangle className="w-5 h-5" />
					Injuries Assessment
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{renderInjuries}
				</div>
			</CardContent>
		</Card>
	);
}

export default CaseDetailsInjuries;