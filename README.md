# Big B’s Catering Quotes (Web App)

Mobile-first quote builder designed for GitHub + Vercel.

## Run locally
```bash
npm install
npm run dev
```

## Deploy (Vercel)
1. Push this folder to GitHub
2. In Vercel: New Project -> Import repo
3. Framework preset: Vite
4. Build command: `npm run build`
5. Output directory: `dist`

## Locked calculation rules
- **Meats:** priced per lb; **1 lb feeds 3.5 people**, rounded **up** to nearest **0.5 lb**.
- **Sandwiches:** priced per each (defaults to 1 per person).
- **Sides/Desserts:** priced per **1/2 pan** (defaults: 1/2 pan feeds 25 people unless overridden).
- **Breads/Drinks/Ice/Onsite Service:** per person.
- **Delivery:** flat per event.
- **Sales tax:** optional toggle; SC **county + city** table (state + county + hospitality).

## Data entry
- Menu/pricing: `src/data/menu.json`
- Tax table: `src/data/scTaxTable.json`
