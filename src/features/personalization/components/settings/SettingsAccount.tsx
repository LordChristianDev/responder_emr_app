import { LogOut } from "lucide-react";

import { removeItem } from "@/lib/localStorage";
import { useRoutes } from "@/hooks/useRoutes";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const SettingsAccount = () => {
	const { move } = useRoutes();

	const handleLogout = () => {
		removeItem('user');
		move('/login');
	};

	return (
		<Card className="medical-card border-destructive/20">
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-destructive">
					<LogOut className="w-5 h-5" />
					Account Actions
				</CardTitle>
				<CardDescription>
					Manage your account and session
				</CardDescription>
			</CardHeader>

			<CardContent className="space-y-4">
				<Button
					variant="outline"
					onClickCapture={handleLogout}
					className="w-full justify-start text-destructive hover:text-destructive"
				>
					<LogOut className="w-4 h-4 mr-2" />
					Sign Out
				</Button>
			</CardContent>
		</Card>
	);
}

export default SettingsAccount;