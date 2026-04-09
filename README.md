# Violet's French Learning Path

Starter boilerplate for a Next.js + Tailwind vocabulary app with:

- a Stardew-inspired pixel UI
- article-first noun/adjective rendering
- an Ebbinghaus-style spaced repetition engine
- local `french-verbs` conjugation modal support
- pagination sized for 25 cards per page
- a non-destructive master dictionary hook via `data/dictionary.json`

## Run locally

```bash
npm install
npm run dev
```

## Key files

- `app/page.tsx`: boots the app with sample vocabulary
- `components/FrenchLearningApp.tsx`: main UI and state flow
- `lib/vocabulary.ts`: merges the existing sample list with `data/dictionary.json`
- `lib/srs.ts`: interval math and daily deck composition
- `lib/verbs.ts`: local `french-verbs` integration and tense sections
- `data/vocabulary.sample.json`: sample content structure
- `data/dictionary.json`: plug-in point for the larger master library

## Notes

- Progress and settings persist in `localStorage`.
- `Futur Proche` and `Passé Récent` are composed locally from helper verbs so the modal still shows the full learning set requested.
- Existing sample data remains intact; `data/dictionary.json` is appended as an additional source and deduplicated by `id`/French spelling.
