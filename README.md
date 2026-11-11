# DU Lost & Found

This folder is the separate Node.js/Express + MySQL implementation. The existing PHP project in the repository root is unchanged by this application. The interface supports English and Bangla and includes a responsive public feed, account flows, item and claim workflows, a user dashboard, and moderator tools.

## Requirements

- Node.js 20 or newer
- MySQL 8 or newer
- An SMTP account for email verification and password reset in production (optional for local development)

## Local setup

1. In this directory, install packages and create your environment file:

   ```sh
   npm install
   cp .env.example .env
   ```

2. Edit `.env`. Use a unique random `JWT_SECRET` of at least 32 characters. Set database credentials and choose `SEED_ADMIN_PASSWORD` and `SEED_DEMO_PASSWORD` with at least 12 characters each. Use a DU email for the seed admin if desired.

3. Create the database schema and seed sample records:

   ```sh
   npm run db:migrate
   npm run db:seed
   ```

   The migration creates `DB_NAME` when the configured MySQL account has database-creation privileges. Otherwise, create that database manually and rerun the migration.

4. Start the server:

   ```sh
   npm start
   ```

   Open `http://localhost:3000`. The backend health check is at `http://localhost:3000/api/health`. On local development without SMTP, verification/reset email links are printed to the server terminal.

5. Run the backend API tests after migration and seeding:

   ```sh
   npm test
   ```

## Seed accounts

The seed command creates an administrator using `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` and a demo member at `demo.member@du.ac.bd` using `SEED_DEMO_PASSWORD`. Seed accounts are for local coursework demonstrations; replace credentials and remove sample accounts before any public deployment.

## Backend implementation in this stage

- JWT sessions in HttpOnly, SameSite=Strict cookies; bcrypt password hashes; active-account and role checks.
- Email verification and password reset token flows with expiring, hashed tokens.
- Parameterized MySQL queries, server-side validation/sanitization, login and post rate limits.
- Public found-item feed, authenticated lost-item feed, pagination, filters, private item detail separation, owner post management, and image uploads (JPEG, PNG, WebP; up to 3 images; size configured in `.env`).
- Claim review, contact release only after approval, claim-thread messages, notifications, and abuse reports.
- Admin/moderator review queues, user restrictions, bilingual category/location administration, dashboard statistics, and item expiry at startup.
- Location seeds are an initial working list and need verification against current University of Dhaka facilities and hall names.

## Frontend pages

The client is a small, dependency-free single-page interface served by Express:

- `#home` — bilingual welcome page and recent found items
- `#feed` — search, category/location/date/status filters, pagination
- `#login`, `#register`, `#forgot`, `#reset`, `#verify` — authentication and account recovery
- `#item/:id` — item gallery, claim form, privacy-safe contact view, and report form
- `#post` / `#post/:id` — create and edit a lost or found report
- `#dashboard` — member posts, submitted/received claims, messages, notifications, and profile
- `#admin/:section` — statistics, post/claim/report review, users, categories, and locations

Use the language control to switch between English and Bangla; the preference is stored in the browser. The theme button toggles dark mode. User-provided content is rendered as text and is not translated.

The generated location list includes seed examples for academic buildings, student areas, halls, gates, and transport. Confirm all campus and hall names with the University before a public launch.

## Open-source dependencies

The client uses original HTML, CSS, and vanilla JavaScript; it has no frontend framework or client-side package dependencies. Server/test packages are:

| Package | License |
|---|---|
| Express | MIT |
| express-rate-limit | MIT |
| express-validator | MIT |
| Helmet | MIT |
| cookie-parser | MIT |
| bcryptjs | MIT |
| jsonwebtoken | MIT |
| mysql2 | MIT |
| Multer | MIT |
| Nodemailer | MIT |
| dotenv | BSD-2-Clause |
| Supertest (tests) | MIT |

Review individual package notices in `node_modules` and include the applicable notices if redistributing a bundled deployment.

## API conventions

- JSON request/response bodies, except item create/update which use `multipart/form-data` (`images` may repeat up to three times).
- Browser sessions use an HttpOnly cookie. API clients may instead send `Authorization: Bearer <JWT>`.
- User input is plain text; the frontend must render it as text rather than injecting HTML.
- Email, phone, proof answers, and lost-item records are not included in public found-item responses.

See [docs/course-deliverables.md](./docs/course-deliverables.md) for the full API route reference, manual test checklist, UML-style diagrams, report text, demo/viva material, and deployment notes.
