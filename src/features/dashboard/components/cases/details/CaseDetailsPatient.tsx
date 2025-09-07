import { User } from "lucide-react";

import { capitalizeFirstLetter, createFullName } from "@/lib/utils";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PatientProp } from "@/features/dashboard/types/patientTypes";

const CaseDetailsPatient = ({ patient }: { patient: PatientProp }) => {
	const { patient_number, first_name, last_name, sex, contact_info, medical_history } = patient;

	const fullName = createFullName(first_name, last_name);
	const gender = capitalizeFirstLetter(sex);

	return (
		<Card className="medical-card">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<User className="w-5 h-5" />
					Patient Information
				</CardTitle>
			</CardHeader>

			<CardContent className="space-y-4">
				<div className="grid grid-cols-2 gap-4">
					<div>
						<p className="text-sm font-medium text-muted-foreground">Patient #</p>
						<p className="text-lg font-semibold">{patient_number}</p>
					</div>
					<div>
						<p className="text-sm font-medium text-muted-foreground">Name</p>
						<p className="text-lg font-semibold">{fullName}</p>
					</div>
					<div>
						<p className="text-sm font-medium text-muted-foreground">Sex</p>
						<p className="text-lg">{gender}</p>
					</div>
				</div>
				{contact_info && <div>
					<p className="text-sm font-medium text-muted-foreground">Contact Information</p>
					<p>{contact_info}</p>
				</div>}

				{medical_history && <div>
					<p className="text-sm font-medium text-muted-foreground">Medical History</p>
					<p>{medical_history}</p>
				</div>}

			</CardContent>
		</Card>
	);
}

export default CaseDetailsPatient;