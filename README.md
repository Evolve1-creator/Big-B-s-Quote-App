# Catering Quotes Web (Vite + React)

A mobile-first catering quote tool you can deploy on Vercel and open from a link on your phone.

## Run locally
```bash
npm install
npm run dev
```

## Deploy (GitHub + Vercel)
1. Push this repo to GitHub.
2. In Vercel: New Project -> Import repo.
3. Framework preset: Vite
4. Build: `npm run build`
5. Output: `dist`

## Notes
- Pan calculation rounds UP so you never under-serve.
- Client View toggle makes a clean screenshot-ready quote.
- Quote state auto-saves in the browser (localStorage).
