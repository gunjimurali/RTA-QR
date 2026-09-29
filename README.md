# RTA Unique QR System

## What this system does

1. Enter a **Heading to Display**.
2. Upload a **Logo**.
3. Enter a **Subheading**.
4. Enter a **Comment**.
5. Click **Generate Unique QR**.
6. The system creates a unique UUID.
7. The QR points to `/verify/<unique-id>`.
8. Scanning the QR displays the uploaded logo, heading, subheading and comment.

### Example

Heading:
Approved by Road Traffic Authority, Papua New Guinea

Subheading:
The Original Card

Comment:
This is the original card issued by Road Traffic Authority in the month of November

## IMPORTANT: persistence

The supplied project is a functional prototype. Its records are stored in server memory so it is easy to run locally, but Vercel serverless instances are not a permanent database.

For production deployment, connect the create route and verification page to a persistent PostgreSQL database (Neon is a suitable option) using Prisma, and store uploaded logos in persistent object storage (Vercel Blob or another authorized storage service).

Do not use the prototype's in-memory store for real card records.

## Vercel

This is a Next.js project and can be imported into Vercel. Run:

npm install
npm run dev

For production, add your database/storage environment variables and replace the marked in-memory storage section before issuing real QR codes.
