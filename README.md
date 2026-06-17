# ListenUp 🎧

ฟังเป็น ตอบได้ — a Thai listening-comprehension app for kids.

Kids read short Thai stories, then answer comprehension questions and self-grade.
Progress and gamification are tracked in `localStorage`.

## Tech stack

- [Vite](https://vitejs.dev/) + [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/) (via `@tailwindcss/vite`)
- [React Router](https://reactrouter.com/)
- `canvas-confetti` for the results celebration
- Thai fonts: IBM Plex Sans Thai, Noto Sans Thai

## Getting started

```bash
npm install
npm run dev      # start dev server
npm run build    # type-check + production build
npm run preview  # preview the production build
```

## Project structure

```
src/        React app — screens, components, content library, types, utils
public/     static assets (mascot images, etc.)
mockups/    design references
```

## Screens

- **Home** — hero, mode cards, recently-played history
- **Browse** — catalog filtered by level and theme
- **Play** — read sentences, reveal questions, self-grade answers
- **Results** — score, celebration, animated mascot

## Deployment

Configured for Vercel (see `vercel.json`).
