import { supabase } from "@/lib/supabase";

export const fetchUserWithGoogleID = async (google_id: string) => {
	if (!google_id) return null;

	const { data, error } = await supabase
		.from('users')
		.select('*')
		.eq('google_id', google_id)
		.maybeSingle()
	if (error && error.code !== 'PGRST116') throw new Error(error.message);
	return data;
}

export const createUserWithGoogleID = async (google_id: string) => {
	if (!google_id) return null;

	const { data, error } = await supabase
		.from('users')
		.insert([{
			google_id,
			last_login: new Date().toISOString()
		}])
		.select()
		.maybeSingle()
	if (error) throw new Error(error.message)
	return data
}