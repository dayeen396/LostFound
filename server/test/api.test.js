require('dotenv').config();
const assert = require('node:assert/strict');
const { before, after, test } = require('node:test');
const request = require('supertest');
const app = require('../src/app');
const db = require('../src/db');

const adminAgent = request.agent(app);
const memberAgent = request.agent(app);
let fixtureItemId;
let demoUserId;
let adminId;

before(async () => {
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@du.ac.bd';
  const [adminRows] = await db.execute('SELECT id FROM users WHERE email = ?', [adminEmail.toLowerCase()]);
  const [memberRows] = await db.execute('SELECT id FROM users WHERE email = ?', ['demo.member@du.ac.bd']);
  const [categoryRows] = await db.execute('SELECT id FROM categories WHERE is_active = TRUE LIMIT 1');
  const [locationRows] = await db.execute('SELECT id FROM locations WHERE is_active = TRUE LIMIT 1');
  assert.ok(adminRows.length && memberRows.length && categoryRows.length && locationRows.length, 'Run npm run db:seed before the tests');
  adminId = adminRows[0].id;
  demoUserId = memberRows[0].id;
  const [result] = await db.execute(
    `INSERT INTO items
      (user_id, category_id, location_id, item_type, title, public_description, private_details,
       occurred_at, contact_preference, moderation_status, status, expires_at)
     VALUES (?, ?, ?, 'found', ?, ?, ?, UTC_TIMESTAMP(), 'email', 'approved', 'open', DATE_ADD(UTC_TIMESTAMP(), INTERVAL 30 DAY))`,
    [adminId, categoryRows[0].id, locationRows[0].id, `API test item ${Date.now()}`, 'A test description for API privacy checks.', 'Hidden test detail']
  );
  fixtureItemId = result.insertId;
});

after(async () => {
  if (fixtureItemId) {
    await db.execute('DELETE FROM messages WHERE claim_id IN (SELECT id FROM claims WHERE item_id = ?)', [fixtureItemId]);
    await db.execute('DELETE FROM claims WHERE item_id = ?', [fixtureItemId]);
    await db.execute('DELETE FROM reports WHERE item_id = ?', [fixtureItemId]);
    await db.execute('DELETE FROM items WHERE id = ?', [fixtureItemId]);
  }
  await db.end();
});

test('health endpoint confirms database connection', async () => {
  const response = await request(app).get('/api/health').expect(200);
  assert.deepEqual(response.body, { status: 'ok', database: 'connected' });
});

test('homepage, client assets, and bilingual not-found page are served', async () => {
  const homepage = await request(app).get('/').expect(200);
  assert.match(homepage.text, /DU Lost &amp; Found/);
  assert.match(homepage.text, /Lost something on campus/);
  assert.match(homepage.text, /ক্যাম্পাসে কিছু হারিয়েছেন/);
  assert.match(homepage.text, /<noscript>/);
  assert.match(homepage.text, /\/js\/app\.js/);
  await request(app).get('/css/app.css').expect(200);
  const client = await request(app).get('/js/app.js').expect(200);
  assert.match(client.text, /ঢাকা বিশ্ববিদ্যালয়/);
  const notFound = await request(app).get('/route-does-not-exist').expect(404);
  assert.match(notFound.text, /Page not found/);
  assert.match(notFound.text, /পৃষ্ঠা পাওয়া যায়নি/);
});

test('visitors only see found items and public details hide private proof/contact', async () => {
  const feed = await request(app).get('/api/items').expect(200);
  assert.ok(feed.body.items.length > 0);
  assert.ok(feed.body.items.every(item => item.itemType === 'found'));
  const response = await request(app).get(`/api/items/${fixtureItemId}`).expect(200);
  assert.equal(response.body.item.privateDetails, undefined);
  assert.equal(response.body.item.contact, undefined);
  assert.equal(response.body.item.postedBy.email, undefined);
});

test('protected writes and admin routes reject anonymous visitors', async () => {
  await request(app).post('/api/items').send({}).expect(401);
  await request(app).get('/api/admin/overview').expect(401);
  await request(app).post('/api/auth/logout').set('Origin', 'https://evil.example').expect(403);
});

test('invalid registration input is rejected before being stored', async () => {
  await request(app).post('/api/auth/register').send({ email: 'not-an-email', password: 'short' }).expect(400);
});

test('members can claim found items and contacts appear only after approval', async () => {
  await memberAgent.post('/api/auth/login').send({
    email: 'demo.member@du.ac.bd',
    password: process.env.SEED_DEMO_PASSWORD
  }).expect(200);

  const claimResponse = await memberAgent.post(`/api/items/${fixtureItemId}/claims`)
    .send({ proofAnswer: 'There is a small blue thread sewn inside the inner pocket.' })
    .expect(201);
  const claimId = claimResponse.body.claim.id;
  const privateClaimantView = await memberAgent.get(`/api/claims/${claimId}`).expect(200);
  assert.equal(privateClaimantView.body.claim.proofAnswer, undefined);
  assert.equal(privateClaimantView.body.claim.contact, undefined);

  await adminAgent.post('/api/auth/login').send({
    email: (process.env.SEED_ADMIN_EMAIL || 'admin@du.ac.bd'),
    password: process.env.SEED_ADMIN_PASSWORD
  }).expect(200);
  const adminClaims = await adminAgent.get(`/api/items/${fixtureItemId}/claims`).expect(200);
  assert.equal(adminClaims.body.claims[0].proofAnswer, 'There is a small blue thread sewn inside the inner pocket.');

  await adminAgent.patch(`/api/claims/${claimId}/review`).send({ decision: 'approved' }).expect(200);
  const approved = await memberAgent.get(`/api/claims/${claimId}`).expect(200);
  assert.equal(approved.body.claim.status, 'approved');
  assert.equal(approved.body.claim.contact.email, 'admin@du.ac.bd');
  await memberAgent.post(`/api/claims/${claimId}/messages`).send({ body: 'Thank you. I will arrange collection.' }).expect(201);
  const messages = await memberAgent.get(`/api/claims/${claimId}/messages`).expect(200);
  assert.equal(messages.body.messages.length, 1);
});

test('ordinary members cannot use administrator endpoints', async () => {
  await memberAgent.get('/api/admin/users').expect(403);
});

test('image uploads accept verified image bytes and remain hidden on pending posts', async () => {
  await memberAgent.post('/api/auth/login').send({
    email: 'demo.member@du.ac.bd',
    password: process.env.SEED_DEMO_PASSWORD
  }).expect(200);
  const [categories, locations] = await Promise.all([
    request(app).get('/api/categories').expect(200),
    request(app).get('/api/locations').expect(200)
  ]);
  const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/rVEAAAAASUVORK5CYII=', 'base64');
  const posted = await memberAgent.post('/api/items')
    .field('itemType', 'found')
    .field('title', `Image upload test ${Date.now()}`)
    .field('categoryId', categories.body.categories[0].id)
    .field('locationId', locations.body.locations[0].id)
    .field('description', 'A test image post description for upload validation.')
    .field('handoverDetails', 'Held at the department front desk.')
    .field('occurredAt', new Date().toISOString())
    .attach('images', png, { filename: 'test.png', contentType: 'image/png' })
    .expect(201);
  const itemId = posted.body.item.id;
  const ownerView = await memberAgent.get(`/api/items/${itemId}`).expect(200);
  assert.equal(ownerView.body.item.moderationStatus, 'pending');
  assert.equal(ownerView.body.item.handoverDetails, 'Held at the department front desk.');
  assert.equal(ownerView.body.item.images.length, 1);
  await request(app).get(ownerView.body.item.images[0].url).expect(404);
  await memberAgent.get(ownerView.body.item.images[0].url).expect(200);
  await memberAgent.delete(`/api/items/${itemId}`).expect(200);
});
