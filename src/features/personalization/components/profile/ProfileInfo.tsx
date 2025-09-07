import { useState } from "react";
import { Camera } from "lucide-react";

import { createFullName, getInitials } from "@/lib/utils";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AvatarIcon from "@/components/common/AvatarIcon";
import UploadAvatarDialog from "@/features/personalization/components/profile/UploadAvatarDialog";

import type { ProfileProp } from "@/features/personalization/types/profileTypes";

type ProfileInfoProp = {
	profile: ProfileProp;
}

const ProfileInfo = ({ profile }: ProfileInfoProp) => {
	const [isAvatarHovered, setIsAvatarHovered] = useState<boolean>(false);

	const { first_name, last_name, email, phone, avatar_url, organization, responder_number } = profile ?? {};

	const fullName = createFullName(first_name, last_name);
	const initials = getInitials(fullName);
	const avatar = avatar_url ?? '';

	return (
		<Card className="medical-card">
			<CardHeader>
				<CardTitle>Personal Information</CardTitle>
				<CardDescription>Your basic profile and contact details</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				<div
					onMouseEnter={() => setIsAvatarHovered(true)}
					onMouseLeave={() => setIsAvatarHovered(false)}
					className="shrink-0 relative overflow-visible"
				>
					<div className="relative inline-block">
						<AvatarIcon
							src={avatar}
							fallback={initials}
							size="3xl"
						/>
						{isAvatarHovered && (
							<UploadAvatarDialog>
								<Button
									size="icon"
									className="absolute -bottom-1 -right-1 rounded-full bg-gradient-primary text-primary-foreground w-8 h-8 shadow-medium hover:scale-105 transition-smooth cursor-pointer z-10" // Add z-index
								>
									<Camera className="h-4 w-4" />
								</Button>
							</UploadAvatarDialog>
						)}
					</div>
				</div>


				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label htmlFor="name">Full Name</Label>
						<Input
							id="name"
							value={fullName}
							disabled
						/>
					</div>

					{responder_number && <div className="space-y-2">
						<Label htmlFor="id">First Aider ID</Label>
						<Input
							id="id"
							value={responder_number}
							disabled
							className="bg-muted/50"
						/>
					</div>}

				</div>

				{(email || phone) &&
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{email && <div className="space-y-2">
							<Label htmlFor="email">Email Address</Label>
							<Input
								id="email"
								type="email"
								value={email}
								disabled
								className="bg-muted/50"
							/>
						</div>}

						{phone && <div className="space-y-2">
							<Label htmlFor="phone">Phone Number</Label>
							<Input
								id="phone"
								value={phone}
								disabled
								className="bg-muted/50"
							/>
						</div>}
					</div>}

				{organization && <div className="space-y-2">
					<Label htmlFor="organization">Organization</Label>
					<Input
						id="organization"
						value={organization.name}
						disabled
						className="bg-muted/50"
					/>
				</div>}

			</CardContent>
		</Card>
	);
}

export default ProfileInfo;