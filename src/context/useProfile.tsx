import { createContext, useContext, useState, type ReactNode } from "react";

import type { ProfileProp } from "@/features/personalization/types/profileTypes";

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const useProfileHook = () => {
	const [profile, setProfile] = useState<ProfileProp | null>(null);

	const storeProfile = (data: ProfileProp) => {
		if (!data) {
			throw new Error('Data for profile storage is empty');
		}

		setProfile(data);
	}

	return { profile, storeProfile };
}

export const ProfileProvider = ({ children }: ProfileProviderProps) => {
	const profileData = useProfileHook();

	return (
		<ProfileContext.Provider value={profileData} >
			{children}
		</ProfileContext.Provider>
	);
}

export const useProfile = (): ProfileContextType => {
	const context = useContext(ProfileContext);

	if (context === undefined) {
		throw new Error('useProfile must be used within an ProfileProvider');
	}
	return context;
}

type ProfileContextType = {
	profile: ProfileProp | null;
	storeProfile: (data: ProfileProp) => void;
}

type ProfileProviderProps = {
	children: ReactNode;
}