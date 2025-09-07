import { Card, CardContent } from "@/components/ui/card";
import { landingPageActivities } from "@/features/authentication/services/landingServices";

const renderActivities = landingPageActivities.map((activity, index) => {
	const { title, description } = activity;

	return (
		<Card key={index} className="py-12 group border-0 max-w-[22.5rem] transition-all duration-300 hover:-translate-y-1">
			<CardContent className="text-center">
				<div className="mx-auto mb-4 flex items-center justify-center bg-primary rounded-full w-16 aspect-square group-hover:scale-115 transition-transform duration-300">
					<activity.icon className="w-8 h-8 text-white" />
				</div>
				<h4 className="mb-2 font-semibold text-lg text-royal-blue-dark">
					{title}
				</h4>
				<p className="text-gray-600 text-sm">
					{description}
				</p>
			</CardContent>
		</Card>
	);
});

const ActivitiesSection = () => {
	return (
		<section className="container py-12 max-w-8xl w-full" id="about">
			<div className="flex flex-wrap items-center justify-center gap-6">
				{renderActivities}
			</div>
		</section>
	);
}

export default ActivitiesSection;