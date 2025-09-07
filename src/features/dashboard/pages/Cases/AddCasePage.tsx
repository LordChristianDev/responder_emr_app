import { AlertTriangle } from "lucide-react";

import AddCaseForm from "@/features/dashboard/components/cases/add/AddCaseForm";

const AddCasePage = () => {
	return (
		<div className="mx-auto p-6">
			<div className="mb-6">
				<h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
					<AlertTriangle className="w-8 h-8 text-emergency" />
					New Emergency Case
				</h1>
				<p className="text-muted-foreground mt-1">Document patient information and medical interventions</p>
			</div>

			{/* Add Case Form */}
			<AddCaseForm />
		</div>
	);
}

export default AddCasePage;