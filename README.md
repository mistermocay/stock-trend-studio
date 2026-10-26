# Stock Trend Studio

A research-first workspace for discovering Adobe Stock niches and generating prompts only. It does **not** generate images.

## Requirements
- Node.js 20.9+ (recommended)
- npm

## Run locally
```bash
npm install
npm run dev
```
Open http://localhost:3000.

## Current scaffold
- Interactive research dashboard UI
- Seasonal idea shortcuts
- Asset-type and result-count controls
- Prompt generation from transparent rule-based templates
- Prompt selection, copy, and TXT export
- Opportunity score clearly marked as a heuristic, not sales data

## Important data note
The initial UI uses clearly labeled demo/sample data. It does not claim to show live Adobe Stock download or sales statistics. Connect an authorized data source and validate its fields before presenting live metrics. Keep all credentials on the server; do not scrape or bypass access controls.

## Next implementation milestones
1. Connect a permitted Adobe Stock search/data source.
2. Build a server-side research endpoint and show source + retrieval timestamp.
3. Add optional text-model integration for synthesis and prompt variants.
4. Persist saved research and export CSV.
