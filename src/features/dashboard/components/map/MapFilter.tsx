import { useEffect, useState } from "react";
import { Search } from "lucide-react";

import { useDebounce } from "@/hooks/useDebounce";

import { Input } from "@/components/ui/input";
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import type { MapCasesFilterProp } from "@/features/dashboard/types/mapTypes";

type MapFilterProp = {
	onChange: (filters: MapCasesFilterProp) => void;
}

const MapFilter = ({ onChange }: MapFilterProp) => {
	const [search, setSearch] = useState<MapCasesFilterProp['search']>();
	const debouncedSearch = useDebounce(search);

	const [statusFilter, setStatusFilter] = useState<MapCasesFilterProp['statusFilter']>();
	const [severityFilter, setSeverityFilter] = useState<MapCasesFilterProp['severityFilter']>();

	useEffect(() => {
		onChange({
			search: debouncedSearch,
			statusFilter,
			severityFilter,
		});
	}, [debouncedSearch, statusFilter, severityFilter])

	return (
		<Card>
			<CardContent className="p-4">
				<div className="flex flex-col sm:flex-row gap-4">
					<div className="flex-1 relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
						<Input
							placeholder="Search by patient, location, or cause..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className="pl-10"
						/>
					</div>

					<Select value={statusFilter} onValueChange={(e) => setStatusFilter(e as MapCasesFilterProp['statusFilter'])}>
						<SelectTrigger className="w-full sm:w-48">
							<SelectValue placeholder="Filter by status" />
						</SelectTrigger>
						<SelectContent >
							<SelectItem value="All">All Statuses</SelectItem>
							<SelectItem value="Active">Active</SelectItem>
							<SelectItem value="Critical">Critical</SelectItem>
							<SelectItem value="Stable">Stable</SelectItem>
							<SelectItem value="Transferred">Transferred</SelectItem>
							<SelectItem value="Closed">Closed</SelectItem>
						</SelectContent>
					</Select>

					<Select value={severityFilter} onValueChange={(e) => setSeverityFilter(e as MapCasesFilterProp['severityFilter'])}>
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
				</div>
			</CardContent>
		</Card>
	);
}

export default MapFilter;