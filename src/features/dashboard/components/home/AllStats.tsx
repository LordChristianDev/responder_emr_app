import { Clock, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type AllStatsProp = {
	numOfPatients: number;
	numOfCasesToday: number;
	numOfCasesThisMonth: number;
}

const AllStats = ({
	numOfPatients,
	numOfCasesToday,
	numOfCasesThisMonth,
}: AllStatsProp) => {

	return (
		<div className="flex-1 flex flex-wrap gap-6">
			<Card className="medical-card flex-1">
				<CardContent className="p-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-muted-foreground">Total Patients</p>
							<p className={"text-2xl font-bold text-primary"}>{numOfPatients}</p>
						</div>
						<Users className={"text-primary w-8 h-8"} />
					</div>
				</CardContent>
			</Card>

			<Card className="medical-card flex-1">
				<CardContent className="p-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-muted-foreground">Active Cases Today</p>
							<p className={"text-2xl font-bold text-secondary"}>{numOfCasesToday}</p>
						</div>
						<Clock className={"text-secondary w-8 h-8"} />
					</div>
				</CardContent>
			</Card>

			<Card className="medical-card flex-1">
				<CardContent className="p-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-muted-foreground">This Month</p>
							<p className={"text-2xl font-bold text-emergency"}>{numOfCasesThisMonth}</p>
						</div>
						<Clock className={"text-emergency w-8 h-8"} />
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

export default AllStats;
