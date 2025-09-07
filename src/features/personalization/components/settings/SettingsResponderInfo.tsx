import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { File, RefreshCw, UserLock } from "lucide-react";

import { useAuth } from "@/context/useAuth";
import { useProfile } from "@/context/useProfile";
import { showToast } from "@/lib/showToast";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SettingsCertAdd from "@/features/personalization/components/settings/SettingsCertAdd";

import type { ProfileProp } from "@/features/personalization/types/profileTypes";
import type { UpdateCredentialFormFieldProp, UpdateProfileLists } from "@/features/personalization/types/settingsTypes";
import { fetchProfile } from "@/features/personalization/services/profileServices";
import { fetchUpdateProfileLists, updateCredentialsInfo } from "@/features/personalization/services/settingsServices";


const SettingsResponderInfo = () => {
	const { user } = useAuth();
	const { profile, storeProfile } = useProfile();
	const [isLoading, setIsLoading] = useState(false);
	const [lists, setLists] = useState<UpdateProfileLists>({
		organizationList: [],
		responderList: [],
		certificationList: [],
	});

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
		refetchOnMount: false,
	});

	const { data: profileLists, isFetching: isLoadingLists } = useQuery({
		queryKey: ['lists'],
		queryFn: async () => {
			const response = await fetchUpdateProfileLists();

			if (!response) {
				console.error(`Failed to fetch profile: ${response}`);
				return null;
			}

			return response as UpdateProfileLists;
		},
		refetchOnMount: (query) => !query.state.data,
	});

	useEffect(() => {
		if (profileData && !isLoadingProfile) {
			storeProfile(profileData);

			if (!profileData.certifications || profileData.certifications?.length === 0) {
				reset({
					responderNumber: profileData.responder_number ?? '',
					organization: profileData.organization_id ?? -1,
					responderRole: profileData.responder_role_id ?? -1,
					certifications: [],
				});
			} else {
				const ids = profileData.certifications.map(p => p.id);
				reset({
					responderNumber: profileData.responder_number ?? '',
					organization: profileData.organization_id ?? -1,
					responderRole: profileData.responder_role_id ?? -1,
					certifications: ids,
				});
			}
		}
	}, [profileData, isLoadingProfile]);

	useEffect(() => {
		if (profileLists && !isLoadingLists) {
			setLists(profileLists);
		}
	}, [profileLists, isLoadingLists]);

	const { register, handleSubmit, reset, control, formState: { errors } } = useForm<UpdateCredentialFormFieldProp>({
		defaultValues: {
			responderNumber: '',
			organization: profile?.organization_id ?? -1,
			responderRole: profile?.responder_role_id ?? -1,
			certifications: [],
		}
	});

	const onSubmit: SubmitHandler<UpdateCredentialFormFieldProp> = async (data) => {
		setIsLoading(true);
		if (!data) {
			showToast({
				title: "Data is Empty!",
				description: "Please populate the update information form.",
				variant: "warning"
			});
			setIsLoading(false);
			return;
		}

		if (!profile?.id) {
			showToast({
				title: "Something went Wrong!",
				description: "Unable to complete this update.",
				variant: "error"
			});
			setIsLoading(false);
			return;
		}

		const response = await updateCredentialsInfo(profile.id, profile.user_id, data);

		if (!response) {
			showToast({
				title: "Updated Failed!",
				description: "Failed to update profile information.",
				variant: "error"
			});
			setIsLoading(false);
			return;
		}

		showToast({
			title: "Updated Profile Successfully",
			description: "Patient information has been updated.",
			variant: "success"
		});
		setIsLoading(false);
		refetch();
	}

	const renderOrganization = lists.organizationList.map((org) => {
		const { id, name } = org;
		return (
			<SelectItem key={name} value={id.toString()}>{name}</SelectItem >
		);
	})

	const renderResponderRoles = lists.responderList.map((responder) => {
		const { id, title } = responder;
		return (
			<SelectItem key={title} value={id.toString()}>{title}</SelectItem >
		);
	})

	return (
		<>
			{(profile) && isLoadingProfile || isLoadingLists ? (
				<div className="h-75 w-full bg-muted rounded" />
			) : (
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<UserLock className="w-5 h-5" />
								Responder Details
							</CardTitle>
							<CardDescription>Setup your responder details</CardDescription>
						</CardHeader >

						<CardContent className="space-y-4">
							<div className="mb-6 space-y-2">
								<Label htmlFor="responderNumber">Responder ID</Label>
								<Input
									{...register("responderNumber")}
									type="text"
									placeholder="Enter responder id..."
								/>

								{errors.responderNumber && (
									<p className="text-sm text-red-600 mt-1">
										{errors.responderNumber.message}
									</p>
								)}
							</div>

							<div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="organization">Organization</Label>

									<Controller
										name="organization"
										control={control}
										render={({ field }) => (
											<Select
												onValueChange={(value) => {
													if (value === "" || value === "-1") {
														field.onChange(-1);
													} else {
														field.onChange(Number(value));
													}
												}}
												value={field.value === -1 || field.value === undefined ? "" : field.value?.toString()}
											>
												<SelectTrigger>
													<SelectValue placeholder="Select organization" />
												</SelectTrigger>
												<SelectContent>
													{renderOrganization}
												</SelectContent>
											</Select>
										)}
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="responderRole">Responder Role</Label>
									<Controller
										name="responderRole"
										control={control}
										render={({ field }) => (
											<Select
												onValueChange={(value) => {
													if (value === "" || value === "-1") {
														field.onChange(-1);
													} else {
														field.onChange(Number(value));
													}
												}}
												value={field.value === -1 || field.value === undefined ? "" : field.value?.toString()}
											>
												<SelectTrigger>
													<SelectValue placeholder="Select responder role" />
												</SelectTrigger>
												<SelectContent>
													{renderResponderRoles}
												</SelectContent>
											</Select>
										)}
									/>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<File className="w-5 h-5" />
								Certifications
							</CardTitle>
							<CardDescription>Certifications and credentials information</CardDescription>
						</CardHeader >

						<CardContent className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="certifications">Certifications</Label>
								<Controller
									name="certifications"
									control={control}
									render={({ field }) => (
										<SettingsCertAdd
											certificationList={lists.certificationList}
											field={field}
										/>
									)}
								/>
							</div>
						</CardContent>
					</Card>

					<Button
						type="submit"
						className="flex bg-primary hover:bg-blue-600 cursor-pointer"
					>
						{isLoading && <RefreshCw className="h-6 w-6 mr-4 animate-spin" />}
						<span className="p-18-semibold text-white">Save Changes</span>
					</Button>
				</form >
			)}
		</>
	);
}

export default SettingsResponderInfo;