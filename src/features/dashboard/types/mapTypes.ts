export type MapCasesFilterProp = {
	search?: string;
	statusFilter?: 'All' | 'Active' | 'Critical' | 'Stable' | 'Transferred' | 'Closed';
	severityFilter?: 'All' | 'Mild' | 'Moderate' | 'Severe' | 'Critical';
}