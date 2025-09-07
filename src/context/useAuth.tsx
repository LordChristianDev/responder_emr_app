import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import { supabase } from '@/lib/supabase';
import { getItem, removeItem, setItem } from '@/lib/localStorage';

import type { Session, User } from '@supabase/supabase-js'

const getLocalUser = (): UserProp | null => {
	const data = getItem('user');
	if (!data) return null;
	return data;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthHook = () => {
	const [session, setSession] = useState<Session | null>(null);
	const [user, setUser] = useState<UserProp | null>(getLocalUser());
	const [supabaseUser, setSupabaseUser] = useState<User | null>(null);

	useEffect(() => {
		startSession();

		const { data: { subscription }, } = supabase.auth.onAuthStateChange(
			(_event, session) => {
				if (session) {
					setSession(session)
					setSupabaseUser(session.user);
				}
			}
		);
		return () => subscription.unsubscribe();
	}, []);

	const startSession = async () => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			if (session) {
				setSession(session)
				setSupabaseUser(session.user);
			}
		})
	};

	const googleSignIn = async () => {
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: 'google',
			options: {
				redirectTo: `${window.location.origin}/auth/callback`
			}
		});

		if (error) {
			removeItem('user');
			throw new Error(error.message)
		}

		return data;
	}

	const storeUser = (data: UserProp) => {
		if (!data) {
			throw new Error('Data for user storage is empty');
		}

		setUser(data);
		setItem('user', data);
	}

	const signOut = async (): Promise<boolean> => {
		const { error } = await supabase.auth.signOut();

		if (error) {
			console.error('Error signing out:', error);
			return false;
		}

		removeItem('user');
		setSession(null);
		setSupabaseUser(null);

		return true;
	}

	return { session, user, supabaseUser, storeUser, googleSignIn, signOut };
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
	const authDdata = useAuthHook();
	return (
		<AuthContext.Provider value={authDdata} >
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);

	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}

	return context;
};

type AuthContextType = {
	session: Session | null;
	user: UserProp | null;
	supabaseUser: User | null;
	storeUser: (data: UserProp) => void;
	googleSignIn: () => void;
	signOut: () => Promise<boolean>;
}

export type UserProp = {
	id: number;
	created_at: string;
	google_id: string;
	last_login: string;
}

type AuthProviderProps = {
	children: ReactNode;
}