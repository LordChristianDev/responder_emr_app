import { useEffect, useState } from "react";
import { Bell } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

import type { SettingsNotificationsProp } from "@/features/personalization/types/settingsTypes";

type SettingsNotificationsComponentProp = {
	initialConfig: SettingsNotificationsProp
	onChange: (config: SettingsNotificationsProp) => void;
}

const SettingsNotifications = ({ initialConfig, onChange }: SettingsNotificationsComponentProp) => {
	const [emergency, setEmergency] = useState<SettingsNotificationsProp['emergency']>(initialConfig.emergency);
	const [caseUpdates, setCaseUpdates] = useState<SettingsNotificationsProp['caseUpdates']>(initialConfig.caseUpdates);
	const [systemAlerts, setSystemAlerts] = useState<SettingsNotificationsProp['systemAlerts']>(initialConfig.systemAlerts);
	const [emailDigest, setEmailDigest] = useState<SettingsNotificationsProp['emailDigest']>(initialConfig.emailDigest);

	useEffect(() => {
		onChange({
			emergency,
			caseUpdates,
			systemAlerts,
			emailDigest,
		});
	}, [emergency, caseUpdates, systemAlerts, emailDigest]);

	return (
		<Card className="medical-card">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Bell className="w-5 h-5" />
					Notifications
				</CardTitle>
				<CardDescription>
					Configure when and how you receive notifications
				</CardDescription>
			</CardHeader>

			<CardContent className="space-y-4">
				<div className="flex items-center justify-between">
					<div className="space-y-0.5">
						<Label className="text-base">Emergency Alerts</Label>
						<div className="text-sm text-muted-foreground">
							Receive immediate notifications for critical emergencies
						</div>
					</div>
					<Switch
						checked={emergency}
						onCheckedChange={(value) => setEmergency(value)}
					/>
				</div>

				<Separator />

				<div className="flex items-center justify-between">
					<div className="space-y-0.5">
						<Label className="text-base">Case Updates</Label>
						<div className="text-sm text-muted-foreground">
							Get notified when case statuses change
						</div>
					</div>
					<Switch
						checked={caseUpdates}
						onCheckedChange={(value) => setCaseUpdates(value)}
					/>
				</div>

				<Separator />

				<div className="flex items-center justify-between">
					<div className="space-y-0.5">
						<Label className="text-base">System Alerts</Label>
						<div className="text-sm text-muted-foreground">
							Receive notifications about system maintenance and updates
						</div>
					</div>
					<Switch
						checked={systemAlerts}
						onCheckedChange={(value) => setSystemAlerts(value)}
					/>
				</div>

				<Separator />

				<div className="flex items-center justify-between">
					<div className="space-y-0.5">
						<Label className="text-base">Email Digest</Label>
						<div className="text-sm text-muted-foreground">
							Weekly summary of your emergency response activities
						</div>
					</div>
					<Switch
						checked={emailDigest}
						onCheckedChange={(value) => setEmailDigest(value)}
					/>
				</div>
			</CardContent>
		</Card>
	);
}

export default SettingsNotifications;