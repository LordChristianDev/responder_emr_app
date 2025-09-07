import { Award } from "lucide-react";
import { formatTimestampz } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import type { CertificationProp } from "@/features/personalization/types/profileTypes";

const ProfileCertifications = ({ certifications }: { certifications: CertificationProp[] }) => {

	const renderCertifications = certifications.map((cert) => {
		const { id, name, description, organization, expiry_duration, created_at } = cert;
		const timestamp = formatTimestampz(created_at);
		return (
			<div key={id} className="p-4 border border-border rounded-lg">
				<div className="mb-1 flex items-start justify-between">
					<h4 className="font-semibold">{name}</h4>
					<Badge variant="secondary">Active</Badge>
				</div>
				<p className="mb-2 text-sm text-muted-foreground">
					{description}
				</p>

				<div className="flex flex-col text-sm text-foreground">
					<p><span className="font-medium">Issuer:</span> {organization}</p>
					<p><span className="font-medium">Issued:</span> {timestamp}</p>
					<p><span className="font-medium">Expires:</span> {expiry_duration} {expiry_duration === 0 ? 'year' : 'years'}</p>
				</div>
			</div>
		);
	});

	return (
		<Card className="medical-card">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Award className="w-5 h-5" />
					Certifications
				</CardTitle>
				<CardDescription>Your professional qualifications and expiry dates</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{renderCertifications}
				</div>
			</CardContent>
		</Card>
	);
}

export default ProfileCertifications;