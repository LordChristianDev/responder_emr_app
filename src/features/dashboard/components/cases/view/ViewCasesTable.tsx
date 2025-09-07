import { Eye, Calendar, MapPin, User, Activity } from 'lucide-react';

import { useCase } from '@/context/useCase';
import { useRoutes } from '@/hooks/useRoutes';
import { formatDate, formatTime, getSeverityColor, getStatusColor } from '@/lib/utils';

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import type { CaseProp } from '@/features/dashboard/types/casesTypes';

type ViewCasesPaginationProp = {
	allCases: CaseProp[];
	loading: boolean;
}

const ViewCasesTable = ({ allCases, loading }: ViewCasesPaginationProp) => {
	const { move } = useRoutes();
	const { setCaseNumber } = useCase();

	const renderCases = allCases.map((caseData) => {
		const { id, case_number, patient_number, date_recorded, time_recorded, location, cause, interventions, status, injuries } = caseData;

		const date = formatDate(date_recorded);
		const time = formatTime(time_recorded);

		const handleOnClick = () => {
			setCaseNumber(case_number);
			move(`/case/${case_number}`);
		}

		return (
			<TableRow key={id} className="hover:bg-muted/50">
				<TableCell className="font-medium">{case_number}</TableCell>
				<TableCell>
					<div className="flex items-center gap-2">
						<User className="w-4 h-4 text-muted-foreground" />
						{patient_number}
					</div>
				</TableCell>
				<TableCell>
					<div className="flex flex-col">
						<div className="flex items-center gap-2">
							<Calendar className="w-4 h-4 text-muted-foreground" />
							<span className="text-sm">{date}</span>
						</div>
						<span className="text-xs text-muted-foreground">{time}</span>
					</div>
				</TableCell>
				<TableCell>
					<div className="flex items-center gap-2 max-w-48">
						<MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
						<span className="text-sm truncate" title={location}>
							{location}
						</span>
					</div>
				</TableCell>
				<TableCell>
					<div className="flex items-center gap-2">
						<Activity className="w-4 h-4 text-muted-foreground" />
						{cause}
					</div>
				</TableCell>
				<TableCell>
					{interventions && <div className="flex flex-wrap gap-1 max-w-32">
						{interventions.slice(0, 2).map((intervention) => (
							<Badge key={intervention} variant="outline" className="text-xs">
								{intervention}
							</Badge>
						))}
						{interventions.length > 2 && (
							<Badge variant="outline" className="text-xs">
								+{caseData.interventions.length - 2}
							</Badge>
						)}
					</div>}
				</TableCell>
				<TableCell>
					<Badge className={getSeverityColor(injuries[0].severity)}>
						{injuries[0].severity}
					</Badge>
				</TableCell>
				<TableCell>
					<Badge className={getStatusColor(status)}>
						{status}
					</Badge>
				</TableCell>
				<TableCell>
					<Button
						variant="ghost"
						size="sm"
						onClick={handleOnClick}
					>
						<Eye className="w-4 h-4" />
					</Button>
				</TableCell>
			</TableRow>
		);
	})

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead className="cursor-pointer hover:bg-muted/50">
						Case ID
					</TableHead>
					<TableHead className="cursor-pointer hover:bg-muted/50">
						Patient ID
					</TableHead>
					<TableHead className="cursor-pointer hover:bg-muted/50">
						Date/Time
					</TableHead>
					<TableHead>Location</TableHead>
					<TableHead>Cause</TableHead>
					<TableHead>Interventions</TableHead>
					<TableHead>Severity</TableHead>
					<TableHead>Status</TableHead>
					<TableHead>Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{allCases.length > 0 && !loading ?
					(renderCases) : (
						<TableRow>
							<TableCell colSpan={9} className="text-center py-4 text-sm text-gray-500">
								{loading ? "Loading cases..." : "No cases found for the specified criteria."}
							</TableCell>
						</TableRow>
					)}
			</TableBody>
		</Table>
	);
}

export default ViewCasesTable;