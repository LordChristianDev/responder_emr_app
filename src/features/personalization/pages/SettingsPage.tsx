import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bell, LogOut, Shield, Smartphone, User, UserLock } from "lucide-react";
import { getItem, setItem } from "@/lib/localStorage";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SettingsProfileInfo from "@/features/personalization/components/settings/SettingsProfileInfo";
import SettingsResponderInfo from "@/features/personalization/components/settings/SettingsResponderInfo";
import SettingsNotifications from "@/features/personalization/components/settings/SettingsNotifications";
import SettingsApplication from "@/features/personalization/components/settings/SettingsApplication";
import SettingsPrivacy from "@/features/personalization/components/settings/SettingsPrivacy";
import SettingsAccount from "@/features/personalization/components/settings/SettingsAccount";

import type { SettingsProp } from "@/features/personalization/types/settingsTypes";
import { fetchSettings } from "@/features/personalization/services/settingsServices";

const getLocalSettingsConfiguration = (): SettingsProp => {
	const localConfig = getItem("settings_config");

	return localConfig ?? {
		theme: "light",
		notifications: {
			emergency: true,
			caseUpdates: true,
			systemAlerts: false,
			emailDigest: true
		},
		language: "english",
		autoSave: true,
		offlineMode: true
	};
}

const SettingsPage = () => {
	const [settingsConfig, setSettingsConfig] = useState<SettingsProp>(getLocalSettingsConfiguration())

	const { data, isFetching } = useQuery({
		queryKey: ['settings'],
		queryFn: () => fetchSettings(),
		initialData: {} as SettingsProp,
	});

	useEffect(() => {
		setSettingsConfig(data);
		setItem('settings_config', data);

	}, [isFetching, data]);

	const { notifications, autoSave, offlineMode } = settingsConfig ?? {} as SettingsProp;

	return (
		<div className="mx-auto p-6">
			{isFetching ? (
				<div className="animate-pulse  space-y-6">
					<div className="h-6 w-1/3 bg-muted rounded"></div>
					<div className="h-4 w-1/2 bg-muted rounded"></div>

					<div className="h-12 w-full bg-muted rounded" />
					<div className="h-75 w-full bg-muted rounded" />
				</div>
			) : (
				<>
					<div className="flex items-center justify-between mb-6">
						<div>
							<h1 className="text-3xl font-bold text-foreground">Settings</h1>
							<p className="text-muted-foreground">Customize your FirstAid+ EMR experience</p>
						</div >
					</div >

					<Tabs defaultValue="profile" className="space-y-6">
						{/* Settings Tabs */}
						<TabsList className="grid grid-cols-6 w-full">
							<TabsTrigger value="profile" className="gap-2 cursor-pointer">
								<User className="h-4 w-4" />
								Profile
							</TabsTrigger>

							<TabsTrigger value="credentials" className="gap-2 cursor-pointer">
								<UserLock className="h-4 w-4" />
								Credentials
							</TabsTrigger>

							<TabsTrigger value="notifications" className="gap-2 cursor-pointer">
								<Bell className="h-4 w-4" />
								Notifications
							</TabsTrigger>

							<TabsTrigger value="application" className="gap-2 cursor-pointer">
								<Smartphone className="h-4 w-4" />
								Application
							</TabsTrigger>

							<TabsTrigger value="privacy" className="gap-2 cursor-pointer">
								<Shield className="h-4 w-4" />
								Privacy
							</TabsTrigger>

							<TabsTrigger value="account" className="gap-2 cursor-pointer">
								<LogOut className="h-4 w-4" />
								Account
							</TabsTrigger>
						</TabsList>

						{/* Profile Information */}
						<TabsContent value="profile">
							<SettingsProfileInfo />
						</TabsContent>

						{/* Responder Information */}
						<TabsContent value="credentials">
							<SettingsResponderInfo />
						</TabsContent>

						{/* Notifications */}
						<TabsContent value="notifications">
							<SettingsNotifications
								initialConfig={notifications}
								onChange={(config) => {
									setSettingsConfig(prev => ({
										...prev,
										notifications: config ?? notifications
									}));
								}}
							/>
						</TabsContent>

						{/* Application */}
						<TabsContent value="application">
							<SettingsApplication
								initialAutoSave={autoSave}
								initialOffline={offlineMode}
								onChange={(config) => {
									setSettingsConfig(prev => ({
										...prev,
										autoSave: config.autoSave ?? autoSave,
										offlineMode: config.offlineMode ?? offlineMode
									}));
								}}
							/>
						</TabsContent>

						{/* Privacy & Security */}
						<TabsContent value="privacy">
							<SettingsPrivacy />
						</TabsContent>

						{/* Account Actions */}
						<TabsContent value="account">
							<SettingsAccount />
						</TabsContent>
					</Tabs>
				</>
			)}
		</div >
	);
}

export default SettingsPage;