import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRoutes } from "@/hooks/useRoutes";

export default function AuthCallback() {
	const { move } = useRoutes();

	useEffect(() => {
		const handleAuthCallback = async () => {
			try {
				const { data, error } = await supabase.auth.getSession();

				if (error) {
					console.error('Auth error:', error);
					move('/login');
					return;
				}

				if (data.session) {
					move('/loading');
				} else {
					move('/login');
				}
			} catch (error) {
				console.error('Callback error:', error);
				move('/login');
			}
		};

		handleAuthCallback();
	}, []);

	return (
		<div className="flex items-center justify-center min-h-screen">
			<div className="text-center">
				<h2>Authenticating...</h2>
				<p>Please wait while we sign you in.</p>
			</div>
		</div>
	);
}
