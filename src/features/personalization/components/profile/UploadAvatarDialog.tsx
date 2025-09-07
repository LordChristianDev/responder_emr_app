import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Camera } from "lucide-react";

import { useAuth } from "@/context/useAuth";
import { useProfile } from "@/context/useProfile";
import { showToast } from "@/lib/showToast";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import AvatarIcon from "@/components/common/AvatarIcon";

import type { ProfileAvatarProp, ProfileProp } from "@/features/personalization/types/profileTypes";
import { fetchProfile, uploadProfileAvatar } from "@/features/personalization/services/profileServices";

const UploadAvatarDialog = ({ children }: { children: React.ReactNode }) => {
	const [isHovered, setIsHovered] = useState<boolean>(false);
	const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);
	const [isLoading, setIsloading] = useState<boolean>(false);

	const [avatar, setAvatar] = useState<ProfileAvatarProp>();
	const avatarInputRef = useRef<HTMLInputElement>(null);

	const { user } = useAuth();
	const { profile, storeProfile } = useProfile();

	const { data: profileData, isFetching: isLoadingProfile, refetch } = useQuery({
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
		if (profileData && !isLoadingProfile) {
			storeProfile(profileData);
		}
	}, [profileData, isLoadingProfile]);


	const handleAvatarUpload = (image: File | null) => {
		if (!image) return;

		// Check Type
		if (!image.type.startsWith('image/')) {
			showToast({
				title: "Invalid file type",
				description: "Only image files are allowed",
				variant: "warning"
			});
			return;
		}

		// Check if less than 5MB limit
		if (image.size > 5 * 1024 * 1024) {
			showToast({
				title: "File too large",
				description: "Images must be smaller than 10MB",
				variant: "warning"
			});
			return;
		}

		setAvatar({
			id: Math.random().toString(36).substring(2, 9),
			file: image,
			url: URL.createObjectURL(image),
			type: image.type,
		});
	};

	const handleSaveAvatar = async () => {
		if (!avatar?.file) {
			showToast({
				title: "File is empty!",
				description: "Unable to complete upload without uploaded file",
				variant: "error"
			});
			return;
		}

		if (!profile?.user_id) {
			showToast({
				title: "Something went wrong!",
				description: "Unable to complete upload without identifier",
				variant: "error"
			});
			return;
		}

		setIsloading(true);

		await uploadProfileAvatar(profile.user_id, avatar);

		setIsloading(false);
		setIsAvatarDialogOpen(false);
		await refetch();
	}

	return (
		<Dialog open={isAvatarDialogOpen} onOpenChange={setIsAvatarDialogOpen}>
			<DialogTrigger asChild>
				{children}
			</DialogTrigger>

			<DialogContent className="max-w-sm max-h-[90vh]">
				<DialogHeader>
					<DialogTitle>Upload Avatar</DialogTitle>

					<DialogDescription>
						Upload a new profile picture
					</DialogDescription>
				</DialogHeader>

				<div className="p-4 flex items-center justify-center"
					onMouseEnter={() => setIsHovered(true)}
					onMouseLeave={() => setIsHovered(false)}
				>
					<div className="relative w-24 h-24">
						<AvatarIcon
							src={avatar?.url ?? profile?.avatar_url ?? ""}
							fallback="NW"
							size="3xl"
						/>

						{isHovered &&
							<div className="absolute top-0 bg-black/25 rounded-full w-full h-full cursor-pointer">
								<a
									onClick={() => avatarInputRef.current?.click()}
									className="flex items-center justify-center text-white h-full"
								>
									<Camera className="h-8 w-8" />
								</a>
							</div>}
					</div>
				</div>

				<input
					ref={avatarInputRef}
					type="file"
					multiple
					accept="image/*"
					className="hidden"
					onChange={(e) => handleAvatarUpload(e.target.files?.[0] || null)}
				/>

				<Button
					type="submit"
					onClick={handleSaveAvatar}
					className="flex bg-gradient-primary cursor-pointer">
					{isLoading
						? <span className="flex items-center">
							<svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
								<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
								<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
							<span className="p-18-semibold text-white">Saving...</span>
						</span>
						: <span className="p-18-semibold text-white">Set as Profile</span>}
				</Button>
			</DialogContent>
		</Dialog>
	);
}

export default UploadAvatarDialog;

