import { useEffect, useState } from "react";

import { useAuth } from "@/context/useAuth";
import { useRoutes } from "@/hooks/useRoutes";
import { getItem } from "@/lib/localStorage";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import google from "/svgs/google.svg";
import logo from "/images/logos/resq.png";

const LoginPage = () => {
	const [isLoading, setIsLoading] = useState(false);
	const { move } = useRoutes();
	const { supabaseUser, googleSignIn } = useAuth();

	const isLoggedIn = !!getItem('user');

	useEffect(() => {
		if (isLoggedIn) {
			move("/dashboard");
			return;
		}

		if (supabaseUser && !isLoggedIn) {
			move("/loading")
			return;
		}

	}, [isLoggedIn, supabaseUser]);

	const handleGoogleLogin = async () => {
		setIsLoading(true);
		await googleSignIn();
		setIsLoading(false);
	};

	return (
		<div className="auth">
			<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent w-full h-full pointer-events-none" />

			<div className="w-full flex justify-center items-center z-10">
				<Card className="p-4 border-none w-full max-w-lg bg-gray-800/50">
					<CardHeader className="mb-2 space-y-1">
						{/* Logo */}
						<div className="mb-6 flex flex-col items-center justify-center">
							<img src={logo} alt="logo" className="w-[7rem]" />
							<h1 className="font-satoshi text-5xl text-white font-bold">ResQ</h1>
						</div>

						{/* Call To Action */}
						<CardTitle className="text-xl font-bold text-center text-white/90">
							All in one emergency platform
						</CardTitle>

						{/* Description */}
						<CardDescription className="text-center text-gray-300">
							Sign in to access your emergency medical records
						</CardDescription>
					</CardHeader>

					<CardContent>
						<Button
							type="submit"
							onClick={handleGoogleLogin}
							className="mb-2 bg-gradient-primary w-full hover:scale-103 transition-smooth duration-300 cursor-pointer" disabled={isLoading}
						>
							{isLoading ? (
								<span className="flex items-center">
									<svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
										<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
										<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
									</svg>
									<span className="p-18-semibold text-white">Logging in...</span>
								</span>
							) : (
								<span className="flex items-center gap-2">
									<img
										src={google}
										alt="google"
										className="size-4"
									/>
									<span className="p-18-semibold text-white"> Sign in with Google</span>
								</span>
							)}
						</Button>
					</CardContent>

					<CardFooter className="flex justify-center">
						<p className="text-sm text-gray-400">
							Secure authentication for medical professionals
						</p>
					</CardFooter>
				</Card>
			</div>
		</div>
	);
}

export default LoginPage;