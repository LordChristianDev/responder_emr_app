import { LogOut, Moon, Sun } from "lucide-react";

import { useAuth } from "@/context/useAuth";
import { useTheme } from "@/context/useTheme";
import { useRoutes } from "@/hooks/useRoutes";

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import RenderSidebarNav from "./subcomponents/RenderSidebarNavs";

import { mainNavs, moreNavs, type NavigationProp } from "@/features/authentication/services/layoutServices";

const AppSidebar = () => {
	const { move } = useRoutes();
	const { isDarkMode, toggleTheme } = useTheme();
	const { signOut } = useAuth();

	const handleLogout = async () => {
		await signOut();
		move('/login');
	};

	const renderNavs = (items: NavigationProp[]) => items.map((nav: NavigationProp, index) => {
		return <RenderSidebarNav key={index} navigation={nav} />
	});

	return (
		<Sidebar variant="sidebar" collapsible="icon">
			<SidebarHeader className="flex items-center justify-between p-4 mb-5">
			</SidebarHeader>

			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Main</SidebarGroupLabel>

					<SidebarMenu>
						{renderNavs(mainNavs)}
					</SidebarMenu>
				</SidebarGroup>

				<SidebarGroup>
					<SidebarGroupLabel>Personalization</SidebarGroupLabel>

					<SidebarMenu>
						{renderNavs(moreNavs)}
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>

			<SidebarFooter>
				<Separator />

				<SidebarGroup>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton
								onClick={toggleTheme}
								tooltip="Theme"
								className="cursor-pointer"
							>
								{isDarkMode ?
									<Sun className="h-4 w-4" /> :
									<Moon className="h-4 w-4" />
								}
								<span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
							</SidebarMenuButton>
						</SidebarMenuItem>

						{/* Logout Button */}
						<SidebarMenuItem>
							<SidebarMenuButton
								onClick={handleLogout}
								tooltip="Theme"
								className="cursor-pointer"
							>
								<LogOut className="h-4 w-4 justify-start text-red-500 hover:text-red-700" />
								<span className="text-red-500 hover:text-red-700">Log out</span>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarGroup>
			</SidebarFooter>
		</Sidebar>
	);
}

export default AppSidebar;