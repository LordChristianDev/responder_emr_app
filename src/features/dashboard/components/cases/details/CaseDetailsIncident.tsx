import { MapPin } from "lucide-react";

import { formatDate, formatTime } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { CaseDetailsProp } from "@/features/dashboard/types/casesTypes";

const CaseDetailsIncident = ({ incident }: { incident: CaseDetailsProp }) => {
	const { cause, date_recorded, time_recorded, location, latitude, longitude } = incident;

	const date = formatDate(date_recorded);
	const time = formatTime(time_recorded);

	return (
		<Card className="medical-card">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<MapPin className="w-5 h-5" />
					Incident Details
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<p className="text-sm font-medium text-muted-foreground">Cause</p>
						<p className="font-medium">{cause}</p>
					</div>
					<div>
						<p className="text-sm font-medium text-muted-foreground">Date & Time</p>
						<p className="font-medium">{date} at {time}</p>
					</div>
				</div>
				<div>
					<p className="text-sm font-medium text-muted-foreground">Location</p>
					<p className="font-medium">{location}</p>
					<p className="text-sm text-muted-foreground">{latitude.toFixed(2)}° N, {longitude.toFixed(2)}° W"</p>
				</div>
			</CardContent>
		</Card>
	);
}

export default CaseDetailsIncident;