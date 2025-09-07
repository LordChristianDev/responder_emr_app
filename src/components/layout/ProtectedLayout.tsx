import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { useRoutes } from "@/hooks/useRoutes";
import { getItem, removeItem } from "@/lib/localStorage";

import { SidebarProvider } from "@/components/ui/sidebar";
import AppBar from "./AppBar";
import AppSidebar from "./AppSidebar";

// Auth check wrapper component
export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const location = useLocation();
	const isLoggedIn = !!getItem('user');

	if (!isLoggedIn && location.pathname !== '/login') {
		return <Navigate to="/login" state={{ from: location }
		} replace />;
	}

	return children;
};

// Authenticated Layout with AppBar and Sidebar
export const AuthenticatedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const { move } = useRoutes()
	const isLoggedIn = !!getItem('user');

	useEffect(() => {
		if (!isLoggedIn) {
			removeItem('user');
			move('/login');
		}
	}, [isLoggedIn]);

	return (
		<SidebarProvider>
			<div className="flex flex-col w-full min-h-screen bg-background">
				<AppBar />
				<div className="flex flex-1">
					<AppSidebar />
					<div className="flex-1 overflow-auto">
						{children}
					</div>
				</div>
			</div>
		</SidebarProvider>
	);
};