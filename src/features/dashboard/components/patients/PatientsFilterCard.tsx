import { useEffect, useState } from "react";
import { Search } from "lucide-react";

import { useDebounce } from "@/hooks/useDebounce";

import { Input } from "@/components/ui/input";
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import type { PatientFilterProp } from "@/features/dashboard/types/patientTypes";

type PatientFilterCardProp = {
	onChange: (filters: PatientFilterProp) => void;
}

const PatientsFilterCard = ({ onChange }: PatientFilterCardProp) => {
	const [search, setSearch] = useState<PatientFilterProp['search']>();
	const debouncedSearch = useDebounce(search);

	const [sexFilter, setSexFilter] = useState<PatientFilterProp['sexFilter']>();
	const [sortDirection, setSortDirection] = useState<PatientFilterProp['sortDirection']>();

	useEffect(() => {
		onChange({
			search: debouncedSearch,
			sexFilter,
			sortDirection,
		});
	}, [debouncedSearch, sexFilter, sortDirection])

	return (
		<Card>
			<CardContent className="p-4">
				<div className="flex flex-col sm:flex-row gap-4">
					<div className="flex-1 relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
						<Input
							placeholder="Search patients by ID, name, contact, or medical history..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className="pl-10"
						/>
					</div>

					<Select value={sexFilter} onValueChange={(e) => setSexFilter(e as PatientFilterProp['sexFilter'])}>
						<SelectTrigger className="w-full sm:w-48">
							<SelectValue placeholder="Filter by sex" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All</SelectItem>
							<SelectItem value="Male">Male</SelectItem>
							<SelectItem value="Female">Female</SelectItem>
							<SelectItem value="Other">Other</SelectItem>
						</SelectContent>
					</Select>

					<Select
						value={sortDirection}
						onValueChange={(e) => setSortDirection(e as PatientFilterProp['sortDirection'])}
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

export default PatientsFilterCard;