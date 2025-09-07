import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const SettingsPrivacy = () => {
	return (
		<Card className="medical-card">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Shield className="w-5 h-5" />
					Privacy & Security
				</CardTitle>

				<CardDescription>
					Manage your data privacy and security settings
				</CardDescription>
			</CardHeader>

			<CardContent className="space-y-4">
				<div className="p-4 bg-muted/50 rounded-lg">
					<h4 className="font-semibold mb-2">Data Protection</h4>
					<p className="text-sm text-muted-foreground mb-3">
						All patient data is encrypted and stored securely in compliance with HIPAA regulations.
						Your emergency medical records are protected with industry-standard security measures.
					</p>
					<Button
						variant="outline"
						size="sm"
						className="cursor-pointer"
					>
						View Privacy Policy
					</Button>
				</div>

				<div className="p-4 bg-muted/50 rounded-lg">
					<h4 className="font-semibold mb-2">Data Export</h4>
					<p className="text-sm text-muted-foreground mb-3">
						Request a copy of all your data or export specific case records for your records.
					</p>
					<Button
						variant="outline"
						size="sm"
						className="cursor-pointer"
					>
						Export My Data
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}

export default SettingsPrivacy;