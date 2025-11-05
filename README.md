# NAAC Criteria-wise Data Collection Portal (MERN)

A MERN stack application for collecting and managing NAAC criteria-wise institutional data with a React frontend, Express/Node backend, and MongoDB via Mongoose.

## Tech Stack

- React (Create React App)
- Node.js + Express
- MongoDB + Mongoose
- dotenv, cors

## Prerequisites

- Node.js 18+
- MongoDB running locally or a cloud MongoDB URI

## Setup

Install dependencies:
   ```bash
   npm install
   ```

## Scripts

- `npm run start` – Start React dev server (port 3000)
- `npm run start:server` – Start Express API server (port 5000 by default)
- `npm run dev` – Run both servers concurrently
- `npm run build` – Build React for production
- `npm test` – Run tests

The React dev server proxies API requests to `http://localhost:5000` (see `proxy` in `package.json`).

## Running in Development

Recommended:
```bash
npm run dev
```
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

You can also run them separately in two terminals:
```bash
npm start
npm run start:server
```

## API Endpoints

Base URL: `http://localhost:5000/api`

- `GET /entries` – List entries (sorted by newest)
- `POST /entries` – Create entry
- `DELETE /entries/:id` – Delete entry by numeric `id`
- `DELETE /entries` – Delete all entries

- `GET /settings` – Get settings
- `PUT /settings` – Upsert/update settings

See `routes/entries.js` and `routes/settings.js` for request/response shapes.

## Project Structure (key paths)

- `src/` – React app
- `server.js` – Express app entry
- `routes/` – API routes
- `models/` – Mongoose models
- `config/db.js` – MongoDB connection

## Notes

- Ensure MongoDB is running before starting the API server.
- On Windows PowerShell, use backticks or quotes correctly when running concurrent scripts if you customize them.
