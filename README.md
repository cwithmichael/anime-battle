# Anime Battle

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

If you want to run this locally, you'll need to run migrations with a local PostgreSQL instance. Add your DATABASE_URL value to an .env.local file and run

> npx prisma migrate dev

Disable auth to avoid having to deal with OAuth

## TODO

- [] Improve UX
- [] Add tests
- [] Add more OAuth options
- [] Engage with analytics for adding more stats than just number of votes?
