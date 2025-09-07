import { useEffect, useState } from "react";
import { Search } from "lucide-react";

import { useDebounce } from "@/hooks/useDebounce";

import { Input } from "@/components/ui/input";
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { type ViewCasesFilterProp } from "@/features/dashboard/types/casesTypes";

type ViewCasesFilterCardProp = {
	onChange: (filters: ViewCasesFilterProp) => void;
}

const ViewCasesFilterCard = ({ onChange }: ViewCasesFilterCardProp) => {
	const [search, setSearch] = useState<ViewCasesFilterProp['search']>();
	const debouncedSearch = useDebounce(search);

	const [statusFilter, setStatusFilter] = useState<ViewCasesFilterProp['statusFilter']>();
	const [severityFilter, setSeverityFilter] = useState<ViewCasesFilterProp['severityFilter']>();
	const [sortDirection, setSortDirection] = useState<ViewCasesFilterProp['sortDirection']>();

	useEffect(() => {
		onChange({
			search: debouncedSearch,
			statusFilter,
			severityFilter,
			sortDirection,
		});
	}, [debouncedSearch, statusFilter, severityFilter, sortDirection])

	return (
		<Card>
			<CardContent className="p-4">
				<div className="flex flex-col sm:flex-row gap-4">
					<div className="flex-1 relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
						<Input
							placeholder="Search cases by ID, patient, location, or cause..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className="pl-10"
						/>
					</div>

					<Select
						value={statusFilter}
						onValueChange={(e) => setStatusFilter(e as ViewCasesFilterProp['statusFilter'])}
					>
						<SelectTrigger className="w-full sm:w-48">
							<SelectValue placeholder="Filter by status" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="All">All Statuses</SelectItem>
							<SelectItem value="Active">Active</SelectItem>
							<SelectItem value="Critical">Critical</SelectItem>
							<SelectItem value="Stable">Stable</SelectItem>
							<SelectItem value="Transferred">Transferred</SelectItem>
							<SelectItem value="Closed">Closed</SelectItem>
						</SelectContent>
					</Select>

					<Select
						value={severityFilter}
						onValueChange={(e) => setSeverityFilter(e as ViewCasesFilterProp['severityFilter'])}
					>
						<SelectTrigger className="w-full sm:w-48">
							<SelectValue placeholder="Filter by severity" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="All">All Severities</SelectItem>
							<SelectItem value="Mild">Mild</SelectItem>
							<SelectItem value="Moderate">Moderate</SelectItem>
							<SelectItem value="Severe">Severe</SelectItem>
							<SelectItem value="Critical">Critical</SelectItem>
						</SelectContent>
					</Select>

					<Select
						value={sortDirection}
						onValueChange={(e) => setSortDirection(e as ViewCasesFilterProp['sortDirection'])}
					>
						<SelectTrigger className="w-full sm:w-48">
							<SelectValue placeholder="Sort" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="asc">Ascending</SelectItem>
							<SelectItem value="desc">Descending</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</CardContent>
		</Card>
	);
}

export default ViewCasesFilterCard;