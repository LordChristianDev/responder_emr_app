import React, { useState, useEffect } from "react";
import { X, RotateCcw, Palette } from "lucide-react";

import { getSeverityBadgeColor } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import type { CaseLists, InjuryFormProp } from "@/features/dashboard/types/casesTypes";
import { BODY_REGIONS } from "@/features/dashboard/services/casesServices";

export type BodyDiagramSelectionProp = {
	selectedSide: 'Front' | 'Back';
	selectedType: 'Laceration' | 'Abrasion' | 'Fracture' | 'Burn' | 'Contusion' | 'Puncture' | 'Sprain' | 'Dislocation' | 'Other';
	selectedSeverity: 'Mild' | 'Moderate' | 'Severe' | 'Critical';
}

type BodyDiagramProps = {
	lists: CaseLists;
	formInjuries?: InjuryFormProp[];
	onChange?: (injuries: InjuryFormProp[]) => void;
}

const BodyDiagram: React.FC<BodyDiagramProps> = ({
	lists,
	formInjuries: initialInjuries = [],
	onChange,
}) => {
	const [injuries, setInjuries] = useState<InjuryFormProp[]>(initialInjuries);
	const [selectedInjury, setSelectedInjury] = useState<InjuryFormProp | null>(null);

	const [selectedSide, setSelectedSide] = useState<BodyDiagramSelectionProp['selectedSide']>('Front');
	const [selectedType, setSelectedType] = useState<BodyDiagramSelectionProp['selectedType']>('Laceration');
	const [selectedSeverity, setSelectedSeverity] = useState<BodyDiagramSelectionProp['selectedSeverity']>('Mild');

	useEffect(() => {
		setInjuries(initialInjuries);
	}, [initialInjuries]);

	useEffect(() => {
		if (onChange && JSON.stringify(injuries) !== JSON.stringify(initialInjuries)) {
			onChange(injuries);
		}
	}, [injuries]);

	const injuryTypes = lists.injuries.map(injury => injury.name);

	const currentSideInjuries = injuries.filter(injury => injury.side === selectedSide);

	// Function to detect body location based on coordinates
	const detectLocation = (x: number, y: number, side: 'Front' | 'Back'): string => {
		const regions = BODY_REGIONS[side];

		for (const [_, region] of Object.entries(regions)) {
			const { x: xRange, y: yRange, label } = region;
			if (x >= xRange[0] && x <= xRange[1] && y >= yRange[0] && y <= yRange[1]) {
				return `${label} (${side})`;
			}
		}

		return `Unknown Location (${side})`;
	};

	const removeInjury = (id: string) => {
		const updatedInjuries = injuries.filter(injury => injury.id !== id);
		setInjuries(updatedInjuries);
		if (selectedInjury?.id === id) {
			setSelectedInjury(null);
		}
	};

	const handleBodyClick = (event: React.MouseEvent<SVGSVGElement>) => {
		if (!selectedType || !selectedSeverity) return;

		const rect = event.currentTarget.getBoundingClientRect();
		const x = ((event.clientX - rect.left) / rect.width) * 100;
		const y = ((event.clientY - rect.top) / rect.height) * 100;

		// Detect the location based on coordinates
		const detectedLocation = detectLocation(x, y, selectedSide);

		const newInjury: InjuryFormProp = {
			id: `injury_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
			x: x,
			y: y,
			type: selectedType,
			severity: selectedSeverity,
			side: selectedSide,
			location: detectedLocation,
			description: '',
		};

		const updatedInjuries = [...injuries, newInjury];
		setInjuries(updatedInjuries);
	};

	const handleSelectedInjuryOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		if (!selectedInjury) return;

		const updated = injuries.map(i =>
			i.id === selectedInjury.id ? { ...i, description: e.target.value } : i
		);
		setInjuries(updated);
		setSelectedInjury({ ...selectedInjury, description: e.target.value });
	}

	// Update injury details
	const updateInjuryField = (id: string, field: keyof InjuryFormProp, value: any) => {
		const updated = injuries.map(i =>
			i.id === id ? { ...i, [field]: value } : i
		);
		setInjuries(updated);

		if (selectedInjury?.id === id) {
			setSelectedInjury({ ...selectedInjury, [field]: value });
		}
	};

	const renderShowSideInjuries = currentSideInjuries.map((injury, index) => {
		const { id, x, y, severity } = injury;

		const handleSetInjury = (e: React.MouseEvent<SVGCircleElement, MouseEvent>) => {
			e.stopPropagation();
			setSelectedInjury(injury);
		}

		return (
			<g key={id}>
				<circle
					cx={(x * 240) / 100}
					cy={(y * 360) / 100}
					r="6"
					fill={getSeverityBadgeColor(severity)}
					stroke="white"
					strokeWidth="2"
					className="cursor-pointer hover:opacity-80"
					onClick={handleSetInjury}
				/>
				<text
					x={(x * 240) / 100}
					y={(y * 360) / 100 + 2}
					textAnchor="middle"
					fontSize="8"
					fill="white"
					className="pointer-events-none font-bold"
				>
					{index + 1}
				</text>
			</g>
		);
	});

	const renderCurrentSideInjuries = currentSideInjuries.map((injury, index) => {
		const { id, severity, type, location } = injury;

		const handleRemoveInjury = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
			e.stopPropagation();
			removeInjury(id);
		}

		return (
			<div key={id} className="p-3 rounded-lg border hover:bg-muted/40 cursor-pointer"
				onClick={() => setSelectedInjury(injury)}>
				<div className="flex items-center justify-between mb-2">
					<div className="flex items-center gap-2">
						<div
							className="w-4 h-4 rounded-full border-2 border-white text-white text-xs font-bold flex items-center justify-center"
							style={{ backgroundColor: getSeverityBadgeColor(severity) }}
						>
							{index + 1}
						</div>
						<div className="flex flex-col">
							<span className="font-medium text-sm">{type}</span>
							<span className="text-xs text-muted-foreground">{location}</span>
						</div>
					</div>

					<Button
						variant="ghost"
						size="sm"
						onClick={handleRemoveInjury}
					>
						<X className="w-3 h-3" />
					</Button>
				</div>
				<Badge className="text-xs">{severity}</Badge>
			</div>
		);
	})

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Palette className="w-5 h-5" />
						Body Injury Diagram
					</CardTitle>
				</CardHeader>

				<CardContent className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
						<Select
							value={selectedSide}
							onValueChange={(e) => setSelectedSide(e as BodyDiagramSelectionProp['selectedSide'])}
						>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{lists.sides.map(side => (
									<SelectItem key={side} value={side}>{side}</SelectItem>
								))}
							</SelectContent>
						</Select>

						<Select
							value={selectedType}
							onValueChange={(e) => setSelectedType(e as BodyDiagramSelectionProp['selectedType'])}
						>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{injuryTypes.map(type => (
									<SelectItem key={type} value={type}>{type}</SelectItem>
								))}
							</SelectContent>
						</Select>

						<Select
							value={selectedSeverity}
							onValueChange={(value: 'Mild' | 'Moderate' | 'Severe' | 'Critical') => setSelectedSeverity(value)}
						>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{lists.severities.map(severity => (
									<SelectItem key={severity} value={severity}>{severity}</SelectItem>
								))}
							</SelectContent>
						</Select>

						<Button
							variant="outline"
							size="sm"
							onClick={() => {
								setInjuries([]);
							}} disabled={injuries.length === 0}
						>
							<RotateCcw className="w-4 h-4 mr-2" />
							Clear All
						</Button>
					</div>

					<div className="flex flex-col lg:flex-row gap-6">
						<div className="flex-1">
							<div className="relative p-4 bg-muted/20 rounded-lg">
								<div className="mb-4 text-center">
									<Badge variant="secondary">
										{selectedSide === 'Front' ? 'Front View' : 'Back View'}
									</Badge>
									<p className="text-sm text-muted-foreground mt-2">Click on the diagram to mark injuries</p>
								</div>

								<div className="relative mx-auto flex items-center justify-center max-w-sm">
									<svg
										width="240"
										height="360"
										viewBox="0 0 240 360"
										className="border rounded-lg bg-background cursor-crosshair"
										onClick={handleBodyClick}
									>
										<g fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground">
											{/* Head */}
											<circle cx="120" cy="60" r="28" />
											{/* Torso */}
											<rect x="90" y="88" width="60" height="90" rx="12" />
											{/* Left arm */}
											<rect x="55" y="98" width="18" height="70" rx="9" />
											{/* Right arm */}
											<rect x="167" y="98" width="18" height="70" rx="9" />
											{/* Left hand */}
											<circle cx="64" cy="178" r="10" />
											{/* Right hand */}
											<circle cx="176" cy="178" r="10" />
											{/* Left leg */}
											<rect x="95" y="178" width="18" height="95" rx="9" />
											{/* Right leg */}
											<rect x="127" y="178" width="18" height="95" rx="9" />
											{/* Left foot */}
											<ellipse cx="104" cy="283" rx="12" ry="8" />
											{/* Right foot */}
											<ellipse cx="136" cy="283" rx="12" ry="8" />
											{/* Back spine indicator */}
											{selectedSide === 'Back' && <line x1="120" y1="88" x2="120" y2="178" strokeDasharray="4,4" />}
										</g>

										{renderShowSideInjuries}
									</svg>
								</div>
							</div>
						</div>

						<div className="w-full lg:w-80 space-y-4">
							<Card>
								<CardHeader>
									<CardTitle className="text-sm">Recorded Injuries ({currentSideInjuries.length})</CardTitle>
								</CardHeader>
								<CardContent>
									{currentSideInjuries.length === 0 ? (
										<p className="text-sm text-muted-foreground text-center py-4">
											No injuries recorded
										</p>
									) : (
										<div className="space-y-3">
											{renderCurrentSideInjuries}
										</div>
									)}
								</CardContent>
							</Card>

							{selectedInjury && (
								<Card>
									<CardHeader>
										<CardTitle className="text-sm">Injury Details</CardTitle>
									</CardHeader>
									<CardContent className="space-y-3">
										<div>
											<label className="text-xs font-medium text-muted-foreground">Type</label>
											<Select
												value={selectedInjury.type}
												onValueChange={(value) => updateInjuryField(selectedInjury.id, 'type', value)}
											>
												<SelectTrigger className="h-8">
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													{injuryTypes.map(type => (
														<SelectItem key={type} value={type}>{type}</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>

										<div>
											<label className="text-xs font-medium text-muted-foreground">Severity</label>
											<Select
												value={selectedInjury.severity}
												onValueChange={(value) => updateInjuryField(selectedInjury.id, 'severity', value)}
											>
												<SelectTrigger className="h-8">
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													{lists.severities.map(type => (
														<SelectItem key={type} value={type}>{type}</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>

										<div>
											<label className="text-xs font-medium text-muted-foreground">Location</label>
											<div className="text-sm p-2 bg-muted/40 rounded border">
												{selectedInjury.location}
											</div>
										</div>

										<div>
											<label className="text-xs font-medium text-muted-foreground">Description</label>
											<Textarea
												placeholder="Add description about this injury..."
												value={selectedInjury.description || ''}
												onChange={handleSelectedInjuryOnChange}
												rows={3}
											/>
										</div>
									</CardContent>
								</Card>
							)}
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default BodyDiagram;