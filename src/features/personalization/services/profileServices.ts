import { supabase } from "@/lib/supabase";
import type { ResponderProp } from "@/features/dashboard/types/casesTypes";
import type { CertificationProp, OrganizationProp, ProfileAvatarProp, ProfileProp, ResponderRoleProp } from "@/features/personalization/types/profileTypes";

export const fetchProfile = async (user_id: number): Promise<ProfileProp | null> => {
	if (!user_id) return null;

	const { data: profile, error: profileError } = await supabase
		.from('profiles')
		.select('*')
		.eq('user_id', user_id)
		.maybeSingle()

	if (profileError && profileError.code !== 'PGRST116') throw new Error(profileError.message);
	if (!profile) return null;

	let setProfile: ProfileProp = profile;

	const organizationData = await fetchOrganization(profile.organization_id);
	if (organizationData) setProfile = { ...setProfile, organization: organizationData }

	const responderRoleData = await fetchResponderRole(profile.responder_role_id);
	if (responderRoleData) setProfile = { ...setProfile, responder: responderRoleData }

	const certificationsData = await fetchCertifications(user_id)
	if (certificationsData) setProfile = { ...setProfile, certifications: certificationsData }

	return setProfile;
}

export const fetchResponder = async (id: number): Promise<ResponderProp | null> => {
	if (!id) return null;

	const { data: responder, error: responderError } = await supabase
		.from('profiles')
		.select('*')
		.eq('id', id)
		.single();

	if (responderError) throw new Error(responderError.message);
	if (!responder) return null;

	let setResponder: ResponderProp = responder;

	const organizationData = await fetchOrganization(responder.organization_id);
	if (organizationData) setResponder = { ...setResponder, organization: organizationData }

	const responderRoleData = await fetchResponderRole(responder.responder_role_id);
	if (responderRoleData) setResponder = { ...setResponder, responder: responderRoleData }

	const certificationsData = await fetchCertifications(responder.user_id)
	if (certificationsData) setResponder = { ...setResponder, certifications: certificationsData }

	return setResponder;
}

const fetchOrganization = async (id: number): Promise<OrganizationProp | null> => {
	if (!id) return null

	const { data: organization, error: organizationError } = await supabase
		.from('organizations')
		.select('*')
		.eq('id', id)
		.single()

	if (organizationError) console.error(organizationError.message);
	if (!organization) return null;

	return organization;
}

const fetchResponderRole = async (id: number): Promise<ResponderRoleProp | null> => {
	if (!id) return null;

	const { data: responderRole, error: responderRoleError } = await supabase
		.from('responder_roles')
		.select('*')
		.eq('id', id)
		.single()

	if (responderRoleError) console.error(responderRoleError.message);
	if (!responderRole) return null;

	return responderRole;
}

const fetchCertifications = async (user_id: number): Promise<CertificationProp[]> => {
	if (!user_id) return [];

	const { data: certUsers, error: certUsersError } = await supabase
		.from('certifications_users')
		.select('*')
		.eq('user_id', user_id)
		.order('created_at', { ascending: false })

	if (certUsersError) console.error(certUsersError.message);
	if (!certUsers || certUsers.length === 0) return [];

	const ids = certUsers.map(p => p.certification_id);

	const { data: certifications, error: certificationsError } = await supabase
		.from("certifications")
		.select('*')
		.in("id", ids)
		.order("created_at", { ascending: false });

	if (certificationsError) console.error(certificationsError.message);
	if (!certifications) return [];

	return certifications;
}

export const uploadProfileAvatar = async (user_id: number, avatar: ProfileAvatarProp) => {
	if (!user_id) throw new Error("Unable to complete without identifier");
	if (!avatar) throw new Error('Unable to complete without file');

	const { file, type } = avatar;

	const fileExt = file.name.split('.').pop();
	const fileName = `${user_id}_${Date.now()}.${fileExt}`;

	const { error: uploadError } = await supabase.storage.from('avatars').upload(
		fileName, file, {
		contentType: type,
		upsert: true,
	})

	if (uploadError) {
		console.error('Upload error:', uploadError)
		return;
	}

	// Get public URL
	const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
	const avatar_url = data.publicUrl;

	// Update Avatar
	await supabase
		.from('profiles')
		.update({ avatar_url })
		.eq('user_id', user_id)
		.select()
		.maybeSingle()
}

export const createProfileData = async (args: {
	user_id: number;
	first_name: string;
	last_name: string;
	avatar_url: string;
	email: string | null;
}) => {
	const { user_id, first_name, last_name, avatar_url, email } = args
	const { data, error } = await supabase
		.from('profiles')
		.insert([{
			user_id,
			first_name: first_name ?? "First",
			last_name: last_name ?? "Responder",
			avatar_url: avatar_url ?? null,
			email,
		}])
		.select()
		.maybeSingle()
	if (error) {
		console.error(error.message);
		throw new Error(error.message)
	}
	return data
}
