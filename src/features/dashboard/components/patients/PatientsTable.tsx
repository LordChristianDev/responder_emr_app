import { Calendar, Phone, User } from 'lucide-react';

import { capitalizeFirstLetter, createFullName, formatTimestampz, getAgeGroup, getAgeGroupColor } from '@/lib/utils';

import { Badge } from '@/components/ui/badge';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';

import type { PatientProp } from "@/features/dashboard/types/patientTypes";

type PatientsTableProp = {
	patients: PatientProp[]
	loading: boolean;
}

const PatientsTable = ({ patients, loading }: PatientsTableProp) => {

	const renderPatients = patients.map((patient) => {
		const { id, created_at, patient_number, first_name, last_name, age, sex, contact_info, medical_history } = patient;

		const fullName = createFullName(first_name, last_name);
		const timestamp = formatTimestampz(created_at);
		const gender = capitalizeFirstLetter(sex);

		return (
			<TableRow key={id} className="hover:bg-muted/50">
				<TableCell className="font-medium">{patient_number}</TableCell>
				<TableCell>
					<div className="flex items-center gap-2">
						<User className="w-4 h-4 text-muted-foreground" />
						<span className="font-medium">{fullName}</span>
					</div>
				</TableCell>
				<TableCell>
					<div className="flex flex-col gap-1">
						<div className="flex items-center gap-2">
							<span className="font-medium">{age}</span>
							<Badge variant="outline" className="text-xs">
								{gender}
							</Badge>
						</div>
						{age ? (
							<>
								<Badge className={`text-xs ${getAgeGroupColor(age)}`}>
									{getAgeGroup(age)}
								</Badge>
							</>

						) : (
							<Badge className={`text-xs`}>
								Not Specified
							</Badge>
						)}
					</div>
				</TableCell>
				<TableCell>
					<div className="flex flex-col gap-1">
						{contact_info ? (
							<div className="flex items-center gap-2">
								<Phone className="w-3 h-3 text-muted-foreground" />
								<span className="text-sm">{contact_info}</span>
							</div>
						) : (
							<span className="text-sm text-muted-foreground">Not provided</span>
						)}
					</div>
				</TableCell>
				<TableCell>
					<div className="max-w-64">
						{medical_history ? (
							<p className="text-sm text-muted-foreground truncate" title={medical_history}>
								{medical_history}
							</p>
						) : (
							<p className="text-sm text-muted-foreground truncate" >
								No known medial history
							</p>
						)}
					</div>
				</TableCell>
				<TableCell>
					<div className="flex items-center gap-2">
						<Calendar className="w-4 h-4 text-muted-foreground" />
						<span className="text-sm">{timestamp}</span>
					</div>
				</TableCell>

			</TableRow>
		);
	})

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead
						className="cursor-pointer hover:bg-muted/50"
					>
						Patient ID
					</TableHead>
					<TableHead
						className="cursor-pointer hover:bg-muted/50"
					>
						Name
					</TableHead>
					<TableHead
						className="cursor-pointer hover:bg-muted/50"
					>
						Age/Sex
					</TableHead>
					<TableHead>Contact Info</TableHead>
					<TableHead>Medical History</TableHead>
					<TableHead
						className="cursor-pointer hover:bg-muted/50"
					>
						Date Added
					</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{patients.length > 0 && !loading ?
					(renderPatients) : (
						<TableRow>
							<TableCell colSpan={7} className="text-center py-4 text-sm text-gray-500">
								{loading ? "Loading patients..." : "No patients found for the specified criteria."}
							</TableCell>
						</TableRow>
					)}
			</TableBody>
		</Table>
	);
}

export default PatientsTable;