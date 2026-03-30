import { supabase } from './supabase';

/**
 * MA COMMUNE — API Client (Full Supabase Version)
 * All calls are now direct to Supabase, bypassing the Node/Express backend.
 */

export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  // Fetch complementary user data (role, etc.) from public.users table
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', data.user.id)
    .single();

  // FALLBACK: If user record is missing in public.users, don't crash.
  // This happens when users are created manually in Supabase Auth UI.
  const profile = user || {
    id: data.user.id,
    email: data.user.email,
    role: data.user.email === 'admin@macommune.ci' ? 'super_admin' : 'citizen'
  };

  // Get commune details if applicable
  let commune_slug = null;
  if (user.commune_id) {
    const { data: commune } = await supabase
      .from('communes')
      .select('slug')
      .eq('id', user.commune_id)
      .single();
    if (commune) commune_slug = commune.slug;
  }

  return {
    data: {
      user: { ...data.user, ...profile },
      token: data.session.access_token,
      commune_slug
    }
  };
}

export async function getCommunes(search = '') {
  let query = supabase.from('communes').select('*').order('name');
  if (search) {
    query = query.ilike('name', `%${search}%`);
  }
  const { data, error } = await query;
  if (error) throw error;
  return { data };
}

export async function getCommuneById(id) {
  const { data, error } = await supabase
    .from('communes')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return { data };
}

export async function getCommuneBySlug(slug) {
  const { data, error } = await supabase
    .from('communes')
    .select('*')
    .eq('slug', slug)
    .single();
  if (error) throw error;
  return { data };
}

export async function registerMairie(formData) {
  // 1. Create the Admin User in Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
      data: {
        full_name: formData.admin_name,
        role: 'admin'
      }
    }
  });

  if (authError) throw authError;

  // 2. Create the Commune
  const communeData = {
    name: formData.name,
    code: formData.code,
    mayor_name: formData.mayor_name,
    email: formData.email, // Common email for the mairie
    slug: formData.name.toLowerCase().replace(/ /g, '-'),
    created_at: new Date().toISOString()
  };

  const { data: commune, error: communeError } = await supabase
    .from('communes')
    .insert([communeData])
    .select()
    .single();
  
  if (communeError) throw communeError;

  // 3. Create the User Profile in public.users
  const userProfile = {
    id: authData.user.id,
    email: formData.email,
    full_name: formData.admin_name,
    role: 'admin',
    commune_id: commune.id,
    created_at: new Date().toISOString()
  };

  const { error: profileError } = await supabase
    .from('users')
    .insert([userProfile]);

  if (profileError) throw profileError;

  return { data: commune };
}

export async function getAllNews(params = {}) {
  let query = supabase.from('news').select('*, communes(name)').order('created_at', { ascending: false });
  
  if (params.category) query = query.eq('category', params.category);
  if (params.commune_id) query = query.eq('commune_id', params.commune_id);

  const { data, error } = await query;
  if (error) throw error;
  return { data };
}

export async function getNewsByCommune(communeId) {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('commune_id', communeId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return { data };
}

export async function createNews(communeId, data) {
  const { data: news, error } = await supabase
    .from('news')
    .insert([{ ...data, commune_id: communeId }])
    .select()
    .single();
  if (error) throw error;
  return { data: news };
}

export async function getAllReports(params = {}) {
  let query = supabase.from('reports').select('*, communes(name), users(full_name)').order('created_at', { ascending: false });
  
  if (params.status) query = query.eq('status', params.status);
  if (params.commune_id) query = query.eq('commune_id', params.commune_id);

  const { data, error } = await query;
  if (error) throw error;
  return { data };
}

export async function getReportsByCommune(communeId) {
  const { data, error } = await supabase
    .from('reports')
    .select('*, users(full_name)')
    .eq('commune_id', communeId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return { data };
}

export async function updateReportStatus(reportId, data) {
  const { data: report, error } = await supabase
    .from('reports')
    .update(data)
    .eq('id', reportId)
    .select()
    .single();
  if (error) throw error;
  return { data: report };
}

export async function getContactsByCommune(communeId) {
  const { data, error } = await supabase
    .from('useful_contacts')
    .select('*')
    .eq('commune_id', communeId)
    .order('sort_order');
  if (error) throw error;
  return { data };
}

export async function createContact(communeId, data) {
  const { data: contact, error } = await supabase
    .from('useful_contacts')
    .insert([{ ...data, commune_id: communeId }])
    .select()
    .single();
  if (error) throw error;
  return { data: contact };
}

export async function deleteContact(contactId) {
  const { error } = await supabase
    .from('useful_contacts')
    .delete()
    .eq('id', contactId);
  if (error) throw error;
  return true;
}

export async function getProceduresByCommune(communeId) {
  const { data, error } = await supabase
    .from('procedures')
    .select('*')
    .eq('commune_id', communeId);
  if (error) throw error;
  return { data };
}

export async function createProcedure(communeId, data) {
  const { data: proc, error } = await supabase
    .from('procedures')
    .insert([{ ...data, commune_id: communeId }])
    .select()
    .single();
  if (error) throw error;
  return { data: proc };
}

export async function getEventsByCommune(communeId) {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('commune_id', communeId);
  if (error) throw error;
  return { data };
}

export async function createEvent(communeId, data) {
  const { data: event, error } = await supabase
    .from('events')
    .insert([{ ...data, commune_id: communeId }])
    .select()
    .single();
  if (error) throw error;
  return { data: event };
}

export async function getBusinessesByCommune(communeId) {
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('commune_id', communeId);
  if (error) throw error;
  return { data };
}

export async function getAllBusinesses(params = {}) {
  let query = supabase.from('businesses').select('*, communes(name)').order('created_at', { ascending: false });
  if (params.status) query = query.eq('status', params.status);
  
  const { data, error } = await query;
  if (error) throw error;
  return { data };
}

export async function updateBusinessStatus(businessId, status) {
  const { data: biz, error } = await supabase
    .from('businesses')
    .update({ status })
    .eq('id', businessId)
    .select()
    .single();
  if (error) throw error;
  return { data: biz };
}

export async function getEquipmentsByCommune(communeId) {
  const { data, error } = await supabase
    .from('equipments')
    .select('*')
    .eq('commune_id', communeId);
  if (error) throw error;
  return { data };
}

export async function createEquipment(communeId, data) {
  const { data: equip, error } = await supabase
    .from('equipments')
    .insert([{ ...data, commune_id: communeId }])
    .select()
    .single();
  if (error) throw error;
  return { data: equip };
}

export async function getPaymentsByCommune(communeOrUserId) {
  // Simple heuristic: if it looks like a user ID call it should fetch user payments
  const { data, error } = await supabase
    .from('payments')
    .select('*, users(full_name)')
    .or(`user_id.eq.${communeOrUserId},commune_id.eq.${communeOrUserId}`);
  if (error) throw error;
  return { data };
}

export async function updateCommuneSettings(communeId, data) {
  const { data: commune, error } = await supabase
    .from('communes')
    .update(data)
    .eq('id', communeId)
    .select()
    .single();
  if (error) throw error;
  return { data: commune };
}

export async function uploadImage(file, type = 'general') {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `${type}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('images')
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from('images')
    .getPublicUrl(filePath);

  return data.publicUrl;
}
