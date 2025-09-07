import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { PatientProp } from "@/features/dashboard/types/patientTypes";
import { itemsPerPage } from "@/features/dashboard/services/patientServices";

type PatientsPaginationProp = {
	patients: PatientProp[]
	onChange: (values: { page: number }) => void;
}

const PatientsPagination = ({ patients, onChange }: PatientsPaginationProp) => {
	const [currentPage, setCurrentPage] = useState(1);

	const startIndex = (currentPage - 1) * itemsPerPage;
	const totalPages = Math.ceil(patients.length / itemsPerPage);

	useEffect(() => {
		onChange({ page: currentPage })
	}, [currentPage]);

	const handlePrevOnChange = () => setCurrentPage(prev => Math.max(prev - 1, 1))
	const handleNextOnChange = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

	const renderTotalPages = [...Array(totalPages)].map((_, i) => {
		const handleOnClick = () => setCurrentPage(i + 1);

		return (
			<Button
				key={i}
				variant={currentPage === i + 1 ? "default" : "outline"}
				size="sm"
				onClick={handleOnClick}
				className="w-8"
			>
				{i + 1}
			</Button>
		);
	})

	return (
		<div className="py-4 flex items-center justify-between space-x-2 " >
			<div className="text-sm text-muted-foreground">
				Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, patients.length)} of {patients.length} entries
			</div>
			<div className="flex space-x-2">
				<Button
					variant="outline"
					size="sm"
					onClick={handlePrevOnChange}
					disabled={currentPage === 1}
				>
					<ChevronLeft className="w-4 h-4" />
				</Button>

				<div className="flex items-center gap-1">
					{renderTotalPages}
				</div>

				<Button
					variant="outline"
					size="sm"
					onClick={handleNextOnChange}
					disabled={currentPage === totalPages}
				>
					<ChevronRight className="w-4 h-4" />
				</Button>
			</div>
		</div >
	);
}

export default PatientsPagination;