
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, Filter, RefreshCw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import PatientsFilterCard from '@/features/dashboard/components/patients/PatientsFilterCard';
import PatientsTable from '@/features/dashboard/components/patients/PatientsTable';
import PatientsPagination from '@/features/dashboard/components/patients/PatientsPagination';

import type { PatientFilterProp, PatientProp } from '@/features/dashboard/types/patientTypes';
import { fetchFilteredPatients, itemsPerPage } from '@/features/dashboard/services/patientServices';

const PatientsPage = () => {
	const [search, setSearch] = useState<PatientFilterProp['search']>();
	const [sexFilter, setSexFilter] = useState<PatientFilterProp['sexFilter']>();
	const [sortDirection, setSortDirection] = useState<PatientFilterProp['sortDirection']>();

	const { data, isFetching, refetch } = useQuery({
		queryKey: ['patients', { search, sexFilter, sortDirection }],
		queryFn: () => fetchFilteredPatients({ search, sexFilter, sortDirection }),
		initialData: [] as PatientProp[],
		refetchOnMount: (query) => !query.state.data || query.state.data.length === 0,
	});

	const [showFilters, setShowFilters] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);

	// Pagination
	const totalPages = Math.ceil(data.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const paginatedPatients = data.slice(startIndex, startIndex + itemsPerPage);

	const handleOnRefresh = async () => {
		setSearch("");
		setSexFilter("All");
		setSortDirection("asc");
		await refetch();
	}

	return (
		<div className="p-6 space-y-6">
			{/* Header */}
			<div className="flex flex-col gap-4">
				<div className="flex justify-between items-center">
					<div className="flex items-center gap-3">
						<div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
							<Users className="w-6 h-6 text-primary" />
						</div>
						<div>
							<h1 className="text-xl font-bold text-foreground">Patient Database</h1>
							<p className="text-muted-foreground">Manage and track patient information</p>
						</div>
					</div>

					<div className="flex space-x-2">
						<Button
							variant="outline"
							className='cursor-pointer'
							onClick={() => setShowFilters(!showFilters)}
						>
							<Filter className="h-4 w-4 mr-2" />
							Filters
						</Button>
						<Button
							variant="outline"
							disabled={isFetching}
							className='cursor-pointer'
							onClick={handleOnRefresh}
						>
							<RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? "animate-spin" : ""}`} />
							Refresh
						</Button>
					</div>
				</div>

				{/* Filters */}
				{showFilters &&
					<PatientsFilterCard
						onChange={(filters) => {
							setSearch(filters.search);
							setSexFilter(filters.sexFilter);
							setSortDirection(filters.sortDirection);
						}}
					/>
				}
			</div>

			{/* Patients Table */}
			<Card>
				<CardHeader>
					<CardTitle>Patient Records ({data.length})</CardTitle>
					<CardDescription>
						Comprehensive database of all registered patients with medical information
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="rounded-md border">
						<PatientsTable
							patients={paginatedPatients}
							loading={isFetching}
						/>
					</div>

					{/* Pagination */}
					{totalPages > 1 && (
						<PatientsPagination
							patients={data}
							onChange={(values) => {
								setCurrentPage(values.page);
							}}
						/>
					)}
				</CardContent>
			</Card>
		</div>
	);
};

export default PatientsPage;