import { Ambulance, Calendar, Clock, MapPin, User } from 'lucide-react';

import { useCase } from '@/context/useCase';
import { useRoutes } from '@/hooks/useRoutes';
import { createCustomIcon, createFullName, getStatusBadgeColor } from '@/lib/utils';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

import type { CaseProp } from '@/features/dashboard/types/casesTypes';

const MapCard = ({ allCases }: { allCases: CaseProp[] }) => {
	const { move } = useRoutes();
	const { setCaseNumber } = useCase();

	const renderMapCases = allCases.map((caseData) => {
		const { id, case_number, date_recorded, time_recorded, location, cause, status, description, latitude, longitude, patient } = caseData;
		const { first_name, last_name } = patient;

		const fullName = createFullName(first_name, last_name);

		const handleOnClick = () => {
			setCaseNumber(case_number);
			move(`/case/${case_number}`);
		}

		return (
			<Marker
				key={id}
				position={[latitude, longitude]}
				icon={createCustomIcon(status)}
			>
				<Popup className="custom-popup">
					<div className="p-2 min-w-64">
						<div className="flex items-center justify-between mb-2">
							<h3 className="font-semibold text-sm">{case_number}</h3>
							<Badge
								className="text-xs"
								style={{
									backgroundColor: getStatusBadgeColor(status) + '20',
									color: getStatusBadgeColor(status),
									borderColor: getStatusBadgeColor(status)
								}}
							>
								{status}
							</Badge>
						</div>

						<div className="space-y-2 text-xs">
							<div className="flex items-center gap-2">
								<User className="w-3 h-3 text-muted-foreground" />
								<span>{fullName}</span>
							</div>

							<div className="flex items-center gap-2">
								<Calendar className="w-3 h-3 text-muted-foreground" />
								<span>{date_recorded}</span>
								<Clock className="w-3 h-3 text-muted-foreground ml-2" />
								<span>{time_recorded}</span>
							</div>

							<div className="flex items-center gap-2">
								<MapPin className="w-3 h-3 text-muted-foreground" />
								<span className="text-muted-foreground">{location}</span>
							</div>

							<div className="flex items-center gap-2">
								<Ambulance className="w-3 h-3 text-muted-foreground" />
								<span>{cause}</span>
							</div>

							{description && <p className="text-muted-foreground text-xs mt-2">{description}</p>}

							<div className="mt-3 pt-2 border-t border-border">
								<Button
									size="sm"
									className="w-full"
									onClick={handleOnClick}
								>
									View Full Case
								</Button>
							</div>
						</div>
					</div>
				</Popup>
			</Marker>
		);
	});

	return (
		<Card className="p-0 overflow-hidden">
			<CardContent className="p-0">
				<div className="h-[600px] w-full">
					<MapContainer
						center={[10.3157, 123.8854]} // Cebu City, Philippines
						zoom={12}
						style={{ height: '100%', width: '100%' }}
						className="rounded-lg z-0"
					>
						<TileLayer
							attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
							url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
						/>
						{renderMapCases}
					</MapContainer>
				</div>
			</CardContent>
		</Card>

	);
}

export default MapCard;