'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getCommunes, getCommuneById, updateCommuneSettings, uploadImage } from '../../../lib/api';

export default function SettingsPage() {
  const params = useParams();
  const slug = params.slug;

  const [communes, setCommunes] = useState([]);
  const [selectedCommune, setSelectedCommune] = useState('');
  const [currentCommune, setCurrentCommune] = useState(null);
  
  const [formData, setFormData] = useState({
    logo_url: '',
    banner_url: '',
    description: '',
    mayor_name: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    opening_hours: ''
  });
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    loadCommunes();
  }, [slug]);

  useEffect(() => {
    if (selectedCommune) {
      loadCommuneData(selectedCommune);
    }
  }, [selectedCommune]);

  // FIXME function signature
  const loadCommunes = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('admin_user') || '{}');
      const isSuperAdmin = userData.role === 'super_admin';

      const res = await getCommunes();
      const list = res.data || [];
      setCommunes(list);

      if (slug !== 'console') {
        const communeData = list.find(c => c.slug === slug || c.name.toLowerCase() === slug.toLowerCase());
        if (communeData) {
          setSelectedCommune(communeData.id);
        }
      } else if (!isSuperAdmin && userData.commune_id) {
        setSelectedCommune(userData.commune_id);
      } else if (list.length > 0) {
        setSelectedCommune(list[0].id);
      }
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  const loadCommuneData = async (communeId) => {
    try {
      const res = await getCommuneById(communeId);
      const data = res.data;
      setCurrentCommune(data);
      setFormData({
        logo_url: data?.logo_url || '',
        banner_url: data?.banner_url || '',
        description: data?.description || '',
        mayor_name: data?.mayor_name || '',
        address: data?.address || '',
        phone: data?.phone || '',
        email: data?.email || '',
        website: data?.website || '',
        opening_hours: data?.opening_hours || ''
      });
      setSuccessMsg('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      setSaving(true);
      const url = await uploadImage(file);
      setFormData(prev => ({ ...prev, [field]: url }));
    } catch (err) {
      alert("Erreur lors de l'upload : " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    try {
      await updateCommuneSettings(selectedCommune, formData);
      setSuccessMsg('Paramètres enregistrés avec succès ! L\'application mobile a été mise à jour.');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      alert('Erreur: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}${url}`;
  };

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2>Paramètres et Personnalisation {currentCommune ? `— ${currentCommune.name}` : ''}</h2>
          {slug === 'console' && (
            <div className="actions">
              <select value={selectedCommune} onChange={(e) => setSelectedCommune(e.target.value)}>
                {communes.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="card-body" style={{ padding: '24px' }}>
          {successMsg && (
            <div style={{ padding: '12px 16px', backgroundColor: '#d4edda', color: '#155724', borderRadius: '4px', marginBottom: '20px', fontWeight: '500' }}>
              ✅ {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', maxWidth: '900px' }}>
            
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontWeight: 600, display: 'block', marginBottom: '8px' }}>Logo de la Mairie</label>
              {formData.logo_url && (
                <div style={{ marginBottom: 10 }}>
                  <img src={getImageUrl(formData.logo_url)} alt="Logo" style={{ height: 60, objectFit: 'contain' }} />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, 'logo_url')}
                className="form-control"
              />
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontWeight: 600, display: 'block', marginBottom: '8px' }}>Image de couverture</label>
              {formData.banner_url && (
                <div style={{ marginBottom: 10 }}>
                  <img src={getImageUrl(formData.banner_url)} alt="Bannière" style={{ height: 100, width: '100%', objectFit: 'cover', borderRadius: 8 }} />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, 'banner_url')}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label style={{ fontWeight: 600, display: 'block', marginBottom: '8px' }}>Nom du Maire</label>
              <input
                type="text"
                value={formData.mayor_name}
                onChange={(e) => setFormData({...formData, mayor_name: e.target.value})}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label style={{ fontWeight: 600, display: 'block', marginBottom: '8px' }}>Téléphone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label style={{ fontWeight: 600, display: 'block', marginBottom: '8px' }}>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label style={{ fontWeight: 600, display: 'block', marginBottom: '8px' }}>Site web</label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({...formData, website: e.target.value})}
                className="form-control"
              />
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontWeight: 600, display: 'block', marginBottom: '8px' }}>Adresse physique</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="form-control"
              />
            </div>
            
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontWeight: 600, display: 'block', marginBottom: '8px' }}>Horaires d'ouverture</label>
              <input
                type="text"
                value={formData.opening_hours}
                onChange={(e) => setFormData({...formData, opening_hours: e.target.value})}
                className="form-control"
                placeholder="Ex: Lun - Ven: 08h00 - 16h30"
              />
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontWeight: 600, display: 'block', marginBottom: '8px', fontSize: '16px' }}>Description de la Commune / Histoire</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="form-control"
                rows="5"
                placeholder="Présentez brièvement votre commune aux citoyens..."
                style={{ resize: 'vertical' }}
              />
            </div>

            <div style={{ marginTop: '10px', gridColumn: '1 / -1' }}>
              <button type="submit" className="btn btn-primary" disabled={saving} style={{ padding: '10px 24px', fontSize: '16px' }}>
                {saving ? 'Enregistrement...' : 'Enregistrer les informations'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
