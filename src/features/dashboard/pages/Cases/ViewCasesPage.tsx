import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FileText, RefreshCw, Filter } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ViewCasesTable from '@/features/dashboard/components/cases/view/ViewCasesTable';
import ViewCasesPagination from '@/features/dashboard/components/cases/view/ViewCasesPagination';
import ViewCasesFilterCard from '@/features/dashboard/components/cases/view/ViewCasesFilterCard';

import type { CaseProp, ViewCasesFilterProp } from "@/features/dashboard/types/casesTypes";
import { fetchFilteredCases, itemsPerPage } from '@/features/dashboard/services/casesServices';

const ViewCasesPage = () => {
	const [search, setSearch] = useState<ViewCasesFilterProp['search']>();
	const [statusFilter, setStatusFilter] = useState<ViewCasesFilterProp['statusFilter']>();
	const [severityFilter, setSeverityFilter] = useState<ViewCasesFilterProp['severityFilter']>();
	const [sortDirection, setSortDirection] = useState<ViewCasesFilterProp['sortDirection']>();

	const { data, isFetching, refetch } = useQuery({
		queryKey: ['cases', { search, statusFilter, severityFilter, sortDirection }],
		queryFn: () => fetchFilteredCases({ search, statusFilter, severityFilter, sortDirection }),
		initialData: [] as CaseProp[],
		refetchOnMount: (query) => !query.state.data || query.state.data.length === 0,
	});

	const [showFilters, setShowFilters] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);

	const totalPages = Math.ceil(data.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const paginatedCases = data.slice(startIndex, startIndex + itemsPerPage);

	const handleOnRefresh = async () => {
		setSearch("");
		setStatusFilter("All");
		setSeverityFilter("All");
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
							<FileText className="w-6 h-6 text-primary" />
						</div>
						<div>
							<h1 className="text-xl font-bold text-foreground">Cases Management</h1>
							<p className="text-muted-foreground">Track and manage all emergency cases</p>
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
					<ViewCasesFilterCard
						onChange={(filters) => {
							setSearch(filters.search);
							setStatusFilter(filters.statusFilter);
							setSeverityFilter(filters.severityFilter);
							setSortDirection(filters.sortDirection);
						}}
					/>
				}
			</div>

			{/* Cases Table */}
			<Card>
				<CardHeader>
					<CardTitle>Emergency Cases ({data.length})</CardTitle>
					<CardDescription>
						Comprehensive list of all registered emergency cases with detailed information
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="rounded-md border">
						<ViewCasesTable
							allCases={paginatedCases}
							loading={isFetching}
						/>
					</div>

					{/* Pagination */}
					{totalPages > 1 && (
						<ViewCasesPagination
							cases={data}
							onChange={(values) => {
								setCurrentPage(values.page);
							}}
						/>
					)}
				</CardContent>
			</Card>
		</div>
	);
}

export default ViewCasesPage;