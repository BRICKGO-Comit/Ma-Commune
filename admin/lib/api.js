const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3000';

export async function api(endpoint, options = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const res = await fetch(`${API_URL}${endpoint}`, config);
  const data = await res.json();

  if (!res.ok) {
    console.error(`API Error [${res.status}] ${endpoint}:`, data);
    throw new Error(data.error || `Erreur API (${res.status})`);
  }

  return data;
}

export function login(email, password) {
  return api('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function getCommunes(search = '') {
  const params = search ? `?search=${encodeURIComponent(search)}` : '';
  return api(`/api/communes${params}`);
}

export function getCommuneById(id) {
  return api(`/api/communes/${id}`);
}

export function getCommuneBySlug(slug) {
  return api(`/api/communes/by-slug/${slug}`);
}

export function registerMairie(data) {
  return api('/api/communes/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function getAllNews(params = {}) {
  const query = new URLSearchParams(params).toString();
  return api(`/api/all-news${query ? `?${query}` : ''}`);
}

export function getNewsByCommune(communeId) {
  return api(`/api/communes/${communeId}/news`);
}

export function createNews(communeId, data) {
  return api(`/api/communes/${communeId}/news`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function getAllReports(params = {}) {
  const query = new URLSearchParams(params).toString();
  return api(`/api/all-reports${query ? `?${query}` : ''}`);
}

export function getReportsByCommune(communeId) {
  return api(`/api/communes/${communeId}/reports`);
}

export function createReport(communeId, data) {
  return api(`/api/communes/${communeId}/reports`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateReportStatus(reportId, data) {
  return api(`/api/reports/${reportId}/status`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export function getContactsByCommune(communeId) {
  return api(`/api/communes/${communeId}/contacts`);
}

export function createContact(communeId, data) {
  return api(`/api/communes/${communeId}/contacts`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function deleteContact(contactId) {
  return api(`/api/contacts/${contactId}`, { method: 'DELETE' });
}

export function getProceduresByCommune(communeId) {
  return api(`/api/procedures/${communeId}`);
}

export function createProcedure(communeId, data) {
  return api(`/api/procedures/${communeId}`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function getEventsByCommune(communeId) {
  return api(`/api/events/${communeId}`);
}

export function createEvent(communeId, data) {
  return api(`/api/events/${communeId}`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function getBusinessesByCommune(communeId) {
  return api(`/api/businesses/${communeId}?all=true`);
}

export function getAllBusinesses(params = {}) {
  const query = new URLSearchParams(params).toString();
  return api(`/api/all-businesses${query ? `?${query}` : ''}`);
}

export function updateBusinessStatus(businessId, status) {
  return api(`/api/businesses/${businessId}`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
}

export function getEquipmentsByCommune(communeId) {
  return api(`/api/equipments/${communeId}`);
}

export function createEquipment(communeId, data) {
  return api(`/api/equipments/${communeId}`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function getPaymentsByCommune(communeOrUserId) {
  return api(`/api/payments/${communeOrUserId}`);
}

export function updateCommuneSettings(communeId, data) {
  return api(`/api/communes/${communeId}/settings`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function uploadImage(file, type = 'general') {
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
  const formData = new FormData();
  formData.append('image', file);
  formData.append('type', type); // logos, banners, news, reports

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3000'}/api/upload`, {
    method: 'POST',
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Erreur lors du téléchargement');
  }
  return data.url; // URL Cloudinary complète (https://res.cloudinary.com/...)
}
