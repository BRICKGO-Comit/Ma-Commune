const { v4: uuidv4 } = require('uuid');

// ============================================
// MOCK DATA — Communes de Côte d'Ivoire
// ============================================

const communes = [
  {
    id: 'c1a1a1a1-1111-1111-1111-111111111111',
    name: 'Port-Bouët',
    code: 'PB',
    region: 'Abidjan',
    department: 'Abidjan',
    population: 450000,
    area_km2: null,
    mayor_name: 'Sylvestre Emmou',
    description: "Port-Bouët est la porte d'entrée de la Côte d'Ivoire par voie aérienne. C'est une commune dynamique abritant l'aéroport international Félix Houphouët-Boigny, le port autonome d'Abidjan (Vridi) et de magnifiques plages très prisées.",
    history: "La commune de Port-Bouët tire son nom du Commandant Bouët-Willaumez qui vint en 1837 conclure des traités de commerce avec les chefs de Grand-Bassam. Elle s'est développée autour du phare érigé en 1930.",
    opening_hours: "Lun - Ven: 08h00 - 16h30",
    logo_url: null,
    banner_url: null,
    address: "Avenue de la Mairie, Port-Bouët",
    phone: "+225 27 21 27 55 00",
    email: "contact@portbouet.ci",
    website: "www.portbouet.ci",
    latitude: 5.2588,
    longitude: -3.9260,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'c2a2a2a2-2222-2222-2222-222222222222',
    name: 'Cocody',
    code: 'CO',
    region: 'Abidjan',
    department: 'Abidjan',
    population: 550000,
    area_km2: null,
    mayor_name: 'Jean-Marc Yacé',
    description: "Cocody est la commune résidentielle d'excellence à Abidjan. Elle abrite de nombreuses ambassades, l'Université Félix Houphouët-Boigny et les plus prestigieuses écoles du pays.",
    history: "Ancien village d'ébrié, Cocody est devenue une commune de plein exercice en 1980. Elle est le symbole de l'élégance et de la réussite académique ivoirienne.",
    opening_hours: "Lun - Ven: 07h30 - 17h00",
    logo_url: null,
    banner_url: null,
    address: "Hôtel de Ville de Cocody, Boulevard de France",
    phone: "+225 27 22 44 26 00",
    email: "infos@cocody.ci",
    website: "www.mairiecocody.ci",
    latitude: 5.3590,
    longitude: -3.9790,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'c3a3a3a3-3333-3333-3333-333333333333',
    name: 'Yopougon',
    code: 'YO',
    region: 'Abidjan',
    department: 'Abidjan',
    population: 1200000,
    area_km2: null,
    mayor_name: 'Adama Bictogo',
    description: "Yopougon, surnommée 'Poy' ou 'la cité de la joie', est la plus grande commune de Côte d'Ivoire. C'est un pôle industriel et commercial majeur avec une vie culturelle et nocturne légendaire (Rue Princesse).",
    history: "Créée dans les années 70 pour désengorger le centre d'Abidjan, Yopougon est devenue une véritable ville dans la ville, symbole du dynamisme populaire ivoirien.",
    opening_hours: "Lun - Ven: 08h00 - 17h00",
    logo_url: null,
    banner_url: null,
    address: "Mairie Centrale de Yopougon, Place Figayo",
    phone: "+225 27 23 45 12 34",
    email: "mairie@yopougon.ci",
    website: "www.yopougon.ci",
    latitude: 5.3280,
    longitude: -4.0710,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'c4a4a4a4-4444-4444-4444-444444444444',
    name: 'Plateau',
    code: 'PL',
    region: 'Abidjan',
    department: 'Abidjan',
    population: 12000,
    area_km2: null,
    mayor_name: 'Jacques Ehouo',
    description: "Le Plateau est le centre des affaires et le quartier administratif d'Abidjan. Avec ses gratte-ciels, il est souvent surnommé 'Le Petit Manhattan d'Afrique'. C'est le cœur décisionnel du pays.",
    history: "Ancien quartier européen à l'époque coloniale, le Plateau est devenu après l'indépendance le centre névralgique de l'administration et des finances de la Côte d'Ivoire.",
    opening_hours: "Lun - Ven: 08h00 - 16h30",
    logo_url: null,
    banner_url: null,
    address: "Mairie du Plateau, Avenue Crosson Duplessis",
    phone: "+225 27 20 22 17 48",
    email: "contact@plateau.ci",
    website: "www.plateau.ci",
    latitude: 5.3200,
    longitude: -4.0200,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'c5a5a5a5-5555-5555-5555-555555555555',
    name: 'Treichville',
    code: 'TR',
    region: 'Abidjan',
    department: 'Abidjan',
    population: 150000,
    area_km2: null,
    mayor_name: '',
    description: "Commune historique et culturelle d'Abidjan.",
    logo_url: null,
    banner_url: null,
    address: null,
    phone: null,
    email: null,
    website: null,
    latitude: 5.2980,
    longitude: -4.0080,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'c6a6a6a6-6666-6666-6666-666666666666',
    name: 'Abobo',
    code: 'AB',
    region: 'Abidjan',
    department: 'Abidjan',
    population: 1100000,
    area_km2: null,
    mayor_name: 'Kandia Camara',
    description: "Abobo est la commune la plus peuplée de Côte d'Ivoire. Surnommée 'Abobo la Guerre' pour son tempérament guerrier et protecteur, elle est aujourd'hui en pleine mutation avec de grands projets d'embellissement.",
    history: "Ancienne terre des ébrié, Abobo s'est développée avec le chemin de fer. Elle est aujourd'hui une plaque tournante du transport et de la jeunesse abidjanaise.",
    opening_hours: "Lun - Ven: 08h00 - 17h00",
    logo_url: null,
    banner_url: null,
    address: "Mairie d'Abobo, Place de la République",
    phone: "+225 27 24 39 39 39",
    email: "mairie@abobo.ci",
    website: "www.mairieabobo.ci",
    latitude: 5.4190,
    longitude: -4.0200,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'c7a7a7a7-7777-7777-7777-777777777777',
    name: 'Marcory',
    code: 'MA',
    region: 'Abidjan',
    department: 'Abidjan',
    population: 250000,
    area_km2: null,
    mayor_name: 'Aby Raoul',
    description: "Marcory est une commune carrefour chic et populaire. Elle abrite la zone 4 (quartier résidentiel et festif), de grands centres commerciaux et des infrastructures sportives de renommée.",
    history: "Marcory doit son nom à un explorateur. Elle s'est développée comme une commune de mixité où se côtoient toutes les classes sociales et nationalités.",
    opening_hours: "Lun - Ven: 08h00 - 17h00",
    logo_url: null,
    banner_url: null,
    address: "Mairie de Marcory, Avenue de la TSF",
    phone: "+225 27 21 26 55 55",
    email: "infos@marcory.ci",
    website: "www.marcory.ci",
    latitude: 5.3020,
    longitude: -3.9890,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'c8a8a8a8-8888-8888-8888-888888888888',
    name: 'Koumassi',
    code: 'KO',
    region: 'Abidjan',
    department: 'Abidjan',
    population: 450000,
    area_km2: null,
    mayor_name: '',
    description: "Commune industrielle et résidentielle d'Abidjan.",
    logo_url: null,
    banner_url: null,
    address: null,
    phone: null,
    email: null,
    website: null,
    latitude: 5.2970,
    longitude: -3.9520,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'c9a9a9a9-9999-9999-9999-999999999999',
    name: 'Adjamé',
    code: 'AD',
    region: 'Abidjan',
    department: 'Abidjan',
    population: 400000,
    area_km2: null,
    mayor_name: '',
    description: "Commune commerciale majeure d'Abidjan.",
    logo_url: null,
    banner_url: null,
    address: null,
    phone: null,
    email: null,
    website: null,
    latitude: 5.3580,
    longitude: -4.0280,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'c0b0b0b0-0000-0000-0000-000000000000',
    name: 'Bouaké',
    code: 'BK',
    region: 'Gbêkê',
    department: 'Bouaké',
    population: 800000,
    area_km2: null,
    mayor_name: '',
    description: 'Deuxième ville de Côte d\'Ivoire, centre économique du centre.',
    logo_url: null,
    banner_url: null,
    address: null,
    phone: null,
    email: null,
    website: null,
    latitude: 7.6930,
    longitude: -5.0361,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// ============================================
// MOCK USERS
// ============================================
const users = [
  {
    id: 'u1a1a1a1-1111-1111-1111-111111111111',
    email: 'admin@macommune.ci',
    full_name: 'Admin Principal',
    phone: '+225 07 00 00 00',
    avatar_url: null,
    role: 'super_admin',
    commune_id: null,
    password: 'admin123',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'u2a2a2a2-2222-2222-2222-222222222222',
    email: 'citoyen@test.ci',
    full_name: 'Jean Kouassi',
    phone: '+225 05 00 00 00',
    avatar_url: null,
    role: 'citizen',
    commune_id: 'c1a1a1a1-1111-1111-1111-111111111111',
    password: 'test123',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'admin-pb',
    email: 'admin@portbouet.ci',
    full_name: 'Admin Port-Bouët',
    role: 'admin',
    commune_id: 'c1a1a1a1-1111-1111-1111-111111111111', // Port-Bouët
    password: 'adminpb',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'admin-co',
    email: 'admin@cocody.ci',
    full_name: 'Admin Cocody',
    role: 'admin',
    commune_id: 'c2a2a2a2-2222-2222-2222-222222222222', // Cocody
    password: 'adminco',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// ============================================
// MOCK NEWS
// ============================================
const news = [
  {
    id: 'n1a1a1a1-1111-1111-1111-111111111111',
    commune_id: 'c1a1a1a1-1111-1111-1111-111111111111',
    title: 'Réhabilitation de la route principale de Port-Bouët',
    content: 'Les travaux de réhabilitation de la route principale reliant l\'aéroport au centre-ville de Port-Bouët débuteront le mois prochain. Le projet, financé par le gouvernement, permettra d\'améliorer considérablement la circulation dans la commune. Les travaux dureront environ 6 mois et incluront l\'élargissement de la chaussée, la construction de trottoirs et l\'installation d\'un nouveau système d\'éclairage public.',
    summary: 'Les travaux de réhabilitation de la route principale débuteront le mois prochain.',
    image_url: null,
    category: 'infrastructure',
    is_published: true,
    published_at: new Date().toISOString(),
    author_id: 'u1a1a1a1-1111-1111-1111-111111111111',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'n2a2a2a2-2222-2222-2222-222222222222',
    commune_id: 'c1a1a1a1-1111-1111-1111-111111111111',
    title: 'Campagne de vaccination gratuite à Port-Bouët',
    content: 'La mairie de Port-Bouët organise une campagne de vaccination gratuite pour les enfants de 0 à 5 ans. La campagne se déroulera dans tous les centres de santé de la commune du 15 au 30 mars. Les parents sont invités à se rendre au centre le plus proche avec le carnet de vaccination de leur enfant.',
    summary: 'Campagne de vaccination gratuite pour les enfants du 15 au 30 mars.',
    image_url: null,
    category: 'sante',
    is_published: true,
    published_at: new Date().toISOString(),
    author_id: 'u1a1a1a1-1111-1111-1111-111111111111',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'n3a3a3a3-3333-3333-3333-333333333333',
    commune_id: 'c2a2a2a2-2222-2222-2222-222222222222',
    title: 'Nouveau marché municipal à Cocody',
    content: 'Un nouveau marché municipal ouvrira ses portes à Cocody Angré le mois prochain. Ce marché moderne disposera de plus de 200 emplacements pour les commerçants, d\'un parking de 100 places et d\'espaces verts. Il permettra de décongestionner les marchés existants et de créer de nouvelles opportunités commerciales.',
    summary: 'Un nouveau marché moderne ouvrira ses portes à Cocody Angré.',
    image_url: null,
    category: 'commerce',
    is_published: true,
    published_at: new Date().toISOString(),
    author_id: 'u1a1a1a1-1111-1111-1111-111111111111',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'n4a4a4a4-4444-4444-4444-444444444444',
    commune_id: 'c3a3a3a3-3333-3333-3333-333333333333',
    title: 'Festival culturel de Yopougon 2026',
    content: 'La commune de Yopougon organise son festival culturel annuel du 1er au 7 avril 2026. Au programme : concerts, expositions artisanales, compétitions sportives et animations pour enfants. L\'entrée est gratuite pour tous les résidents de la commune.',
    summary: 'Festival culturel annuel du 1er au 7 avril avec concerts et expositions.',
    image_url: null,
    category: 'culture',
    is_published: true,
    published_at: new Date().toISOString(),
    author_id: 'u1a1a1a1-1111-1111-1111-111111111111',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'n5a5a5a5-5555-5555-5555-555555555555',
    commune_id: 'c4a4a4a4-4444-4444-4444-444444444444',
    title: 'Modernisation du quartier administratif du Plateau',
    content: 'Le projet de modernisation du quartier administratif du Plateau avance à grands pas. La rénovation des façades des ministères et l\'embellissement des espaces publics visent à renforcer le statut de vitrine économique d\'Abidjan.',
    summary: 'Rénovation des façades ministérielles et embellissement des espaces publics.',
    image_url: null,
    category: 'infrastructure',
    is_published: true,
    published_at: new Date().toISOString(),
    author_id: 'u1a1a1a1-1111-1111-1111-111111111111',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'n6',
    commune_id: 'c3a3a3a3-3333-3333-3333-333333333333',
    title: 'Inauguration du nouveau complexe sportif de Yopougon',
    content: 'Un nouveau complexe sportif ultra-moderne a été inauguré ce week-end à Yopougon. Il comprend un terrain de football aux normes FIFA, une piscine olympique et plusieurs salles omnisports. Ce projet vise à encourager la pratique sportive chez les jeunes de la commune.',
    summary: 'Le nouveau complexe sportif Figayo ouvre ses portes.',
    image_url: null,
    category: 'sport',
    is_published: true,
    published_at: new Date().toISOString(),
    author_id: 'u1a1a1a1-1111-1111-1111-111111111111',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'n7',
    commune_id: 'c4a4a4a4-4444-4444-4444-444444444444',
    title: 'Dématérialisation des services municipaux au Plateau',
    content: 'La mairie du Plateau lance sa plateforme de e-services. Les citoyens peuvent désormais effectuer leurs demandes d\'état civil et payer leurs taxes municipales en ligne, réduisant ainsi les délais d\'attente de 70%.',
    summary: 'Le Plateau passe au 100% digital pour ses citoyens.',
    image_url: null,
    category: 'innovation',
    is_published: true,
    published_at: new Date().toISOString(),
    author_id: 'u1a1a1a1-1111-1111-1111-111111111111',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'n8',
    commune_id: 'c2a2a2a2-2222-2222-2222-222222222222',
    title: 'Rentrée solennelle à l\'Université de Cocody',
    content: 'Le Président de l\'Université a annoncé une série de réformes pour l\'année académique 2026, incluant la numérisation complète des inscriptions et de nouveaux espaces de coworking pour les étudiants.',
    summary: 'Réformes et nouveaux espaces étudiants pour la rentrée 2026.',
    image_url: null,
    category: 'education',
    is_published: true,
    published_at: new Date().toISOString(),
    author_id: 'u1a1a1a1-1111-1111-1111-111111111111',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'n9',
    commune_id: 'c3a3a3a3-3333-3333-3333-333333333333',
    title: 'Opération Grand Ménage à Yopougon',
    content: 'La municipalité lance une grande opération de salubrité ce samedi. Tous les habitants sont invités à nettoyer devant leurs domiciles et commerces. Des camions de collecte passeront toute la journée.',
    summary: 'Journée de salubrité générale ce samedi à Yopougon.',
    image_url: null,
    category: 'environnement',
    is_published: true,
    published_at: new Date().toISOString(),
    author_id: 'u1a1a1a1-1111-1111-1111-111111111111',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'n10',
    commune_id: 'c6a6a6a6-6666-6666-6666-666666666666',
    title: 'Inauguration de l\'Echangeur de Macaci à Abobo',
    content: 'Le nouvel échangeur de Macaci est désormais ouvert à la circulation. Cet ouvrage majeur permettra de fluidifier le trafic entre Abobo et les autres communes d\'Abidjan, réduisant les temps de trajet de moitié.',
    summary: 'Ouverture officielle de l\'échangeur de Macaci pour fluidifier le trafic.',
    image_url: null,
    category: 'infrastructure',
    is_published: true,
    published_at: new Date().toISOString(),
    author_id: 'u1a1a1a1-1111-1111-1111-111111111111',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'n11',
    commune_id: 'c7a7a7a7-7777-7777-7777-777777777777',
    title: 'Nouveau système de gestion des déchets à Marcory',
    content: 'La mairie de Marcory déploie de nouveaux bacs de tri sélectif dans toute la zone 4. Cette initiative s\'inscrit dans la politique Ville Verte de la municipalité.',
    summary: 'Marcory renforce son engagement écologique avec le tri sélectif.',
    image_url: null,
    category: 'environnement',
    is_published: true,
    published_at: new Date().toISOString(),
    author_id: 'u1a1a1a1-1111-1111-1111-111111111111',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'n12',
    commune_id: 'c1a1a1a1-1111-1111-1111-111111111111',
    title: 'Port-Bouët : Célébration de la Journée de la Femme',
    content: 'Une grande cérémonie a eu lieu à la mairie pour honorer les femmes commerçantes de la commune. Des attestations de mérite et des kits d\'installation ont été distribués.',
    summary: 'Cérémonie d\'hommage et soutien aux femmes de Port-Bouët.',
    image_url: null,
    category: 'social',
    is_published: true,
    published_at: new Date().toISOString(),
    author_id: 'u1a1a1a1-1111-1111-1111-111111111111',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'n13',
    commune_id: 'c5a5a5a5-5555-5555-5555-555555555555',
    title: 'Festival des Arts de Treichville',
    content: 'Le mythique quartier de Treichville vibrera au rythme du jazz et de la danse traditionnelle ce week-end à l\'Avenue 8.',
    summary: 'Le Jazz à l\'honneur pour le festival des arts.',
    image_url: null,
    category: 'culture',
    is_published: true,
    published_at: new Date().toISOString(),
    author_id: 'u1a1a1a1-1111-1111-1111-111111111111',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'n14',
    commune_id: 'c5a5a5a5-5555-5555-5555-555555555555',
    title: 'Modernisation du Marché de Treichville',
    content: 'Les travaux de rénovation du pavillon central du grand marché de Treichville ont débuté. Le maire Aby Raoul assure que les commerçants seront relogés temporairement.',
    summary: 'Rénovation majeure pour le poumon économique de la commune.',
    image_url: null,
    category: 'infrastructure',
    is_published: true,
    published_at: new Date().toISOString(),
    author_id: 'u1a1a1a1-1111-1111-1111-111111111111',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// ============================================
// MOCK REPORTS
// ============================================
const reports = [
  {
    id: 'r1a1a1a1-1111-1111-1111-111111111111',
    commune_id: 'c1a1a1a1-1111-1111-1111-111111111111',
    user_id: 'u2a2a2a2-2222-2222-2222-222222222222',
    title: 'Nid de poule dangereux sur la route de l\'aéroport',
    description: 'Un nid de poule de grande taille s\'est formé sur la voie principale menant à l\'aéroport, à hauteur du carrefour Akwaba. Il représente un danger pour les automobilistes et les deux-roues.',
    category: 'voirie',
    photo_url: null,
    latitude: 5.2600,
    longitude: -3.9280,
    address: 'Route de l\'aéroport, Carrefour Akwaba',
    status: 'pending',
    admin_response: null,
    resolved_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'r2a2a2a2-2222-2222-2222-222222222222',
    commune_id: 'c1a1a1a1-1111-1111-1111-111111111111',
    user_id: 'u2a2a2a2-2222-2222-2222-222222222222',
    title: 'Lampadaire en panne depuis 2 semaines',
    description: 'Le lampadaire situé devant l\'école primaire de Gonzagueville ne fonctionne plus depuis 2 semaines. La zone est très sombre la nuit, ce qui pose des problèmes de sécurité.',
    category: 'eclairage',
    photo_url: null,
    latitude: 5.2550,
    longitude: -3.9300,
    address: 'Devant école primaire Gonzagueville',
    status: 'in_progress',
    admin_response: 'Merci pour votre signalement. Une équipe technique sera dépêchée cette semaine.',
    resolved_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'r3a3a3a3-3333-3333-3333-333333333333',
    commune_id: 'c2a2a2a2-2222-2222-2222-222222222222',
    user_id: 'u2a2a2a2-2222-2222-2222-222222222222',
    title: 'Dépôt sauvage d\'ordures à Cocody Angré',
    description: 'Un dépôt sauvage d\'ordures s\'est formé au croisement de la rue des Jardins et du boulevard principal. L\'odeur est insupportable et attire des nuisibles.',
    category: 'proprete',
    photo_url: null,
    latitude: 5.3610,
    longitude: -3.9800,
    address: 'Cocody Angré, croisement rue des Jardins',
    status: 'resolved',
    admin_response: 'Le site a été nettoyé. Des poubelles supplémentaires ont été installées.',
    resolved_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'r4a4a4a4-4444-4444-4444-444444444444',
    commune_id: 'c3a3a3a3-3333-3333-3333-333333333333',
    user_id: 'u2a2a2a2-2222-2222-2222-222222222222',
    title: 'Fuite d\'eau importante à Yopougon Selmer',
    description: 'Une canalisation a sauté devant le collège moderne, créant une inondation sur la chaussée. Des milliers de litres se perdent depuis ce matin.',
    category: 'eau',
    photo_url: null,
    latitude: 5.3300,
    longitude: -4.0700,
    address: 'Yopougon Selmer, devant le collège moderne',
    status: 'pending',
    admin_response: null,
    resolved_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'r5',
    commune_id: 'c4a4a4a4-4444-4444-4444-444444444444',
    user_id: 'u2a2a2a2-2222-2222-2222-222222222222',
    title: 'Ascenseur en panne au parking public',
    description: 'L\'ascenseur principal du parking du Plateau Central est en panne depuis plus de 48h, ce qui pose de réels problèmes pour les personnes à mobilité réduite.',
    category: 'infrastructure',
    photo_url: null,
    latitude: 5.3210,
    longitude: -4.0190,
    address: 'Parking Central du Plateau',
    status: 'in_progress',
    admin_response: 'Une équipe de maintenance est sur place.',
    resolved_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'r6',
    commune_id: 'c1a1a1a1-1111-1111-1111-111111111111',
    user_id: 'u2a2a2a2-2222-2222-2222-222222222222',
    title: 'Nid de poule dangereux',
    description: 'Un trou énorme sur la route principale vers l\'aéroport.',
    category: 'voirie',
    status: 'pending',
    address: 'Avenue de l\'Aéroport, Port-Bouët',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'r7',
    commune_id: 'c2a2a2a2-2222-2222-2222-222222222222',
    title: 'Lampadaires éteints',
    description: 'Toute la rue des Jardins est dans le noir.',
    category: 'eclairage',
    status: 'pending',
    address: 'Rue des Jardins, Cocody',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// ============================================
// MOCK USEFUL CONTACTS
// ============================================
const useful_contacts = [
  {
    id: 'ct1a1a1a-1111-1111-1111-111111111111',
    commune_id: 'c1a1a1a1-1111-1111-1111-111111111111',
    name: 'Police Nationale - Commissariat Port-Bouët',
    phone: '+225 27 21 27 22 02',
    email: null,
    category: 'urgence',
    address: 'Boulevard de Port-Bouët',
    is_emergency: true,
    sort_order: 1,
    created_at: new Date().toISOString()
  },
  {
    id: 'ct2a2a2a-2222-2222-2222-222222222222',
    commune_id: 'c1a1a1a1-1111-1111-1111-111111111111',
    name: 'SAMU - Urgences médicales',
    phone: '185',
    email: null,
    category: 'sante',
    address: null,
    is_emergency: true,
    sort_order: 2,
    created_at: new Date().toISOString()
  },
  {
    id: 'ct3a3a3a-3333-3333-3333-333333333333',
    commune_id: 'c1a1a1a1-1111-1111-1111-111111111111',
    name: 'Pompiers',
    phone: '180',
    email: null,
    category: 'urgence',
    address: null,
    is_emergency: true,
    sort_order: 3,
    created_at: new Date().toISOString()
  },
  {
    id: 'ct4a4a4a-4444-4444-4444-444444444444',
    commune_id: 'c1a1a1a1-1111-1111-1111-111111111111',
    name: 'Mairie de Port-Bouët',
    phone: '+225 27 21 27 55 00',
    email: 'mairie@portbouet.ci',
    category: 'administration',
    address: 'Avenue de la Mairie, Port-Bouët',
    is_emergency: false,
    sort_order: 4,
    created_at: new Date().toISOString()
  },
  {
    id: 'ct5a5a5a-5555-5555-5555-555555555555',
    commune_id: 'c1a1a1a1-1111-1111-1111-111111111111',
    name: 'Hôpital Général de Port-Bouët',
    phone: '+225 27 21 27 33 00',
    email: null,
    category: 'sante',
    address: 'Quartier Vridi',
    is_emergency: false,
    sort_order: 5,
    created_at: new Date().toISOString()
  },
  {
    id: 'ct6a6a6a-6666-6666-6666-666666666666',
    commune_id: 'c2a2a2a2-2222-2222-2222-222222222222',
    name: 'Mairie de Cocody',
    phone: '+225 27 22 44 26 00',
    email: 'mairie@cocody.ci',
    category: 'administration',
    address: 'Rue des Jardins, Cocody',
    is_emergency: false,
    sort_order: 1,
    created_at: new Date().toISOString()
  },
  {
    id: 'ct7a7a7a-7777-7777-7777-777777777777',
    commune_id: 'c2a2a2a2-2222-2222-2222-222222222222',
    name: 'CHU de Cocody',
    phone: '+225 27 22 44 91 50',
    email: null,
    category: 'sante',
    address: 'Boulevard de l\'Université, Cocody',
    is_emergency: true,
    sort_order: 2,
    created_at: new Date().toISOString()
  },
  {
    id: 'ct8a8a8a-8888-8888-8888-888888888888',
    commune_id: 'c3a3a3a3-3333-3333-3333-333333333333',
    name: 'District de Police - Yopougon',
    phone: '+225 27 23 45 12 34',
    email: null,
    category: 'urgence',
    address: 'Yopougon Centre',
    is_emergency: true,
    sort_order: 1,
    created_at: new Date().toISOString()
  },
  {
    id: 'ct11',
    commune_id: 'c3a3a3a3-3333-3333-3333-333333333333',
    name: 'Mairie de Yopougon',
    phone: '+225 27 23 45 12 34',
    email: 'contact@yopougon.ci',
    category: 'administration',
    address: 'Place Figayo',
    is_emergency: false,
    sort_order: 2,
    created_at: new Date().toISOString()
  },
  {
    id: 'ct12',
    commune_id: 'c4a4a4a4-4444-4444-4444-444444444444',
    name: 'Mairie du Plateau',
    phone: '+225 27 20 22 17 48',
    email: 'mairie@plateau.ci',
    category: 'administration',
    address: 'Avenue Crosson Duplessis',
    is_emergency: false,
    sort_order: 3,
    created_at: new Date().toISOString()
  }
];

// ============================================
// MOCK COMMUNE ADMINS
// ============================================
const commune_admins = [
  {
    id: 'ca1a1a1a-1111-1111-1111-111111111111',
    user_id: 'u1a1a1a1-1111-1111-1111-111111111111',
    commune_id: 'c1a1a1a1-1111-1111-1111-111111111111',
    role: 'admin',
    created_at: new Date().toISOString()
  }
];

// ============================================
// MOCK PROCEDURES
// ============================================
const procedures = [
  {
    id: 'p1',
    commune_id: 'c1a1a1a1-1111-1111-1111-111111111111',
    title: 'Extrait d\'acte de naissance',
    description: 'Obtention d\'un extrait d\'acte de naissance pour les personnes nées à Port-Bouët.',
    steps: [
      'Se rendre à l\'état civil de la mairie',
      'Fournir la photocopie de l\'ancien extrait ou le livret de famille',
      'S\'acquitter des frais de timbre (500 FCFA)',
      'Délai : 48h'
    ],
    documents: ['Livret de famille', 'Piece d\'identité des parents'],
    price: '500 FCFA',
    duration: '48 heures'
  },
  {
    id: 'p2',
    commune_id: 'c1a1a1a1-1111-1111-1111-111111111111',
    title: 'Certificat de résidence',
    description: 'Document attestant de votre domicile effectif dans la commune.',
    steps: [
      'Visite du chef de quartier pour attestation',
      'Présentations à la mairie avec deux témoins',
      'Timbre municipal (1000 FCFA)'
    ],
    documents: ['Facture CIE/SODECI récente', 'CNI', 'Attestation du chef de quartier'],
    price: '1000 FCFA',
    duration: '24 heures'
  },
  {
    id: 'p3',
    commune_id: 'c2a2a2a2-2222-2222-2222-222222222222',
    title: 'Légalisation de documents',
    description: 'Certification de la conformité d\'une copie à son original.',
    steps: [
      'Présenter l\'original et la copie',
      'Timbre municipal (200 FCFA)',
      'Dépôt au guichet dédié'
    ],
    documents: ['Original du document', 'Copie lisible'],
    price: '200 FCFA',
    duration: 'Immédiat'
  },
  {
    id: 'p4',
    commune_id: 'c3a3a3a3-3333-3333-3333-333333333333',
    title: 'Certificat de Vie et Entretien',
    description: 'Preuve de vie d\'une personne sous votre garde.',
    steps: [
      'Présence physique de la personne concernée',
      'Pièce d\'identité du déclarant',
      'Timbre (500 FCFA)'
    ],
    documents: ['CNI du déclarant', 'Livret de famille'],
    price: '500 FCFA',
    duration: '4 heures'
  },
  {
    id: 'p5',
    commune_id: 'c4a4a4a4-4444-4444-4444-444444444444',
    title: 'Autorisation d\'occupation du domaine public',
    description: 'Pour l\'installation de terrasses, kiosques ou étals au Plateau.',
    steps: [
      'Demande manuscrite adressée au Maire',
      'Plan de situation',
      'Paiement de la redevance annuelle'
    ],
    documents: ['Formulaire A1', 'Photo du lieu'],
    price: 'Variable selon surface',
    duration: '15 jours'
  },
  {
    id: 'p6',
    commune_id: 'c6a6a6a6-6666-6666-6666-666666666666',
    title: 'Dossier de Mariage - Pièces à fournir',
    description: 'Guide pour constituer votre dossier de mariage à la mairie d\'Abobo.',
    steps: [
      'Extraits de naissance originaux (moins de 3 mois)',
      'Photocopies des CNI des mariés et des témoins',
      'Certificat de résidence',
      'Délai de publication des bans : 15 jours'
    ],
    documents: ['Extraits de naissance', 'CNI témoins'],
    price: 'Libre',
    duration: '15 jours d\'attente'
  },
  {
    id: 'p7',
    commune_id: 'c7a7a7a7-7777-7777-7777-777777777777',
    title: 'Certificat de Non-Imposition',
    description: 'Document requis pour certaines bourses scolaires et aides sociales.',
    steps: [
      'Présenter le carnet de famille',
      'Engagement sur l\'honneur de non-salarié',
      'Timbre de 1000 FCFA'
    ],
    documents: ['Carnet de famille', 'CNI'],
    price: '1000 FCFA',
    duration: '24 heures'
  }
];

// ============================================
// MOCK EVENTS (AGENDA)
// ============================================
const events = [
  {
    id: 'e1',
    commune_id: 'c1a1a1a1-1111-1111-1111-111111111111',
    title: 'Nettoyage des plages de Vridi',
    description: 'Grande journée de mobilisation citoyenne pour nettoyer nos plages avant la saison touristique.',
    date: '2026-04-12T08:00:00Z',
    location: 'Plage de Vridi 3',
    organizer: 'Mairie de Port-Bouët',
    category: 'environnement'
  },
  {
    id: 'e2',
    commune_id: 'c2a2a2a2-2222-2222-2222-222222222222',
    title: 'Concours Jeunes Talents Cocody',
    description: 'Compétition artistique pour les jeunes de 15 à 25 ans habitant Cocody.',
    date: '2026-05-20T14:00:00Z',
    location: 'Hôtel de Ville de Cocody',
    organizer: 'Direction de la Culture',
    category: 'culture'
  },
  {
    id: 'e3',
    commune_id: 'c3a3a3a3-3333-3333-3333-333333333333',
    title: 'Tournoi Inter-Quartiers Yopougon',
    description: 'La plus grande compétition de football de quartier pour les vacances.',
    date: '2026-07-05T09:00:00Z',
    location: 'Stade de la BAE',
    organizer: 'Mairie de Yopougon',
    category: 'sport'
  },
  {
    id: 'e4',
    commune_id: 'c4a4a4a4-4444-4444-4444-444444444444',
    title: 'Forum de l\'Emploi Plateau 2026',
    description: 'Rencontre annuelle entre les entreprises du Plateau et les jeunes diplômés.',
    date: '2026-06-15T08:30:00Z',
    location: 'Immeuble de la Pyramide',
    organizer: 'Mairie du Plateau',
    category: 'reunion'
  },
  {
    id: 'e5',
    commune_id: 'c1a1a1a1-1111-1111-1111-111111111111',
    title: 'Fête de la Mer à Port-Bouët',
    description: 'Célébration traditionnelle des pêcheurs avec régates et dégustations.',
    date: '2026-08-15T10:00:00Z',
    location: 'Phare de Port-Bouët',
    organizer: 'Comité des Fêtes',
    category: 'culture'
  },
  {
    id: 'e6',
    commune_id: 'c6a6a6a6-6666-6666-6666-666666666666',
    title: 'Fête de la Jeunesse Abobo',
    description: 'Grands concerts gratuits et tournois sportifs pendant tout le week-end.',
    date: '2026-04-20T16:00:00Z',
    location: 'Rond-point d\'Abobo',
    organizer: 'Direction Jeunesse',
    category: 'culture'
  },
  {
    id: 'e7',
    commune_id: 'c7a7a7a7-7777-7777-7777-777777777777',
    title: 'Marché de Nuit Marcory Zone 4',
    description: 'Exposition d\'artisans et dégustations gastronomiques sous les étoiles.',
    date: '2026-05-30T19:30:00Z',
    location: 'Avenue 8, Zone 4',
    organizer: 'Association des Commerçants',
    category: 'fete'
  }
];

// ============================================
// MOCK BUSINESSES
// ============================================
const businesses = [
  {
    id: 'b1',
    commune_id: 'c4a4a4a4-4444-4444-4444-444444444444',
    name: 'Café de la Paix',
    description: 'Boulangerie et pâtisserie artisanale en plein cœur du Plateau.',
    category: 'restauration',
    phone: '+225 27 20 21 00 00',
    address: 'Avenue Chardy, Plateau',
    website: 'www.cafespaix.ci',
    rating: 4.5
  },
  {
    id: 'b2',
    commune_id: 'c2a2a2a2-2222-2222-2222-222222222222',
    name: 'Supermarché Casino',
    description: 'Produits frais, épicerie fine et articles de maison.',
    category: 'commerce',
    phone: '+225 27 22 44 00 00',
    address: 'Vallon, Cocody',
    website: 'www.casino.ci',
    rating: 4.2
  },
  {
    id: 'b3',
    commune_id: 'c3a3a3a3-3333-3333-3333-333333333333',
    name: 'Maquis du Val',
    description: 'Cuisine ivoirienne authentique et ambiance conviviale.',
    category: 'restauration',
    phone: '+225 27 23 45 45 45',
    address: 'Yopougon Selmer',
    rating: 4.8
  }
];

// ============================================
// MOCK EQUIPMENTS
// ============================================
const equipments = [
  {
    id: 'eq1',
    commune_id: 'c3a3a3a3-3333-3333-3333-333333333333',
    name: 'Stade Municipal de Yopougon',
    type: 'sport',
    description: 'Terrain de football, piste d\'athlétisme et gradins.',
    address: 'Quartier Selmer',
    status: 'open'
  },
  {
    id: 'eq2',
    commune_id: 'c4a4a4a4-4444-4444-4444-444444444444',
    name: 'Bibliothèque Nationale',
    type: 'culture',
    description: 'Espace de lecture, archives et salle de conférence.',
    address: 'Avenue de la République, Plateau',
    status: 'open'
  },
  {
    id: 'eq3',
    commune_id: 'c2a2a2a2-2222-2222-2222-222222222222',
    name: 'Piscine État Major',
    type: 'loisir',
    description: 'Bassin olympique ouvert au public le week-end.',
    address: 'Cocody Boulevard de France',
    status: 'closed'
  }
];

// ============================================
// MOCK PAYMENTS (TAXES)
// ============================================
const payments = [
  {
    id: 'pay1',
    user_id: 'u1a1a1a1-1111-1111-1111-111111111111',
    commune_id: 'c4a4a4a4-4444-4444-4444-444444444444',
    amount: 15000,
    type: 'taxe_habitation',
    status: 'paid',
    description: 'Taxe d\'habitation 2025',
    created_at: '2025-01-15T10:00:00Z'
  },
  {
    id: 'pay2',
    user_id: 'u1a1a1a1-1111-1111-1111-111111111111',
    commune_id: 'c4a4a4a4-4444-4444-4444-444444444444',
    amount: 5000,
    type: 'taxe_voirie',
    status: 'pending',
    description: 'Taxe de voirie - Trimestre 1',
    created_at: '2026-03-01T14:30:00Z'
  }
];

module.exports = {
  communes,
  users,
  news,
  reports,
  useful_contacts,
  commune_admins,
  procedures,
  events,
  businesses,
  equipments,
  payments,
  // Helper to generate new IDs
  generateId: () => uuidv4()
};
