import { useState } from "react";
import { Menu, X } from "lucide-react";

import { useRoutes } from "@/hooks/useRoutes";
import { Button } from "@/components/ui/button";
import logo from "/images/logos/resq.png";


const navItems = [
	{ label: "Home", href: "#home" },
	{ label: "About", href: "#about" },
	{ label: "Contact", href: "https://www.linkedin.com/in/lordchristian-regacho/" },
]

const Navbar = () => {
	const { move } = useRoutes();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false)

	const handleSetMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

	const renderNavs = navItems.map((item) => {
		const { label, href } = item;

		return (
			<a
				key={label}
				href={href}
				className="text-muted-foreground hover:text-foreground transition-colors duration-300 font-medium relative group"
			>
				{label}
				<span className=" absolute inset-x-0 bottom-[-4px] h-0.5 bg-gradient-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
			</a>
		);
	});

	const renderMobileNavs = navItems.map((item) => {
		const { label, href } = item;

		const handleOnClick = () => setIsMobileMenuOpen(false);
		return (
			<a
				key={label}
				href={href}
				className="block px-3 py-2 text-muted-foreground hover:text-foreground transition-colors duration-300 font-medium"
				onClick={handleOnClick}
			>
				{label}
			</a>
		);

	})

	return (
		<nav className="container flex items-center justify-between max-w-8xl w-full z-10">
			<div className="flex items-center justify-between w-full h-16">
				<a
					href="#home"
					className="flex items-center gap-2 cursor-pointer w-[4rem] hover:scale-105 transition-all duration-300"
				>
					<img
						src={logo}
						alt="logo"
						className="w-[4rem] drop-shadow-[0_2px_3px_rgba(255,255,255,0.1)]"
					/>
					<span className="font-satoshi font-bold text-2xl text-gray-100">ResQ</span>
				</a>


				<div className="flex gap-8">
					<div className="hidden md:flex items-center space-x-8">
						{renderNavs}
					</div>

					<div className="hidden md:block">
						<Button
							onClick={() => move('/login')}
							className="flex bg-gradient-primary hover:scale-105 text-white font-medium cursor-pointer transition-all duration-300"
						>
							Sign In
						</Button>
					</div>
				</div>


				{/* Mobile Menu Button */}
				<Button
					variant="ghost"
					size="icon"
					className="md:hidden"
					onClick={handleSetMobileMenu}
				>
					{isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
				</Button>

			</div>


			{/* Mobile Navigation */}
			{isMobileMenuOpen && (
				<div className="md:hidden  bg-background/95 backdrop-blur-lg">
					<div className="px-2 pt-2 pb-3 space-y-1">
						{renderMobileNavs}
						<div className="px-3 py-2">
							<a href="#contact"><Button variant="default" size="sm" className="w-full">Let's Talk</Button></a>
						</div>
					</div>
				</div>
			)}
		</nav>
	);
}

export default Navbar;