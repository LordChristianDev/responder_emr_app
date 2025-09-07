import { createFullName } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ResponderProp } from "@/features/dashboard/types/casesTypes";

const CaseDetailsResponder = ({ responder }: { responder: ResponderProp }) => {
	const { first_name, last_name, responder_number, organization } = responder as ResponderProp ?? {};

	const fullName = createFullName(first_name, last_name);

	return (
		<Card className="medical-card">
			<CardHeader>
				<CardTitle className="">First Responder</CardTitle>
			</CardHeader>
			<CardContent className="space-y-3">
				<div>
					<p className="text-sm font-medium text-muted-foreground">Name</p>
					<p className="font-mono">{fullName}</p>
				</div>

				{responder_number &&
					<div>
						<p className="text-sm font-medium text-muted-foreground">ID</p>
						<p className="font-mono">{responder_number}</p>
					</div>
				}

				{organization &&
					<div>
						<p className="text-sm font-medium text-muted-foreground">Organization</p>
						<p className="text-sm">{organization.name}</p>
					</div>
				}
			</CardContent>
		</Card>
	);
}

export default CaseDetailsResponder;
