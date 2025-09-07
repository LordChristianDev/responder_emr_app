import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { Save, MapPin, User, RefreshCw } from "lucide-react";

import { useProfile } from "@/context/useProfile";
import { useRoutes } from "@/hooks/useRoutes";
import { cn } from "@/lib/utils";
import { showToast } from "@/lib/showToast";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import BodyDiagram from "@/features/dashboard/components/BodyDiagram";

import { addCaseFormSchema, type AddCaseFormFieldProp, type CaseLists } from "@/features/dashboard/types/casesTypes";
import { createNewCase, fetchAddCaseLists } from "@/features/dashboard/services/casesServices";

const AddCaseForm = () => {
	const { move } = useRoutes();
	const { profile } = useProfile();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [lists, setLists] = useState<CaseLists>({
		interventions: [],
		injuries: [],
		sides: ['Front', 'Back'],
		severities: ['Mild', 'Moderate', 'Severe', 'Critical'],
	});

	const { data: caseList, isFetching: isLoadingLists } = useQuery({
		queryKey: ['lists'],
		queryFn: async () => {
			const response = await fetchAddCaseLists();

			if (!response) {
				console.error(`Failed to fetch profile: ${response}`);
				return null;
			}

			return response as CaseLists;
		},
		refetchOnMount: false,
	});

	const {
		register, handleSubmit, getValues, setValue, watch,
		control, formState: { errors }
	} = useForm<AddCaseFormFieldProp>({
		defaultValues: {
			first_name: "",
			last_name: "",
			sex: "",
			date_time: "",
			location: "",
			cause: "",

			age: undefined,
			description: "",
			middle_name: "",
			suffix: "",
			contact_info: "",
			with_medical_history: false,
			medical_history: "",

			injuries: [],
			interventions: [],
		},
		resolver: zodResolver(addCaseFormSchema)
	});

	useEffect(() => {
		if (caseList && !isLoadingLists) {
			setLists(caseList);
		}
	}, [caseList, isLoadingLists]);

	const onSubmit: SubmitHandler<AddCaseFormFieldProp> = async (data) => {
		if (!data) {
			showToast({
				title: "Form is empty!",
				description: "Please populate the case information form.",
				variant: "warning"
			});
			return;
		}

		if (!profile?.id) {
			showToast({
				title: "Something went Wrong!",
				description: "Unable to complete this without an identifier.",
				variant: "error"
			});
			return;
		}
		setIsLoading(true);

		const response = await createNewCase(profile.id, data);

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
			title: "Case Saved Successfully",
			description: "Patient information has been documented securely.",
			variant: "success"
		});
		move('/dashboard')
	}

	const renderIntervention = lists.interventions.map((int) => {
		const { id, value, title } = int;

		return (
			<div key={id} className="flex items-center space-x-2">
				<Checkbox
					id={value}
					value={value}
					{...register("interventions")}
					onCheckedChange={(checked) => {
						const currentValues = getValues("interventions") || [];
						if (checked) {
							setValue("interventions", [...currentValues, value]);
						} else {
							setValue("interventions", currentValues.filter(item => item !== value));
						}
					}}
				/>
				<Label htmlFor={value}>{title}</Label>
			</div>
		);
	});

	return (
		<>
			{isLoadingLists ? (
				<div className="space-y-6">
					<div className="h-75 w-full bg-muted rounded" />
					<div className="h-64 w-full bg-muted rounded" />
					<div className="h-75 w-full bg-muted rounded" />
				</div>
			) : (
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6" >
					{/* Patient Information */}
					< Card className="medical-card" >
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<User className="w-5 h-5" />
								Patient Information
							</CardTitle>
							<CardDescription>Basic patient details and medical history</CardDescription>
						</CardHeader>

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

							<div className="mb-6 grid grid-cols-3 gap-4">
								<div className="space-y-2">
									<Label htmlFor="age">Age</Label>
									<Input
										{...register("age", {
											setValueAs: (value) => value === undefined ? undefined : Number(value),
										})}
										type="number"
										placeholder="Enter age..."
									/>

									{errors.age && (
										<p className="text-sm text-red-600 mt-1">
											{errors.age.message}
										</p>
									)}
								</div>

								<div className="space-y-2">
									<Label htmlFor="sex">Sex</Label>
									<Controller
										name="sex"
										control={control}
										render={({ field }) => (
											<Select onValueChange={field.onChange} value={field.value}>
												<SelectTrigger>
													<SelectValue placeholder="Select sex..." />
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
									<Label htmlFor="contactInfo">Contact Information (if available)</Label>
									<Input
										{...register("contact_info")}
										type="text"
										placeholder="Emergency contact information..."
									/>
								</div>
							</div>

							<div className="space-y-2">
								<div className={cn("flex items-center space-x-2",
									watch("with_medical_history") ? "mb-6" : ""
								)}>
									<Controller
										name="with_medical_history"
										control={control}
										render={({ field }) => (
											<Checkbox
												id="with_medical_history"
												checked={field.value || false}
												onCheckedChange={field.onChange}
											/>
										)}
									/>
									<Label htmlFor="with_medical_history">
										Known medical history or medications
									</Label>
								</div>

								{watch("with_medical_history") && (
									<div className="space-y-2">
										<Label htmlFor="medical_history">Medical History</Label>
										<Input
											{...register("medical_history")}
											type="text"
											placeholder="Enter medical history..."
										/>
									</div>

								)}
							</div>
						</CardContent>
					</Card >

					{/* Incident Details */}
					<Card className="medical-card" >
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<MapPin className="w-5 h-5" />
								Incident Details
							</CardTitle>
							<CardDescription>When, where, and how the incident occurred</CardDescription>

						</CardHeader>

						<CardContent className="space-y-4">
							<div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="datetime">Date & Time</Label>
									<DateTimePicker {...register("date_time")} />

									{errors.date_time && (
										<p className="text-sm text-red-600 mt-1">
											{errors.date_time.message}
										</p>
									)}
								</div>

								<div className="space-y-2">
									<Label htmlFor="cause">Cause of Injury</Label>
									<Input
										{...register("cause")}
										type="cause"
										placeholder="Enter cause of injury..."
									/>

									{errors.cause && (
										<p className="text-sm text-red-600 mt-1">
											{errors.cause.message}
										</p>
									)}
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="cause">Description of Incident</Label>
								<Textarea
									{...register("description")}
									placeholder="Enter description..."
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="location">Location</Label>
								<Input
									{...register("location")}
									type="text"
									placeholder="Street address or GPS coordinates..."
								/>


								{errors.location && (
									<p className="text-sm text-red-600 mt-1">
										{errors.location.message}
									</p>
								)}
							</div>
						</CardContent>
					</Card >

					{/* Injury Mapping */}
					< Card className="medical-card" >
						<CardHeader>
							<CardTitle>Injury Assessment</CardTitle>
							<CardDescription>Mark injury locations and severity on the body diagram</CardDescription>
							{errors.injuries && (
								<p className="text-sm text-red-600 mt-1">
									{errors.injuries.message}
								</p>
							)}
						</CardHeader>

						<CardContent>
							<Controller
								name="injuries"
								control={control}
								render={({ field }) => (
									<BodyDiagram
										lists={lists}
										formInjuries={field.value}
										onChange={field.onChange}
									/>
								)}
							/>
						</CardContent>
					</Card >

					{/* Interventions */}
					< Card className="medical-card" >
						<CardHeader>
							<CardTitle>Medical Interventions</CardTitle>
							<CardDescription>Select all interventions performed</CardDescription>
							{errors.interventions && (
								<p className="text-sm text-red-600 mt-1">
									{errors.interventions.message}
								</p>
							)}
						</CardHeader>

						<CardContent>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{renderIntervention}
							</div>
						</CardContent>
					</Card >

					{/* Submit */}
					<div className="flex gap-4" >
						<Button
							type="button"
							variant="outline"
							onClick={() => move("/dashboard")}
							className="flex-1 cursor-pointer"
						>
							Cancel
						</Button>

						<Button
							type="submit"
							className="flex-1 medical-gradient text-white font-semibold cursor-pointer"
						>
							{isLoading ? (
								<RefreshCw className="mr-2 h-4 w-4 animate-spin" />
							) : (
								<Save className="mr-2 w-4 h-4" />
							)}
							Save Case
						</Button>
					</div >
				</form >
			)}
		</>
	);
}

export default AddCaseForm;
