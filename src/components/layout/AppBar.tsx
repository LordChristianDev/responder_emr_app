import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { LogOut, Search, User } from "lucide-react";

import { useAuth } from '@/context/useAuth';
import { useProfile } from '@/context/useProfile';
import { useRoutes } from "@/hooks/useRoutes";
import { createFullName, getInitials } from '@/lib/utils';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useSidebar } from "@/components/ui/sidebar";
import HoverIcon from "@/components/common/HoverIcon";
import AvatarIcon from "@/components/common/AvatarIcon";

import { fetchProfile } from '@/features/personalization/services/profileServices';

const AppBar = () => {
	const { move } = useRoutes();
	const { user, signOut } = useAuth();
	const { toggleSidebar } = useSidebar();
	const { profile, storeProfile } = useProfile();

	const { data: profileData, isFetching } = useQuery({
		queryKey: ['profile', user?.id],
		queryFn: async () => {
			if (!user?.id) throw new Error('No User ID available');

			const response = await fetchProfile(user.id);
			return response ?? null;
		},
		enabled: !!user?.id,
		refetchOnMount: (query) => !query.state.data,
	});

	useEffect(() => {
		if (profileData && !isFetching) {
			storeProfile(profileData);
		}
	}, [profileData, isFetching]);

	const handleLogout = () => {
		signOut();
		move('/login');
	};

	// profile data or fallbacks
	const first_name = profile?.first_name ?? '';
	const last_name = profile?.last_name ?? '';
	const avatar_url = profile?.avatar_url ?? '';

	const fullName = createFullName(first_name, last_name);
	const initials = getInitials(fullName);

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className='px-4 flex items-center justify-between gap-20 h-14 w-full'>
				{/* Logo */}
				<div className="flex items-center gap-3">
					<HoverIcon toggle={toggleSidebar} />
					<Link to="/home" className="flex items-center gap-2">
						<span className="font-satoshi font-bold text-xl">ResQ</span>
					</Link>
				</div>

				<div className="mx-auto flex items-end justify-end md:justify-between w-full">
					{/* Search */}
					<div className="hidden md:block flex-1 max-w-lg mx-4">
						<div className="relative">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Search ResQ..."
								className="pl-10 bg-muted/50 border-0 focus:bg-background transition-smooth"
							/>
						</div>
					</div>

					<div className="flex items-end justify-end gap-5">
						{/* Avatar / Profile Dropdown */}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<button className="h-8 w-8 ring-2 ring-primary/80 rounded-full cursor-pointer overflow-hidden">
									{isFetching ? (
										< div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
									) : (
										<AvatarIcon
											src={avatar_url}
											fallback={initials}
											className='h-8 w-8 rounded-full'
										/>
									)}
								</button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<div className="py-2 px-4 flex items-center justify-start gap-3">
									{isFetching ? (
										<div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
									) : (
										<AvatarIcon
											src={avatar_url}
											fallback={initials}
											className='h-8 w-8 ring-2 ring-primary/80 rounded-full cursor-pointer'
										/>
									)}
									<div className="text-sm font-medium">
										{isFetching ? "Loading..." : first_name}
									</div>
								</div>

								{/* View Profile */}
								<DropdownMenuSeparator />
								<DropdownMenuItem onClick={() => move('/profile')}>
									<div className='flex gap-2'>
										<User className="mr-2 h-4 w-4" />
										<span className='text-sm'>View Profile</span>
									</div>
								</DropdownMenuItem>

								{/* Logout */}
								<DropdownMenuSeparator />
								<DropdownMenuItem onClick={handleLogout} className="text-red-600">
									<div className='flex gap-2'>
										<LogOut className="mr-2 h-4 w-4" />
										<span className='!text-sm'>Log out</span>
									</div>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			</div>
		</header>
	);
};

export default AppBar;