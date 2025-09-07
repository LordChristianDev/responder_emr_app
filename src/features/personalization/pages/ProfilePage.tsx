import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Edit3 } from "lucide-react";

import { useAuth } from "@/context/useAuth";
import { useProfile } from "@/context/useProfile";
import { useRoutes } from "@/hooks/useRoutes";

import { Button } from "@/components/ui/button";
import ProfileInfo from "@/features/personalization/components/profile/ProfileInfo";
import ProfileCertifications from "@/features/personalization/components/profile/ProfileCertifications";
import ProfileDetails from "@/features/personalization/components/profile/ProfileDetails";

import type { ProfileProp } from "@/features/personalization/types/profileTypes";
import { fetchProfile } from "@/features/personalization/services/profileServices";

const ProfilePage = () => {
	const { move } = useRoutes();
	const { user } = useAuth();
	const { profile, storeProfile } = useProfile();

	const { data: profileData, isFetching: isFetchingProfile } = useQuery({
		queryKey: ['profile', user?.id],
		queryFn: async () => {
			if (!user?.id) throw new Error('No User ID available');

			const response = await fetchProfile(user.id);

			if (!response) {
				console.error(`Failed to fetch profile: ${response}`);
				return null;
			}

			return response as ProfileProp | null;
		},
		refetchOnMount: (query) => !query.state.data,
	});

	useEffect(() => {
		if (profileData && !isFetchingProfile) {
			storeProfile(profileData);
		}
	}, [profileData, isFetchingProfile]);

	return (
		<div className="mx-auto p-6">
			{isFetchingProfile ? (
				<div className="p-6">
					{/* Skeleton loader */}
					<div className="animate-pulse space-y-4">
						<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
							<div className="lg:col-span-2 space-y-6">
								<div className="h-75 w-full bg-muted rounded"></div>
								<div className="h-60 w-full bg-muted rounded"></div>
							</div>

							<div className="space-y-6">
								<div className="h-48 w-full bg-muted rounded"></div>
								<div className="h-48 w-full bg-muted rounded"></div>
							</div>
						</div>
					</div>
				</div>
			) : (
				<>
					<div className="flex items-center justify-between mb-6">
						<div>
							<h1 className="text-3xl font-bold text-foreground">Profile</h1>
							<p className="text-muted-foreground">Manage your professional information</p>
						</div >

						<Button
							onClick={() => move("/settings")}
							variant="outline"
							className="cursor-pointer"
						>
							<Edit3 className="w-4 h-4 mr-2" />
							Edit Profile
						</Button>
					</div >

					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
						{/* Profile Information */}
						<div className="lg:col-span-2 space-y-6">
							<ProfileInfo profile={profile as ProfileProp} />

							{/* Certifications */}
							{profile?.certifications &&
								<ProfileCertifications certifications={profile.certifications} />
							}

						</div>

						{/* Sidebar */}
						<div className="space-y-6">

							{/* Professional Details */}
							{profile?.responder && profile?.organization &&
								<ProfileDetails
									responder={profile.responder}
									organization={profile.organization}
								/>
							}

						</div>
					</div>
				</>
			)}
		</div >
	);
}

export default ProfilePage;