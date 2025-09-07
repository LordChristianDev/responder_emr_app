import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function AuthCallback() {
	useEffect(() => {
		const handleCallback = async () => {
			const { data, error } = await supabase.auth.getSession();

			if (error) {
				console.error("Auth callback error:", error);
				window.location.replace("/login"); // fallback
				return;
			}

			if (data.session) {
				// ✅ Session established
				console.log("Session finalized:", data.session);
				window.location.replace("/loading"); // or your home page
			} else {
				// await supabase.auth.setSessionFromUrl({ storeSession: true });
				window.location.replace("/loading");
			}
		};

		handleCallback();
	}, []);

	return <p>Signing you in...</p>;
}
