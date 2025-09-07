import { Building, Calendar, User } from "lucide-react";

import { formatTimestampz } from "@/lib/utils";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { OrganizationProp, ResponderRoleProp } from "@/features/personalization/types/profileTypes";

type ProfileDetailsProp = {
	responder: ResponderRoleProp;
	organization: OrganizationProp;
}

const ProfileDetails = ({ responder, organization }: ProfileDetailsProp) => {
	const { title } = responder;
	const { name, created_at } = organization;

	const timestamp = formatTimestampz(created_at);

	return (
		<Card className="medical-card">
			<CardHeader>
				<CardTitle>Professional Details</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="flex items-start gap-3">
					<User className="w-5 h-5 text-muted-foreground mt-0.5" />
					<div>
						<p className="font-medium">{title}</p>
						<p className="text-sm text-muted-foreground">Primary Role</p>
					</div>
				</div>

				<div className="flex items-start gap-3">
					<Building className="w-5 h-5 text-muted-foreground mt-0.5" />
					<div>
						<p className="font-medium">{name}</p>
						<p className="text-sm text-muted-foreground">Organization</p>
					</div>
				</div>

				<div className="flex items-start gap-3">
					<Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
					<div>
						<p className="font-medium">{timestamp}</p>
						<p className="text-sm text-muted-foreground">Join Date</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

export default ProfileDetails;