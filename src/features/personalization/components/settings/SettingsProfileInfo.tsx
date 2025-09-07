import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { RefreshCw, User } from "lucide-react";

import { useProfile } from "@/context/useProfile";
import { useAuth } from "@/context/useAuth";
import { showToast } from "@/lib/showToast";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { updateProfileFormSchema, type UpdateProfileFormFieldProp } from "@/features/personalization/types/settingsTypes";
import type { ProfileProp } from "@/features/personalization/types/profileTypes";

import { fetchProfile } from "@/features/personalization/services/profileServices";
import { updateProfileInfo } from "@/features/personalization/services/settingsServices";

const SettingsProfileInfo = () => {
	const { user } = useAuth();
	const { profile, storeProfile } = useProfile();
	const [isLoading, setIsLoading] = useState<boolean>(false);

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

			reset({
				first_name: profileData.first_name ?? '',
				last_name: profileData.last_name ?? '',
				birth_date: profileData.birth_date ?? '',
				address: profileData.address ?? '',
				email: profileData.email ?? '',
				phone: profileData.phone ?? '',
				sex: profileData.sex ?? '',
				middle_name: profileData.middle_name ?? '',
				suffix: profileData.suffix ?? '',
			});
		}
	}, [profileData, isLoadingProfile]);

	const { register, handleSubmit, reset, control, formState: { errors } } = useForm<UpdateProfileFormFieldProp>({
		defaultValues: {
			first_name: '',
			last_name: '',
			birth_date: '',
			address: '',
			email: '',
			phone: '',
			sex: profile?.sex ?? '',
			middle_name: '',
			suffix: '',
		},
		resolver: zodResolver(updateProfileFormSchema),
	});

	const onSubmit: SubmitHandler<UpdateProfileFormFieldProp> = async (data) => {
		if (!data) {
			showToast({
				title: "Data is Empty!",
				description: "Please populate the update information form.",
				variant: "warning"
			});
			return;
		}

		if (!profile?.id) {
			showToast({
				title: "Something went Wrong!",
				description: "Unable to complete this update.",
				variant: "error"
			});
			return;
		}
		setIsLoading(true);

		const response = await updateProfileInfo(profile.id, data);

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

	return (
		<>
			{(profile) && isLoadingProfile ? (
				<div className="h-75 w-full bg-muted rounded" />
			) : (
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<User className="w-5 h-5" />
								Profile Info
							</CardTitle>
							<CardDescription>Basic profile information</CardDescription>
						</CardHeader >

						<CardContent className="space-y-4">
							<div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
								<div className="space-y-2">
									<Label htmlFor="first_name">First Name</Label>
									<Input
										{...register("first_name")}
										type="text"
										placeholder="Enter first name..."
									/>

									{errors.first_name && (
										<p className="text-sm text-red-600 mt-1">
											{errors.first_name.message}
										</p>
									)}
								</div>

								<div className="space-y-2">
									<Label htmlFor="middleName">Middle Name</Label>
									<Input
										{...register("middle_name")}
										type="text"
										placeholder="Enter middle name..."
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="lastName">Last Name</Label>
									<Input
										{...register("last_name")}
										type="text"
										placeholder="Enter last name..."
									/>

									{errors.last_name && (
										<p className="text-sm text-red-600 mt-1">
											{errors.last_name.message}
										</p>
									)}
								</div>

								<div className="space-y-2">
									<Label htmlFor="suffix">Suffix</Label>
									<Input
										{...register("suffix")}
										type="text"
										placeholder="Enter suffix..."
									/>
								</div>
							</div>

							<div className="mb-6 grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="sex">Gender</Label>
									<Controller
										name="sex"
										control={control}
										render={({ field }) => (
											<Select onValueChange={field.onChange} value={field.value}>
												<SelectTrigger>
													<SelectValue placeholder="Select gender" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="male">Male</SelectItem>
													<SelectItem value="female">Female</SelectItem>
													<SelectItem value="other">Other</SelectItem>
												</SelectContent>
											</Select>
										)}
									/>

									{errors.sex && (
										<p className="text-sm text-red-600 mt-1">
											{errors.sex.message}
										</p>
									)}
								</div>

								<div className="space-y-2">
									<Label htmlFor="birth_date">Date of Birth</Label>
									<Controller
										name="birth_date"
										control={control}
										render={({ field }) => (
											<DatePicker
												value={field.value}
												onChange={(e) => field.onChange(e.target.value)}
												onBlur={field.onBlur}
												name={field.name}
											/>
										)}
									/>

									{errors.birth_date && (
										<p className="text-sm text-red-600 mt-1">
											{errors.birth_date.message}
										</p>
									)}
								</div>
							</div>

							<div className="mb-6 grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="email">Email Address</Label>
									<Input
										{...register("email")}
										type="email"
										placeholder="Enter email address..."
									/>

									{errors.email && (
										<p className="text-sm text-red-600 mt-1">
											{errors.email.message}
										</p>
									)}
								</div>

								<div className="space-y-2">
									<Label htmlFor="phone">Phone Number</Label>
									<Input
										{...register("phone")}
										type="text"
										placeholder="Enter phone number..."
									/>

									{errors.phone && (
										<p className="text-sm text-red-600 mt-1">
											{errors.phone.message}
										</p>
									)}
								</div>
							</div>

							<div>
								<div className="space-y-2">
									<Label htmlFor="address">Address</Label>
									<Input
										{...register("address")}
										type="text"
										placeholder="Enter current address..."
									/>
								</div>

								{errors.address && (
									<p className="text-sm text-red-600 mt-1">
										{errors.address.message}
									</p>
								)}
							</div>
						</CardContent>
					</Card >

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

export default SettingsProfileInfo;