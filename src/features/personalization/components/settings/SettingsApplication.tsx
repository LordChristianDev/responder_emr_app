import { useEffect, useState } from "react";
import { Smartphone } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

import type { SettingsConfigProp } from "@/features/personalization/types/settingsTypes";

type SettingsLanguageComponentProp = {
	initialAutoSave: boolean;
	initialOffline: boolean;
	onChange: (config: SettingsConfigProp) => void;
}

const SettingsApplication = ({
	initialAutoSave,
	initialOffline,
	onChange,
}: SettingsLanguageComponentProp) => {
	const [autoSave, setAutoSave] = useState<SettingsConfigProp['autoSave']>(initialAutoSave);
	const [offlineMode, setOfflineMode] = useState<SettingsConfigProp['offlineMode']>(initialOffline);

	useEffect(() => {
		onChange({
			autoSave,
			offlineMode,
		})
	}, [autoSave, offlineMode]);

	return (
		<Card className="medical-card">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Smartphone className="w-5 h-5" />
					Application Settings
				</CardTitle>

				<CardDescription>
					Configure application behavior and performance
				</CardDescription>
			</CardHeader>

			<CardContent className="space-y-4">
				<div className="flex items-center justify-between">
					<div className="space-y-0.5">
						<Label className="text-base">Auto-Save</Label>
						<div className="text-sm text-muted-foreground">
							Automatically save case data as you type
						</div>
					</div>
					<Switch
						checked={autoSave}
						onCheckedChange={(value) => setAutoSave(value)}
					/>
				</div>

				<Separator />

				<div className="flex items-center justify-between">
					<div className="space-y-0.5">
						<Label className="text-base">Offline Mode</Label>
						<div className="text-sm text-muted-foreground">
							Enable offline functionality for emergency situations
						</div>
					</div>
					<Switch
						checked={offlineMode}
						onCheckedChange={(value) => setOfflineMode(value)}
					/>
				</div>
			</CardContent>
		</Card>
	);
}

export default SettingsApplication;