# EnglishYaari Backend Assignment

A RESTful backend service built with Node.js, TypeScript, Express, and MongoDB for booking sessions with teachers.

## Tech Stack
Node.js, TypeScript, Express.js, MongoDB, Mongoose, Zod.

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
PORT=8000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/englishyaari_db?retryWrites=true&w=majority
```

### 3. Run the Development Server

```bash
npm run dev
```

### 4. Build and Run in Production

```bash
npm run build
npm run start
```

## API Endpoints

- `POST /users`: Create a new user (unique email).
- `POST /teachers`: Helper endpoint to register a teacher.
- `POST /sessions`: Create a session (status defaults to AVAILABLE, validates endTime > startTime).
- `GET /sessions/available?dateTimestamp={timestamp}`: Returns available slots for a date using MongoDB Aggregation Pipeline.
- `POST /sessions/:id/book`: Book an available session for a user (prevents double booking).
- `PATCH /sessions/:id/complete`: Mark a booked session as completed.
- `GET /users/:id/sessions`: Returns user's sessions separated into upcoming and completed (uses MongoDB Aggregation Pipeline).

## Testing

Import `EnglishYaari_Assignment.postman_collection.json` into Postman to test all endpoints.
