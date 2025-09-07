import { supabase } from "@/lib/supabase";
import type { SettingsProp, UpdateCredentialFormFieldProp, UpdateProfileLists } from "@/features/personalization/types/settingsTypes";

export const fetchUpdateProfileLists = async (): Promise<UpdateProfileLists> => {
	let setLists: UpdateProfileLists = {
		organizationList: [],
		responderList: [],
		certificationList: [],
	}

	const { data: organizations, error: organizationsError } = await supabase
		.from('organizations')
		.select('*')
		.order('created_at', { ascending: false });

	if (organizationsError) throw new Error(organizationsError.message);
	if (organizations) setLists = { ...setLists, organizationList: organizations };

	const { data: responders, error: respondersError } = await supabase
		.from('responder_roles')
		.select('*')
		.order('created_at', { ascending: false });

	if (respondersError) throw new Error(respondersError.message);
	if (responders) setLists = { ...setLists, responderList: responders };

	const { data: certifications, error: certificationsError } = await supabase
		.from('certifications')
		.select('*')
		.order('created_at', { ascending: false });

	if (certificationsError) throw new Error(certificationsError.message)
	if (certifications) setLists = { ...setLists, certificationList: certifications };

	return setLists;
}

export const updateProfileInfo = async (id: number, updates: Object) => {
	if (!id) throw new Error('Unable to update without ID');

	// Remove undefined values
	const cleanUpdates = Object.fromEntries(
		Object.entries(updates).filter(([_, value]) => value !== undefined)
	)

	const { data, error } = await supabase
		.from('profiles')
		.update(cleanUpdates)
		.eq('id', id)
		.select()
		.maybeSingle()
	if (error) throw new Error(error.message);

	return data
}

export const updateCredentialsInfo = async (id: number, user_id: number, updates: UpdateCredentialFormFieldProp) => {
	if (!id) throw new Error('Unable to update without ID');

	if (!user_id) throw new Error('Updated failed, ID is null');

	let returnStatement = null;

	const { data: profile, error: profileError } = await supabase
		.from('profiles')
		.update({
			responder_number: updates.responderNumber,
			organization_id: updates.organization !== -1 ? updates.organization : null,
			responder_role_id: updates.responderRole !== -1 ? updates.responderRole : null,
		})
		.eq('id', id)
		.select()
		.maybeSingle()

	if (profileError) throw new Error(profileError.message);
	if (profile) returnStatement = profile;

	if (!updates.certifications || updates.certifications.length === 0) return { ...returnStatement, certifications: [] };

	// Delete all Occurence of user_id
	await supabase
		.from('certifications_users')
		.delete()
		.eq('user_id', user_id)

	let inserted: any = [];

	updates.certifications.forEach(async (cert) => {
		const { data: insertedCert } = await supabase
			.from('certifications_users')
			.insert([{
				user_id: user_id,
				certification_id: cert,
			}])
			.select()
			.single()

		if (insertedCert) inserted = [...inserted, insertedCert];
	});

	return { ...returnStatement, certifications: inserted };
}

export const fetchSettings = async () => {
	await new Promise((resolve) => setTimeout(resolve, 1000));
	return mockSettings;
}

const mockSettings: SettingsProp = {
	theme: "light",
	notifications: {
		emergency: true,
		caseUpdates: true,
		systemAlerts: false,
		emailDigest: true
	},
	language: "english",
	autoSave: true,
	offlineMode: true
}

export const languagesList = [
	{ value: "english", label: "English" },
	{ value: "spanish", label: "Spanish" },
	{ value: "french", label: "French" },
	{ value: "german", label: "German" }
];