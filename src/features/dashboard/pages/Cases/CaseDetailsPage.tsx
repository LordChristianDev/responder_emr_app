import { useQuery } from "@tanstack/react-query";
import { FileText } from "lucide-react";

import { useCase } from "@/context/useCase";

import { Button } from "@/components/ui/button";

import CaseDetailsPatient from "@/features/dashboard/components/cases/details/CaseDetailsPatient";
import CaseDetailsIncident from "@/features/dashboard/components/cases/details/CaseDetailsIncident";
import CaseDetailsInjuries from "@/features/dashboard/components/cases/details/CaseDetailsInjuries";
import CaseDetailsInterventions from "@/features/dashboard/components/cases/details/CaseDetailsInterventions";
import CaseDetailsStatus from "@/features/dashboard/components/cases/details/CaseDetailsStatus";
import CaseDetailsResponder from "@/features/dashboard/components/cases/details/CaseDetailsResponder";

import type { CaseDetailsProp } from "@/features/dashboard/types/casesTypes";
import { fetchCaseDetails } from "@/features/dashboard/services/casesServices";

const CaseDetailsPage = () => {
	const { caseNumber } = useCase()

	const { data, isFetching, } = useQuery({
		queryKey: ['caseData', caseNumber],
		queryFn: () => fetchCaseDetails(caseNumber),
		initialData: {} as CaseDetailsProp,
	});

	const caseDetails = data ?? {} as CaseDetailsProp;
	const { case_number, patient, injuries, interventions, responder } = caseDetails;

	return (
		<div className="mx-auto p-6">
			{isFetching ? (
				<div className="p-6">
					{/* Skeleton loader */}
					<div className="animate-pulse space-y-4">
						<div className="h-6 w-1/3 bg-muted rounded"></div>
						<div className="h-4 w-1/2 bg-muted rounded"></div>
						<div className="h-48 w-full bg-muted rounded"></div>
					</div>
				</div>
			) : (
				<>
					{/* Header */}
					<div className="flex items-center gap-4 mb-6">
						<div>
							<h1 className="text-3xl font-bold text-foreground">Case #{case_number}</h1>
							<p className="text-muted-foreground">Emergency medical record</p>
						</div>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
						{/* Main Content */}
						<div className="lg:col-span-2 space-y-6">
							{/* Patient Information */}
							<CaseDetailsPatient patient={patient} />

							{/* Incident Details */}
							<CaseDetailsIncident incident={caseDetails} />

							{/* Injuries Assessment */}
							<CaseDetailsInjuries injuries={injuries} />

							{/* Medical Interventions */}
							<CaseDetailsInterventions interventions={interventions} />
						</div>

						{/* Sidebar */}
						<div className="space-y-6">
							{/* Status Card */}
							<CaseDetailsStatus details={caseDetails} />

							{/* Responder Info */}
							<CaseDetailsResponder responder={responder} />

							{/* Actions */}
							<div className="space-y-3">
								<Button variant="outline" className="w-full">
									<FileText className="w-4 h-4 mr-2" />
									Export Report
								</Button>

								<Button variant="outline" className="w-full">
									Print Summary
								</Button>
							</div>
						</div>
					</div>
				</>
			)}
		</div>
	);

}

export default CaseDetailsPage;