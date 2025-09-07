import { useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Filter, RefreshCw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import MapFilter from '@/features/dashboard/components/map/MapFilter';
import MapCard from '@/features/dashboard/components/map/MapCard';

import type { CaseProp } from '@/features/dashboard/types/casesTypes';
import type { MapCasesFilterProp } from '@/features/dashboard/types/mapTypes';
import { fetchMapCases } from '@/features/dashboard/services/mapServices';

// Fix Leaflet default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
	iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
	iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
	shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapPage = () => {
	const [search, setSearch] = useState<MapCasesFilterProp['search']>();
	const [statusFilter, setStatusFilter] = useState<MapCasesFilterProp['statusFilter']>();
	const [severityFilter, setSeverityFilter] = useState<MapCasesFilterProp['severityFilter']>();

	const { data: mapData, isFetching, refetch } = useQuery({
		queryKey: ['map', { search, statusFilter, severityFilter }],
		queryFn: () => fetchMapCases({ search, statusFilter, severityFilter }),
		initialData: [] as CaseProp[],
		refetchOnMount: (query) => !query.state.data || query.state.data.length === 0,
	});

	const [showFilters, setShowFilters] = useState(false);

	const handleOnRefresh = async () => {
		setSearch("");
		setStatusFilter("All");
		setSeverityFilter("All");
		await refetch();
	}

	return (
		<div className="p-6 space-y-6">
			{/* Header */}
			<div className="flex flex-col gap-4">
				<div className="flex justify-between items-center">
					<div className="flex items-center gap-3">
						<div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
							<MapPin className="w-6 h-6 text-primary" />
						</div>

						<div>
							<h1 className="text-xl font-bold text-foreground">Emergency Cases Map</h1>
							<p className="text-muted-foreground">Visualize incident locations and case details</p>
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
					<MapFilter
						onChange={(filters) => {
							setSearch(filters.search);
							setStatusFilter(filters.statusFilter);
							setSeverityFilter(filters.severityFilter);
						}}
					/>
				}
			</div>


			{/* Map */}
			{isFetching ? (
				<div className="animate-pulse space-y-4">
					<div className="flex items-center justify-center bg-muted rounded h-[600px] w-full">
						<RefreshCw className={`h-6 w-6 mr-4 ${isFetching ? "animate-spin" : ""}`} />
						<h2 className='text-2xl'>Loading...</h2>
					</div>
				</div>
			) : (
				<MapCard allCases={mapData} />
			)}
		</div >
	);
}

export default MapPage;