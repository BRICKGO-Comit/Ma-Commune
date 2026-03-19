const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
const mockData = require('../src/data/mockData');
const { v4: uuidv4, validate: validateUuid } = require('uuid');

async function seed() {
  console.log('🚀 Starting Supabase Seeding...');

  // Helper to ensure valid UUID
  const toUuid = (id) => {
    if (validateUuid(id)) return id;
    // Simple hash-like mapping to keep consistency if needed, 
    // but for seeding new data, random is fine as long as we map them correctly.
    return uuidv4();
  };

  // Mapping for non-uuid IDs to new ones
  const idMap = {};
  const getMappedId = (oldId) => {
    if (validateUuid(oldId)) return oldId;
    if (!idMap[oldId]) idMap[oldId] = uuidv4();
    return idMap[oldId];
  };

  try {
    // 1. Communes
    console.log('--- Seeding Communes ---');
    const communesToInsert = mockData.communes.map(c => ({
      ...c,
      id: getMappedId(c.id)
    }));
    await insertData('communes', communesToInsert);

    // 2. Users (including Admins)
    console.log('--- Seeding Users ---');
    const usersToInsert = mockData.users.map(u => ({
      ...u,
      id: getMappedId(u.id),
      commune_id: u.commune_id ? getMappedId(u.commune_id) : null
    }));
    await insertData('users', usersToInsert);

    // 3. News
    console.log('--- Seeding News ---');
    const newsToInsert = mockData.news.map(n => ({
      ...n,
      id: getMappedId(n.id),
      commune_id: getMappedId(n.commune_id),
      author_id: getMappedId(n.author_id)
    }));
    await insertData('news', newsToInsert);

    // 4. Events
    console.log('--- Seeding Events ---');
    const eventsToInsert = mockData.events.map(e => ({
      ...e,
      id: getMappedId(e.id),
      commune_id: getMappedId(e.commune_id)
    }));
    await insertData('events', eventsToInsert);

    // 5. Equipments
    console.log('--- Seeding Equipments ---');
    const equipmentsToInsert = mockData.equipments.map(eq => ({
      ...eq,
      id: getMappedId(eq.id),
      commune_id: getMappedId(eq.commune_id)
    }));
    await insertData('equipments', equipmentsToInsert);

    // 6. Businesses
    console.log('--- Seeding Businesses ---');
    const businessesToInsert = (mockData.businesses || []).map(b => ({
      ...b,
      id: getMappedId(b.id),
      commune_id: getMappedId(b.commune_id)
    }));
    if (businessesToInsert.length > 0) {
      await insertData('businesses', businessesToInsert);
    }

    // 7. Contacts
    console.log('--- Seeding Contacts ---');
    const contactsToInsert = (mockData.useful_contacts || []).map(c => ({
      ...c,
      id: getMappedId(c.id),
      commune_id: getMappedId(c.commune_id)
    }));
    if (contactsToInsert.length > 0) {
      await insertData('useful_contacts', contactsToInsert);
    }

    // 8. Procedures
    console.log('--- Seeding Procedures ---');
    const proceduresToInsert = (mockData.procedures || []).map(p => ({
      ...p,
      id: getMappedId(p.id),
      commune_id: getMappedId(p.commune_id)
    }));
    if (proceduresToInsert.length > 0) {
      await insertData('procedures', proceduresToInsert);
    }

    // 9. Reports
    console.log('--- Seeding Reports ---');
    const reportsToInsert = (mockData.reports || []).map(r => ({
      ...r,
      id: getMappedId(r.id),
      commune_id: getMappedId(r.commune_id),
      user_id: getMappedId(r.user_id) || null
    }));
    if (reportsToInsert.length > 0) {
      await insertData('reports', reportsToInsert);
    }

    // 10. Payments
    console.log('--- Seeding Payments ---');
    const paymentsToInsert = (mockData.payments || []).map(p => ({
      ...p,
      id: getMappedId(p.id),
      user_id: getMappedId(p.user_id),
      commune_id: getMappedId(p.commune_id)
    }));
    if (paymentsToInsert.length > 0) {
      await insertData('payments', paymentsToInsert);
    }

    console.log('✅ Seeding completed successfully!');
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
  }
}

async function insertData(table, data) {
  // Clear any undefined/extra fields not in schema if necessary, 
  // but let's try direct insert first as the schema matches mostly.
  const { error } = await supabase.from(table).upsert(data);
  if (error) {
    console.error(`Error inserting into ${table}:`, error.message);
    // throw error; // Optional: stop on first error
  } else {
    console.log(`Inserted ${data.length} records into ${table}`);
  }
}

seed();
