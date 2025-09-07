import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import type { CaseDetailsProp } from "@/features/dashboard/types/casesTypes";

const CaseDetailsStatus = ({ details }: { details: CaseDetailsProp }) => {
	const { status, description } = details;

	return (
		<Card className="medical-card">
			<CardHeader>
				<CardTitle>Case Status</CardTitle>
				<CardDescription>Emergency case incident details</CardDescription>
			</CardHeader>
			<CardContent>
				<Badge
					variant="secondary"
					className={description ? "mb-4" : ""}>
					{status}
				</Badge>

				{description && <>
					<Separator className="my-4" />

					<div className="space-y-3">
						<div>
							<p className="text-sm font-medium text-muted-foreground">Note:</p>
							<p className="font-medium">{description}</p>
						</div>
					</div>
				</>}
			</CardContent>
		</Card>

	);
}

export default CaseDetailsStatus;