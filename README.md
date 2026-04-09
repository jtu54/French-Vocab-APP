# Violet's French Learning Path

Starter boilerplate for a Next.js + Tailwind vocabulary app with:

- a Stardew-inspired pixel UI
- article-first noun/adjective rendering
- an Ebbinghaus-style spaced repetition engine
- local `french-verbs` conjugation modal support
- pagination sized for 25 cards per page

## Run locally

```bash
npm install
npm run dev
```

## Key files

- `app/page.tsx`: boots the app with sample vocabulary
- `components/FrenchLearningApp.tsx`: main UI and state flow
- `lib/srs.ts`: interval math and daily deck composition
- `lib/verbs.ts`: local `french-verbs` integration and tense sections
- `data/vocabulary.sample.json`: sample content structure

## Notes

- Progress and settings persist in `localStorage`.
- `Futur Proche` and `Passé Récent` are composed locally from helper verbs so the modal still shows the full learning set requested.
