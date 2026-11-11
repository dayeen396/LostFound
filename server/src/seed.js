require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('./db');

const categories = [
  ['ID cards and documents', 'পরিচয়পত্র ও নথি'],
  ['Phones and electronics', 'ফোন ও ইলেকট্রনিকস'],
  ['Books and notes', 'বই ও নোট'],
  ['Bags and wallets', 'ব্যাগ ও মানিব্যাগ'],
  ['Keys', 'চাবি'],
  ['Clothing and umbrellas', 'পোশাক ও ছাতা'],
  ['Water bottles', 'পানির বোতল'],
  ['Jewelry', 'গয়না'],
  ['Other', 'অন্যান্য']
];

const locations = [
  ['Academic', 'একাডেমিক', 'other', null],
  ['Curzon Hall', 'কার্জন হল', 'academic', 'Academic'],
  ['Arts Building', 'কলা ভবন', 'academic', 'Academic'],
  ['Science Annex', 'বিজ্ঞান অ্যানেক্স', 'academic', 'Academic'],
  ['Faculty of Business Studies', 'ব্যবসায় শিক্ষা অনুষদ', 'academic', 'Academic'],
  ['Law Faculty', 'আইন অনুষদ', 'academic', 'Academic'],
  ['Social Sciences Faculty', 'সামাজিক বিজ্ঞান অনুষদ', 'academic', 'Academic'],
  ['Institute of Information Technology (IIT)', 'তথ্যপ্রযুক্তি ইনস্টিটিউট (আইআইটি)', 'academic', 'Academic'],
  ['Central Library', 'কেন্দ্রীয় গ্রন্থাগার', 'academic', 'Academic'],
  ['Madhur Canteen area', 'মধুর ক্যান্টিন এলাকা', 'academic', 'Academic'],
  ['TSC', 'টিএসসি', 'student_space', null],
  ['Mall Chattar', 'মল চত্বর', 'student_space', null],
  ['Doyel Chattar', 'দোয়েল চত্বর', 'student_space', null],
  ['Raju Memorial Sculpture', 'রাজু স্মারক ভাস্কর্য', 'student_space', null],
  ['Aparajeyo Bangla', 'অপরাজেয় বাংলা', 'student_space', null],
  ['Shahbag Gate', 'শাহবাগ গেট', 'gate', null],
  ['Nilkhet Gate', 'নীলক্ষেত গেট', 'gate', null],
  ['Dhaka Medical-side Gate', 'ঢাকা মেডিকেল পাশের গেট', 'gate', null],
  ['Other campus gate', 'ক্যাম্পাসের অন্য গেট', 'gate', null],
  ['Salimullah Muslim Hall', 'সলিমুল্লাহ মুসলিম হল', 'hall', null],
  ['Fazlul Huq Muslim Hall', 'ফজলুল হক মুসলিম হল', 'hall', null],
  ['Jagannath Hall', 'জগন্নাথ হল', 'hall', null],
  ['Shahidullah Hall', 'শহীদুল্লাহ হল', 'hall', null],
  ['Ziaur Rahman Hall', 'জিয়াউর রহমান হল', 'hall', null],
  ['Amar Ekushey Hall', 'অমর একুশে হল', 'hall', null],
  ['Kabi Jasimuddin Hall', 'কবি জসীমউদ্দীন হল', 'hall', null],
  ['Sir A. F. Rahman Hall', 'স্যার এ এফ রহমান হল', 'hall', null],
  ['Haji Muhammad Mohsin Hall', 'হাজী মুহম্মদ মুহসীন হল', 'hall', null],
  ['Muktijoddha Ziaur Rahman Hall', 'মুক্তিযোদ্ধা জিয়াউর রহমান হল', 'hall', null],
  ['Kabi Sufia Kamal Hall', 'কবি সুফিয়া কামাল হল', 'hall', null],
  ['Rokeya Hall', 'রোকেয়া হল', 'hall', null],
  ['Shamsun Nahar Hall', 'শামসুন নাহার হল', 'hall', null],
  ['Bangladesh-Kuwait Maitree Hall', 'বাংলাদেশ-কুয়েত মৈত্রী হল', 'hall', null],
  ['Bangamata Sheikh Fazilatunnesa Mujib Hall', 'বঙ্গমাতা শেখ ফজিলাতুন্নেছা মুজিব হল', 'hall', null],
  ['Begum Fazilatunnesa Mujib Hall', 'বেগম ফজিলাতুন্নেছা মুজিব হল', 'hall', null],
  ['Bijoy Ekattor Hall', 'বিজয় একাত্তর হল', 'hall', null],
  ['Campus bus', 'ক্যাম্পাস বাস', 'transport', null],
  ['Rickshaw stand', 'রিকশা স্ট্যান্ড', 'transport', null],
  ['Shahbag bus stop', 'শাহবাগ বাসস্ট্যান্ড', 'transport', null],
  ['Nilkhet bus stop', 'নীলক্ষেত বাসস্ট্যান্ড', 'transport', null],
  ['Other', 'অন্যান্য', 'other', null]
];

const samples = [
  ['found', 'Black wallet found near TSC', 'A black zip wallet was found near the TSC cafeteria. It is being kept safe while the owner is identified.', 'A small blue thread is attached inside.'],
  ['found', 'Umbrella left at Central Library', 'A navy umbrella was left in the reading area. Please describe its handle to claim it.', 'Wooden curved handle with a small scratch.'],
  ['found', 'Notebook found in Arts Building', 'A ruled notebook was found after class. The cover is plain; identifying details are withheld.', 'There is a pressed leaf on the last page.'],
  ['found', 'Earbuds case found near Curzon Hall', 'A white earbuds case was found on the path near Curzon Hall.', 'Tiny green sticker on the underside.'],
  ['found', 'Key ring found at Madhur Canteen area', 'A key ring with two keys was found outside the canteen.', 'One key has a red plastic cap.'],
  ['found', 'Water bottle found in Science Annex', 'A steel water bottle was found in a classroom corridor.', 'Small dent near the base and a handwritten mark under the lid.'],
  ['found', 'Student card found near Shahbag Gate', 'A student card was found near the gate. The name and number are not shown for privacy.', 'Tell us the card holder name and department privately.'],
  ['found', 'Canvas tote bag found at Doyel Chattar', 'A canvas tote bag was found close to the sculpture area.', 'The inside pocket contains a distinctive patch.'],
  ['found', 'Book found at the Faculty of Business Studies', 'A reference book was found in a seminar room.', 'Please share the title and any writing inside the cover.'],
  ['found', 'Glasses case found near Raju Sculpture', 'A hard glasses case was found by the steps near the sculpture.', 'The case has a small white mark on one edge.'],
  ['found', 'USB drive found in IIT', 'A USB drive was found in a shared lab space and will be returned after its owner verifies it.', 'Describe the sticker on the cap.'],
  ['found', 'Scarf found at Mall Chattar', 'A light scarf was found on a bench at Mall Chattar.', 'A small embroidered flower is near one end.'],
  ['lost', 'Lost blue backpack near Central Library', 'A blue backpack was misplaced near the library entrance. Please send a claim with identifying details.', 'A yellow keychain is attached to one zipper.'],
  ['lost', 'Lost notebook at Curzon Hall', 'A green notebook with lecture notes was lost after class.', 'The first page has a class schedule.'],
  ['lost', 'Lost set of keys near Nilkhet Gate', 'A small set of keys may have been dropped around the gate or bus stop.', 'There are three keys and a round metal tag.']
];

async function seed() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@du.ac.bd';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  const demoPassword = process.env.SEED_DEMO_PASSWORD;
  if (!adminPassword || adminPassword.length < 12 || !demoPassword || demoPassword.length < 12) {
    throw new Error('Set SEED_ADMIN_PASSWORD and SEED_DEMO_PASSWORD to passwords of at least 12 characters.');
  }

  const adminHash = await bcrypt.hash(adminPassword, 12);
  const demoHash = await bcrypt.hash(demoPassword, 12);
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const [adminResult] = await connection.execute(
      `INSERT INTO users (name, email, password_hash, role, account_status, affiliation, department_or_hall, email_verified_at, du_verified_at)
       VALUES (?, ?, ?, 'admin', 'active', 'staff', 'Proctor Office', UTC_TIMESTAMP(), UTC_TIMESTAMP())
       ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id), password_hash = VALUES(password_hash), role = 'admin', account_status = 'active'`,
      ['DU Lost & Found Admin', adminEmail.toLowerCase(), adminHash]
    );
    const [demoResult] = await connection.execute(
      `INSERT INTO users (name, email, password_hash, role, account_status, affiliation, department_or_hall, email_verified_at, du_verified_at)
       VALUES (?, ?, ?, 'user', 'active', 'student', 'University of Dhaka', UTC_TIMESTAMP(), UTC_TIMESTAMP())
       ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id), password_hash = VALUES(password_hash), account_status = 'active'`,
      ['Demo DU Member', 'demo.member@du.ac.bd', demoHash]
    );
    const adminId = adminResult.insertId;
    const demoId = demoResult.insertId;

    for (const [en, bn] of categories) {
      await connection.execute(
        'INSERT INTO categories (name_en, name_bn) VALUES (?, ?) ON DUPLICATE KEY UPDATE name_bn = VALUES(name_bn), is_active = TRUE',
        [en, bn]
      );
    }

    const locationIds = new Map();
    for (const [en, bn, type, parentName] of locations) {
      const parentId = parentName ? locationIds.get(parentName) : null;
      const [result] = await connection.execute(
        `INSERT INTO locations (parent_id, name_en, name_bn, location_type)
         VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id), name_bn = VALUES(name_bn), is_active = TRUE`,
        [parentId || null, en, bn, type]
      );
      locationIds.set(en, result.insertId);
    }

    const [categoryRows] = await connection.execute('SELECT id, name_en FROM categories');
    const categoryIds = new Map(categoryRows.map(row => [row.name_en, row.id]));
    const categoryFor = title => {
      if (/card/i.test(title)) return 'ID cards and documents';
      if (/notebook|book/i.test(title)) return 'Books and notes';
      if (/wallet|bag/i.test(title)) return 'Bags and wallets';
      if (/key/i.test(title)) return 'Keys';
      if (/umbrella|scarf/i.test(title)) return 'Clothing and umbrellas';
      if (/bottle/i.test(title)) return 'Water bottles';
      if (/earbuds|USB|glasses/i.test(title)) return 'Phones and electronics';
      return 'Other';
    };
    const selectedLocations = [
      'TSC', 'Central Library', 'Arts Building', 'Curzon Hall', 'Madhur Canteen area',
      'Science Annex', 'Shahbag Gate', 'Doyel Chattar', 'Faculty of Business Studies',
      'Raju Memorial Sculpture', 'Institute of Information Technology (IIT)', 'Mall Chattar',
      'Central Library', 'Curzon Hall', 'Nilkhet bus stop'
    ];
    for (let index = 0; index < samples.length; index += 1) {
      const [itemType, title, description, privateDetails] = samples[index];
      const ownerId = itemType === 'lost' ? demoId : adminId;
      const categoryId = categoryIds.get(categoryFor(title));
      const locationId = locationIds.get(selectedLocations[index]);
      await connection.execute(
        `INSERT INTO items
          (user_id, category_id, location_id, item_type, title, public_description, private_details,
           occurred_at, moderation_status, status, expires_at)
         SELECT ?, ?, ?, ?, ?, ?, ?, DATE_SUB(UTC_TIMESTAMP(), INTERVAL ? DAY), 'approved', 'open',
           DATE_ADD(UTC_TIMESTAMP(), INTERVAL 90 DAY)
         WHERE NOT EXISTS (SELECT 1 FROM items WHERE user_id = ? AND title = ? AND deleted_at IS NULL)`,
        [ownerId, categoryId, locationId, itemType, title, description, privateDetails, index + 1, ownerId, title]
      );
    }
    await connection.commit();
    console.log(`Seeded DU Lost & Found. Admin: ${adminEmail}; demo member: demo.member@du.ac.bd`);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
    await db.end();
  }
}

seed().catch(error => {
  console.error('Unable to seed database:', error.message);
  process.exitCode = 1;
});
