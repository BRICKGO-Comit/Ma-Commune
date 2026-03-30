import { supabase } from '../lib/supabase';

/**
 * MA COMMUNE — Mobile API Client (Full Supabase Version)
 * All calls are now direct to Supabase.
 */

let authToken = null;
let currentUser = null;

export function setAuthToken(token) {
  authToken = token;
}

export function getAuthToken() {
  return authToken;
}

export function setCurrentUser(user) {
  currentUser = user;
}

export function getCurrentUser() {
  return currentUser;
}

export function clearAuth() {
  authToken = null;
  currentUser = null;
  supabase.auth.signOut();
}

// ============================================
// AUTH
// ============================================

export async function loginUser(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  // Fetch complementary user data (role, etc.)
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', data.user.id)
    .single();

  if (userError) throw userError;

  const result = {
    data: {
      user: { ...data.user, ...user },
      token: data.session.access_token
    }
  };

  setAuthToken(result.data.token);
  setCurrentUser(result.data.user);

  return result;
}

export async function registerUser(email, password, full_name, phone) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name,
        phone,
      }
    }
  });

  if (error) throw error;

  // Create record in public.users table (if not handled by trigger)
  const newUser = {
    id: data.user.id,
    email,
    full_name,
    phone,
    role: 'citizen',
    created_at: new Date().toISOString()
  };

  const { error: insertError } = await supabase.from('users').insert([newUser]);
  if (insertError) console.error('Users table insert error:', insertError);

  const result = {
    data: {
      user: newUser,
      token: data.session?.access_token || data.user.id
    }
  };

  setAuthToken(result.data.token);
  setCurrentUser(result.data.user);

  return result;
}

export async function getMe() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  return { data: { ...user, ...profile } };
}

// ============================================
// COMMUNES
// ============================================

export async function fetchCommunes(search = '') {
  let query = supabase.from('communes').select('*').order('name');
  if (search) {
    query = query.ilike('name', `%${search}%`);
  }
  const { data, error } = await query;
  if (error) throw error;
  return { data };
}

export async function fetchCommuneById(id) {
  const { data, error } = await supabase
    .from('communes')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return { data };
}

// ============================================
// NEWS
// ============================================

export async function fetchNews(communeId, page = 1) {
  // Pagination simplified for now (fetching all)
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('commune_id', communeId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return { data };
}

export async function fetchNewsById(id) {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return { data };
}

// ============================================
// REPORTS
// ============================================

export async function fetchReports(communeId, status = '') {
  let query = supabase.from('reports').select('*').eq('commune_id', communeId);
  if (status) query = query.eq('status', status);
  
  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) throw error;
  return { data };
}

export async function createReport(communeId, data) {
  const { data: report, error } = await supabase
    .from('reports')
    .insert([{ ...data, commune_id: communeId }])
    .select()
    .single();
  if (error) throw error;
  return { data: report };
}

// ============================================
// CONTACTS
// ============================================

export async function fetchContacts(communeId) {
  const { data, error } = await supabase
    .from('useful_contacts')
    .select('*')
    .eq('commune_id', communeId)
    .order('sort_order');
  if (error) throw error;
  return { data };
}

// ============================================
// PROCEDURES
// ============================================

export async function fetchProcedures(communeId) {
  const { data, error } = await supabase
    .from('procedures')
    .select('*')
    .eq('commune_id', communeId);
  if (error) throw error;
  return { data };
}

// ============================================
// EVENTS (AGENDA)
// ============================================

export async function fetchEvents(communeId) {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('commune_id', communeId);
  if (error) throw error;
  return { data };
}

// ============================================
// BUSINESSES
// ============================================

export async function fetchBusinesses(communeId) {
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('commune_id', communeId);
  if (error) throw error;
  return { data };
}

export async function fetchMyBusiness() {
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('owner_id', currentUser?.id)
    .single();
  if (error) throw error;
  return { data };
}

export async function createBusiness(communeId, data) {
  const { data: biz, error } = await supabase
    .from('businesses')
    .insert([{ ...data, commune_id: communeId, owner_id: currentUser?.id }])
    .select()
    .single();
  if (error) throw error;
  return { data: biz };
}

export async function updateBusiness(businessId, data) {
  const { data: biz, error } = await supabase
    .from('businesses')
    .update(data)
    .eq('id', businessId)
    .select()
    .single();
  if (error) throw error;
  return { data: biz };
}

export async function togglePharmacyDuty(businessId, isOnDuty) {
  const { data: biz, error } = await supabase
    .from('businesses')
    .update({ is_on_duty: isOnDuty })
    .eq('id', businessId)
    .select()
    .single();
  if (error) throw error;
  return { data: biz };
}

// ============================================
// EQUIPMENTS
// ============================================

export async function fetchEquipments(communeId) {
  const { data, error } = await supabase
    .from('equipments')
    .select('*')
    .eq('commune_id', communeId);
  if (error) throw error;
  return { data };
}

// ============================================
// PAYMENTS & TAXES
// ============================================

export async function fetchPayments(id) {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .or(`user_id.eq.${id},commune_id.eq.${id}`);
  if (error) throw error;
  return { data };
}

export async function payTax(data) {
  const { data: pay, error } = await supabase
    .from('payments')
    .insert([data])
    .select()
    .single();
  if (error) throw error;
  return { data: pay };
}

// ============================================
// UPLOAD (Supabase Storage)
// ============================================

export async function uploadImage(uri, type = 'general') {
  const filename = uri.split('/').pop();
  const fileExt = filename.split('.').pop();
  const filePath = `${type}/${Date.now()}.${fileExt}`;

  // En React Native, on fetch l'URI pour obtenir un Blob
  const response = await fetch(uri);
  const blob = await response.blob();

  const { error } = await supabase.storage
    .from('images')
    .upload(filePath, blob);

  if (error) throw error;

  const { data } = supabase.storage
    .from('images')
    .getPublicUrl(filePath);

  return { url: data.publicUrl };
}
