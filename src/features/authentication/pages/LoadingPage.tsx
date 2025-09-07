import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

import { useAuth, type UserProp } from "@/context/useAuth";
import { useRoutes } from "@/hooks/useRoutes";
import { getItem } from "@/lib/localStorage";

import type { ProfileProp } from "@/features/personalization/types/profileTypes";
import { createProfileData } from "@/features/personalization/services/profileServices";
import { createUserWithGoogleID, fetchUserWithGoogleID } from "@/features/authentication/services/authServices";

const LoadingPage = () => {
	const [shouldCreateUser, setShouldCreateUser] = useState<boolean>(false);
	const [shouldCreateProfile, setShouldCreateProfile] = useState<boolean>(false);
	const { user, supabaseUser, storeUser, signOut } = useAuth();
	const { move } = useRoutes();

	const isLoggedIn = !!getItem('user');

	const { data: fetchedUser, refetch } = useQuery({
		queryKey: ['user', supabaseUser?.id],
		queryFn: async () => {
			if (!supabaseUser?.id) {
				throw new Error('No supabase user ID available');
			}

			const response = await fetchUserWithGoogleID(supabaseUser.id);

			if (!response) {
				if (response === null) {
					return null;
				}
				console.error(`Failed to fetch user: ${response}`);
			}

			return response as UserProp | null;
		},
		enabled: !!supabaseUser?.id
	});

	const createUser = useMutation({
		mutationFn: async () => {
			if (!supabaseUser?.id) {
				throw new Error('No google ID available');
			}

			const response = await createUserWithGoogleID(supabaseUser.id);

			if (!response) {
				console.error(`Failed to create user: ${response}`);
			}

			return response as UserProp;
		},
		onSuccess: (data) => {
			storeUser(data);
			setShouldCreateProfile(true);
		},
		onError: (error) => {
			console.error("Error creating user:", error);
		},
	});

	const createProfile = useMutation({
		mutationFn: async () => {
			if (!user?.id) {
				throw new Error('No user ID available');
			}

			if (!supabaseUser) {
				throw new Error('No supabase user available');
			}

			const parts = supabaseUser.user_metadata?.name.trim().split(" ") ?? ['First', 'Responder'];
			const lastName = parts.pop();
			const firstName = parts.join(" ");

			const response = await createProfileData({
				user_id: Number(user.id),
				first_name: firstName ?? 'First',
				last_name: lastName ?? 'Responder',
				avatar_url: supabaseUser.user_metadata?.picture ?? null,
				email: supabaseUser.email ?? null,
			});

			if (!response) {
				console.error(`Failed to create profile: ${response}`);
			}

			return response as ProfileProp | null;
		},

		onSuccess: (data) => {
			console.log("Created profile data:", data);
			setShouldCreateProfile(false);
		},
		onError: (error) => {
			console.error("Error creating profile:", error);
			setShouldCreateProfile(false);;
		},
	});

	useEffect(() => {
		if (!supabaseUser) {
			signOut();
			move('/login');
			return;
		}

		if (supabaseUser.id) {
			refetch();
		}

		if (isLoggedIn) {
			move('/dashboard');
		}
	}, [supabaseUser, isLoggedIn]);

	useEffect(() => {
		if (fetchedUser === undefined) return;

		if (fetchedUser === null) {
			setShouldCreateUser(true);
		} else {
			storeUser(fetchedUser);
		}
	}, [fetchedUser]);

	useEffect(() => {
		if (shouldCreateUser && supabaseUser?.id) {
			createUser.mutate();
			return;
		}
	}, [shouldCreateUser, supabaseUser?.id]);

	useEffect(() => {
		if (shouldCreateProfile && user?.id) {
			createProfile.mutate();
			return;
		}
	}, [shouldCreateProfile, supabaseUser?.id]);

	return (
		<main className="flex items-center justify-center bg-background w-full min-h-screen">
			<div className="flex items-center">
				<svg className="animate-spin h-8 w-8 text-white mr-4" fill="none" viewBox="0 0 24 24">
					<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
					<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
				</svg>
				<span className="text-2xl text-white">Logging in...</span>
			</div>
		</main>
	);
}

export default LoadingPage;