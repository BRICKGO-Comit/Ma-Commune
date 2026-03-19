export const API_URL = 'http://192.168.1.110:3000'; // Adresse IP locale pour accès depuis un téléphone
// export const API_URL = 'http://10.0.2.2:3000'; // Pour émulateur Android
// export const API_URL = 'http://localhost:3000'; // Pour iOS simulator

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
}

async function apiRequest(endpoint, options = {}) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const res = await fetch(`${API_URL}${endpoint}`, config);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Erreur serveur');
    }

    return data;
  } catch (err) {
    if (err.message === 'Network request failed') {
      throw new Error('Impossible de se connecter au serveur');
    }
    throw err;
  }
}

// ============================================
// AUTH
// ============================================
export async function loginUser(email, password) {
  const result = await apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  if (result.data) {
    setAuthToken(result.data.token);
    setCurrentUser(result.data.user);
  }
  return result;
}

export async function registerUser(email, password, full_name, phone) {
  const result = await apiRequest('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, full_name, phone }),
  });
  if (result.data) {
    setAuthToken(result.data.token);
    setCurrentUser(result.data.user);
  }
  return result;
}

export async function getMe() {
  return apiRequest('/api/auth/me');
}

// ============================================
// COMMUNES
// ============================================
export async function fetchCommunes(search = '') {
  const params = search ? `?search=${encodeURIComponent(search)}` : '';
  return apiRequest(`/api/communes${params}`);
}

export async function fetchCommuneById(id) {
  return apiRequest(`/api/communes/${id}`);
}

// ============================================
// NEWS
// ============================================
export async function fetchNews(communeId, page = 1) {
  return apiRequest(`/api/communes/${communeId}/news?page=${page}`);
}

export async function fetchNewsById(id) {
  return apiRequest(`/api/news/${id}`);
}

// ============================================
// REPORTS
// ============================================
export async function fetchReports(communeId, status = '') {
  const params = status ? `?status=${status}` : '';
  return apiRequest(`/api/communes/${communeId}/reports${params}`);
}

export async function createReport(communeId, data) {
  return apiRequest(`/api/communes/${communeId}/reports`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ============================================
// CONTACTS
// ============================================
export async function fetchContacts(communeId) {
  return apiRequest(`/api/communes/${communeId}/contacts`);
}

// ============================================
// PROCEDURES
// ============================================
export async function fetchProcedures(communeId) {
  return apiRequest(`/api/procedures/${communeId}`);
}

// ============================================
// EVENTS (AGENDA)
// ============================================
export async function fetchEvents(communeId) {
  return apiRequest(`/api/events/${communeId}`);
}

// ============================================
// BUSINESSES
// ============================================
export async function fetchBusinesses(communeId) {
  return apiRequest(`/api/businesses/${communeId}`);
}

export async function fetchMyBusiness() {
  return apiRequest('/api/businesses/my/business');
}

export async function createBusiness(communeId, data) {
  return apiRequest(`/api/businesses/${communeId}`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateBusiness(businessId, data) {
  return apiRequest(`/api/businesses/${businessId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function togglePharmacyDuty(businessId, isOnDuty) {
  return apiRequest(`/api/businesses/${businessId}/duty`, {
    method: 'PATCH',
    body: JSON.stringify({ is_on_duty: isOnDuty }),
  });
}

// ============================================
// EQUIPMENTS
// ============================================
export async function fetchEquipments(communeId) {
  return apiRequest(`/api/equipments/${communeId}`);
}

// ============================================
// PAYMENTS & TAXES
// ============================================
export async function fetchPayments(id) {
  return apiRequest(`/api/payments/${id}`);
}

export async function payTax(data) {
  return apiRequest('/api/payments', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ============================================
// UPLOAD (Cloudinary)
// ============================================
export async function uploadImage(uri, type = 'general') {
  const formData = new FormData();
  
  // Extraire le nom du fichier depuis l'URI
  const filename = uri.split('/').pop();
  const ext = filename.split('.').pop().toLowerCase();
  const mimeType = ext === 'png' ? 'image/png' : ext === 'gif' ? 'image/gif' : 'image/jpeg';

  formData.append('image', {
    uri,
    name: filename,
    type: mimeType,
  });
  formData.append('type', type);

  try {
    const res = await fetch(`${API_URL}/api/upload`, {
      method: 'POST',
      headers: {
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
      },
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Erreur upload');
    }
    return data; // { url, public_id, width, height }
  } catch (err) {
    if (err.message === 'Network request failed') {
      throw new Error('Impossible de se connecter au serveur');
    }
    throw err;
  }
}
