import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";

import { useAuth } from "@/context/useAuth";
import { useProfile } from "@/context/useProfile";
import { useRoutes } from "@/hooks/useRoutes";
import { getItem } from "@/lib/localStorage";

import { Button } from "@/components/ui/button";
import AllStats from "@/features/dashboard/components/home/AllStats";
import CasesCard from "@/features/dashboard/components/home/CasesCard";
import QuickActionCard from "@/features/dashboard/components/home/QuickActionCard";

import type { DashboardProp } from "@/features/dashboard/types/homeTypes";
import type { ProfileProp } from "@/features/personalization/types/profileTypes";
import { fetchDashboard, quickActions } from "@/features/dashboard/services/homeServices";
import { fetchProfile } from "@/features/personalization/services/profileServices";

const HomePage = () => {
	const { move } = useRoutes();
	const { user } = useAuth();
	const { profile, storeProfile } = useProfile();

	const { data: profileData, isFetching: profileLoading } = useQuery({
		queryKey: ['profile', user?.id],
		queryFn: async () => {
			if (!user?.id) {
				throw new Error('No User ID available');
			}

			const response = await fetchProfile(user.id);

			if (!response) {
				console.error(`Failed to fetch profile: ${response}`);
				return null;
			}

			return response as ProfileProp | null;
		},
		refetchOnMount: (query) => !query.state.data,
	});

	const { data: dashboardData, isFetching: dashboardLoading } = useQuery({
		queryKey: ['dashboard'],
		queryFn: fetchDashboard,
		placeholderData: {} as DashboardProp,
		refetchOnMount: (query) => !query.state.data,
	});

	const isLoggedIn = !!getItem('user');

	useEffect(() => {
		if (!isLoggedIn) {
			move("/login")
		}
	}, [isLoggedIn]);

	useEffect(() => {
		if (profileData && !profileLoading) {
			storeProfile(profileData);
		}
	}, [profileData, profileLoading]);

	const fullName = `${profile?.first_name} ${profile?.last_name} - ${profile?.responder?.title}: ${profile?.responder_number}`;
	const { numOfPatients, numOfCasesToday, numOfCasesThisMonth, recentCases } = dashboardData as DashboardProp;

	return (
		<main className="p-6 space-y-6">
			{profileLoading || dashboardLoading ? (
				<div className="animate-pulse space-y-4">
					<div className="h-6 w-1/3 bg-muted rounded" />
					<div className="h-4 w-1/2 bg-muted rounded" />

					<div className="flex-1 flex flex-wrap gap-6">
						<div className="h-32 flex-1 bg-muted rounded" />
						<div className="h-32 flex-1 bg-muted rounded" />
						<div className="h-32 flex-1 bg-muted rounded" />
					</div>

					<div className="flex-1 flex flex-wrap gap-6">
						<div className="h-36 flex-1 bg-muted rounded" />
						<div className="h-36 flex-1 bg-muted rounded" />
						<div className="h-36 flex-1 bg-muted rounded" />
						<div className="h-36 flex-1 bg-muted rounded" />
					</div>

					<div className="flex-1 flex flex-wrap gap-6">
						<div className="h-72 flex-1 bg-muted rounded" />
					</div>
				</div>

			) : (
				<>
					{/* Welcome Header */}
					< div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
						<div>
							<h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
							<p className="text-muted-foreground">Welcome back, {fullName}</p>
						</div>

						<Link to="/add-case">
							<Button size="lg" className="emergency-button px-6 py-2 text-base font-base cursor-pointer">
								<Plus className="w-5 h-5" />
								New Patient
							</Button>
						</Link>
					</div>

					{/* Stats Cards */}
					<AllStats
						numOfPatients={numOfPatients}
						numOfCasesToday={numOfCasesToday}
						numOfCasesThisMonth={numOfCasesThisMonth}
					/>

					{/* Quick Actions Grid */}
					<div className="flex-1 flex flex-wrap gap-6">
						{renderQuickActions}
					</div>

					{/* Recent Cases */}
					<CasesCard recentCases={recentCases ?? []} />
				</>
			)}
		</main >
	)
}

export default HomePage;

const renderQuickActions = quickActions.map((action, index) => {
	return <QuickActionCard key={index} action={action} />
});