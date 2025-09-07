import { useLocation, useNavigate } from 'react-router-dom';

export const useRoutes = () => {
	const navigate = useNavigate();
	const location = useLocation();

	// Check if current route
	const isActiveRoute = (path: string) => location.pathname === path;

	// Navigate to a different
	const move = (path: string) => navigate(path);

	return { navigate, location, isActiveRoute, move };
}