import { useState } from "react";
import type { ControllerRenderProps } from "react-hook-form";
import { X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import type { CertificationProp } from "@/features/personalization/types/profileTypes";

type FormValues = {
	responderNumber: string;
	organization: number;
	responderRole: number;
	certifications: number[];
};

export type SettingsCertAddProp = {
	certificationList: CertificationProp[];
	field: ControllerRenderProps<FormValues, "certifications">;
};

const SettingsCertAdd = ({ certificationList, field }: SettingsCertAddProp) => {
	const [isOpen, setIsOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');

	const selectedIds = field.value || [];
	const selectedCerts = certificationList.filter(
		(cert) => selectedIds.includes(cert.id)
	);

	const filteredCerts = certificationList.filter(
		(cert) =>
			!selectedIds.includes(cert.id) &&
			cert.name.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const addCertification = (certId: number) => {
		field.onChange([...selectedIds, certId]);
		setSearchTerm('');
	};

	const removeCertification = (certId: number) => {
		field.onChange(selectedIds.filter(id => id !== certId));
	};

	const renderFilteredCerts = filteredCerts.map((cert) => {
		const { id, name, description } = cert;

		const handleOnMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
			e.preventDefault();
			addCertification(cert.id);
		}

		return (
			<div
				key={id}
				className="p-2 hover:bg-muted cursor-pointer border-b last:border-b-0"
				onMouseDown={handleOnMouseDown}
			>
				<div className="font-medium text-sm">{name}</div>
				<div className="text-xs text-muted-foreground truncate">
					{description}
				</div>
			</div>
		);
	})

	const renderSelectedCerts = selectedCerts.map((cert) => {
		const { id, name, description, organization, expiry_duration } = cert;

		const handleOnRemove = () => removeCertification(id);

		return (
			<div key={id} className="relative">
				<Card>
					<CardHeader>
						<CardTitle className="text-base">{name}</CardTitle>
						<CardDescription>
							{description}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="text-sm text-muted-foreground">
							<p><span className="font-medium">Issuer:</span> {organization}</p>
							<p><span className="font-medium">Expires:</span> {expiry_duration} years</p>
						</div>
					</CardContent>
				</Card>

				<Button
					size="icon"
					onClick={handleOnRemove}
					className="absolute -top-2 -right-2 rounded-full bg-red-500 text-primary-foreground w-8 h-8 shadow-medium hover:scale-105 transition-smooth cursor-pointer"
				>
					<X className="h-4 w-4" />
				</Button>
			</div>
		);
	})

	return (
		<>
			<div className="space-y-2">
				{/* Search input - Fixed approach */}
				<div className="relative">
					<Input
						placeholder="Search and add certifications..."
						value={searchTerm}
						onChange={(e) => {
							setSearchTerm(e.target.value);
							setIsOpen(true);
						}}
						onBlur={() => setTimeout(() => setIsOpen(false), 150)}
						onFocus={() => setIsOpen(true)}

					/>

					{isOpen && (
						<div className="absolute top-full left-0 right-0 z-50 mt-1 bg-popover border border-border rounded-md shadow-md">
							<div className="max-h-60 overflow-auto">
								{filteredCerts.length > 0 ? (
									<>
										{renderFilteredCerts}
									</>
								) : (
									<div className="p-2 text-sm text-muted-foreground">
										{searchTerm ? 'No certifications found' : 'Start typing to search...'}
									</div>
								)}
							</div>
						</div>
					)}
				</div>
			</div>

			{selectedCerts.length > 0 && (
				<div className="mt-4 space-y-2">
					<h4 className="text-sm font-medium">Selected Certifications:</h4>
					{renderSelectedCerts}
				</div>
			)}
		</>
	);
}

export default SettingsCertAdd;