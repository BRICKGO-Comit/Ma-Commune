-- ============================================
-- MA COMMUNE — Supabase Database Schema (MVP)
-- ============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. COMMUNES
-- ============================================
CREATE TABLE communes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code TEXT UNIQUE,
  region TEXT,
  department TEXT,
  population INTEGER,
  area_km2 NUMERIC,
  mayor_name TEXT,
  description TEXT,
  logo_url TEXT,
  banner_url TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. PROFILES (linked to Supabase Auth)
-- ============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'citizen' CHECK (role IN ('citizen', 'admin', 'super_admin')),
  commune_id UUID REFERENCES communes(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. COMMUNE ADMINS (multi-tenant link)
-- ============================================
CREATE TABLE commune_admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  commune_id UUID NOT NULL REFERENCES communes(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'editor', 'viewer')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, commune_id)
);

-- ============================================
-- 4. NEWS (actualités par commune)
-- ============================================
CREATE TABLE news (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  commune_id UUID NOT NULL REFERENCES communes(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  summary TEXT,
  image_url TEXT,
  category TEXT DEFAULT 'general',
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 5. REPORTS (signalements citoyens)
-- ============================================
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  commune_id UUID NOT NULL REFERENCES communes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('voirie', 'eclairage', 'proprete', 'eau', 'securite', 'autre')),
  photo_url TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  address TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved', 'rejected')),
  admin_response TEXT,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 6. USEFUL CONTACTS (numéros utiles)
-- ============================================
CREATE TABLE useful_contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  commune_id UUID NOT NULL REFERENCES communes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  category TEXT DEFAULT 'general' CHECK (category IN ('urgence', 'sante', 'education', 'administration', 'transport', 'general')),
  address TEXT,
  is_emergency BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_news_commune ON news(commune_id);
CREATE INDEX idx_news_published ON news(is_published, published_at DESC);
CREATE INDEX idx_reports_commune ON reports(commune_id);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_user ON reports(user_id);
CREATE INDEX idx_contacts_commune ON useful_contacts(commune_id);
CREATE INDEX idx_communes_name ON communes(name);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Communes: readable by everyone
ALTER TABLE communes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Communes are viewable by everyone" ON communes FOR SELECT USING (true);
CREATE POLICY "Communes are editable by super_admins" ON communes FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'super_admin')
);

-- Profiles: users can read all, edit own
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- News: readable by everyone, writable by commune admins
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published news are viewable by everyone" ON news FOR SELECT USING (is_published = true);
CREATE POLICY "Admins can manage news" ON news FOR ALL USING (
  EXISTS (SELECT 1 FROM commune_admins WHERE commune_admins.user_id = auth.uid() AND commune_admins.commune_id = news.commune_id)
);

-- Reports: readable by commune members, writable by authenticated
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reports are viewable by commune members" ON reports FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create reports" ON reports FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reports" ON reports FOR UPDATE USING (
  auth.uid() = user_id OR EXISTS (SELECT 1 FROM commune_admins WHERE commune_admins.user_id = auth.uid() AND commune_admins.commune_id = reports.commune_id)
);

-- Useful contacts: readable by everyone, writable by commune admins
ALTER TABLE useful_contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Contacts are viewable by everyone" ON useful_contacts FOR SELECT USING (true);
CREATE POLICY "Admins can manage contacts" ON useful_contacts FOR ALL USING (
  EXISTS (SELECT 1 FROM commune_admins WHERE commune_admins.user_id = auth.uid() AND commune_admins.commune_id = useful_contacts.commune_id)
);

-- Commune admins: managed by super admins
ALTER TABLE commune_admins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Commune admins viewable by admins" ON commune_admins FOR SELECT USING (
  auth.uid() = user_id OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'super_admin')
);
CREATE POLICY "Super admins can manage commune admins" ON commune_admins FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'super_admin')
);

-- ============================================
-- TRIGGER: Auto-create profile on signup
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- TRIGGER: Auto-update updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_communes_updated_at BEFORE UPDATE ON communes FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON news FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON reports FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- SEED DATA: Sample communes (Côte d'Ivoire)
-- ============================================
INSERT INTO communes (name, code, region, department, population, mayor_name, description, latitude, longitude) VALUES
  ('Port-Bouët', 'PB', 'Abidjan', 'Abidjan', 450000, '', 'Commune balnéaire d''Abidjan, connue pour ses plages et l''aéroport international.', 5.2588, -3.9260),
  ('Cocody', 'CO', 'Abidjan', 'Abidjan', 550000, '', 'Commune résidentielle et universitaire d''Abidjan.', 5.3590, -3.9790),
  ('Yopougon', 'YO', 'Abidjan', 'Abidjan', 1200000, '', 'Plus grande commune d''Abidjan en termes de population.', 5.3280, -4.0710),
  ('Plateau', 'PL', 'Abidjan', 'Abidjan', 12000, '', 'Centre administratif et des affaires d''Abidjan.', 5.3200, -4.0200),
  ('Treichville', 'TR', 'Abidjan', 'Abidjan', 150000, '', 'Commune historique et culturelle d''Abidjan.', 5.2980, -4.0080),
  ('Abobo', 'AB', 'Abidjan', 'Abidjan', 1100000, '', 'Commune populaire au nord d''Abidjan.', 5.4190, -4.0200),
  ('Marcory', 'MA', 'Abidjan', 'Abidjan', 250000, '', 'Commune résidentielle et commerciale d''Abidjan.', 5.3020, -3.9890),
  ('Koumassi', 'KO', 'Abidjan', 'Abidjan', 450000, '', 'Commune industrielle et résidentielle d''Abidjan.', 5.2970, -3.9520),
  ('Adjamé', 'AD', 'Abidjan', 'Abidjan', 400000, '', 'Commune commerciale majeure d''Abidjan.', 5.3580, -4.0280),
  ('Bouaké', 'BK', 'Gbêkê', 'Bouaké', 800000, '', 'Deuxième ville de Côte d''Ivoire, centre économique du centre.', 7.6930, -5.0361);
