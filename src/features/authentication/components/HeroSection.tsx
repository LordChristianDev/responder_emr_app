import { ArrowRight } from "lucide-react";
import { useRoutes } from "@/hooks/useRoutes";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
	const { move } = useRoutes();

	return (
		<div className="pl-2 relative container overflow-hidden animate-fade-in max-w-8xl w-full z-10">
			<div className="py-8 flex flex-col gap-4 lg:text-left animate-fade-in">
				<h1 className="mb-6 text-4xl md:text-6xl font-bold text-gray-200 leading-snug">
					Fast, Acurate <br />
					<span className=" text-blue-400">
						Life Saving
					</span> {" "}
					Documentation
				</h1>

				<p className="mb-12 text-lg text-gray-300 leading-relaxed max-w-3xl">
					Professional EMR system built for first responders. Document emergency medical events with precision and speed when every second counts, ensuring critical information is captured, organized, and accessible in the moments that matter most
				</p>

				<div className="mb-2 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
					<Button
						onClick={() => move('/login')}
						size="lg"
						className="bg-gradient-primary text-primary-foreground hover:scale-105 transition-smooth duration-300 cursor-pointer"
					>
						Try It Now
						<ArrowRight className="ml-2 h-6 w-6" />
					</Button>

					<Button
						size="lg"
						variant="outline"
						className="hover:bg-blue-200 transition-smooth cursor-pointer"
					>
						Learn More
					</Button>
				</div>
			</div>
		</div>
	);
}

export default HeroSection;