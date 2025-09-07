import Navbar from "@/features/authentication/components/Navbar";
import HeroSection from "@/features/authentication/components/HeroSection";
import ActivitiesSection from "@/features/authentication/components/ActivitiesSection";

const LandingPage = () => {
	return (
		<main className="mx-auto flex flex-col items-center justify-center w-full">
			<header className="landing py-6 relative flex flex-col items-center shadow-sm w-full" id="home">
				<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent w-full h-full pointer-events-none" />

				{/* Navigation Bar */}
				<Navbar />

				{/* Hero Section */}
				<HeroSection />
			</header>

			{/* Activities */}
			<ActivitiesSection />
	</main>
	);
}

export default LandingPage;