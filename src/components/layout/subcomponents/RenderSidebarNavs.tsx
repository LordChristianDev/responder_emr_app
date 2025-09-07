import { ChevronRight } from "lucide-react";

import { useRoutes } from "@/hooks/useRoutes";

import { SidebarMenuButton, SidebarMenuItem, SidebarMenuSub } from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

import type { AddtionalNavProp, NavigationProp } from "@/features/authentication/services/layoutServices";

const RenderSidebarNav = ({ navigation }: { navigation: NavigationProp }) => {
	const { isActiveRoute, move } = useRoutes();

	const { title, url, additionalNavs } = navigation;

	const hasSubNavs = additionalNavs && additionalNavs.length > 0;
	const handleOnClick = () => move(url);

	const renderAddtionalNavs = additionalNavs?.map((subNav: AddtionalNavProp) => {
		const { name, to } = subNav;
		const handleNavOnClick = () => move(to);

		return (
			<SidebarMenuButton
				key={name}
				isActive={isActiveRoute(to)}
				onClick={handleNavOnClick}
				className="cursor-pointer"
			>
				<div className="flex flex-row justify-between w-full">
					<div className="flex">
						<span>{name}</span>
					</div>
				</div>
			</SidebarMenuButton>
		);
	})

	return hasSubNavs ? (
		<Collapsible key={title} className="group/collapsible">
			<SidebarMenuItem>
				<CollapsibleTrigger asChild>
					<SidebarMenuButton
						tooltip={title}
						className="cursor-pointer"
					>
						<div className="flex flex-row justify-between w-full">
							<div className="flex">
								<navigation.icon className="h-4 w-4 mr-2" />
								<span>{title}</span>
							</div>

							<ChevronRight className="h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
						</div>
					</SidebarMenuButton>
				</CollapsibleTrigger>

				<CollapsibleContent>
					<SidebarMenuSub>
						{renderAddtionalNavs}
					</SidebarMenuSub>
				</CollapsibleContent>
			</SidebarMenuItem>
		</Collapsible>
	) : (
		<SidebarMenuItem key={title}>
			<SidebarMenuButton
				isActive={isActiveRoute(url)}
				onClick={handleOnClick}
				tooltip={title}
				className="cursor-pointer"
			>
				<div className="flex flex-row justify-between w-full">
					<div className="flex">
						<navigation.icon className="h-4 w-4 mr-2" />
						<span>{title}</span>
					</div>
				</div>
			</SidebarMenuButton>
		</SidebarMenuItem>
	);
}

export default RenderSidebarNav;