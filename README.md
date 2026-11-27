# Mandar Vyas — Portfolio

React + TypeScript portfolio built as an interactive **iPhone-style home screen**: lock screen, app folders, in-phone experiences, and dock shortcuts.

## What’s on the site

- **Home (`/`)** — Phone shell: lock screen, location map widget, stats, project folders, Experience hub, Settings (themes & display), and dock (Mail, LinkedIn, GitHub, About Me).
- **About Me** — Profile cover, résumé download (`public/resume/mandar-vyas-resume.pdf`), bio, skills, tech stack, education.
- **Work (`/work`)** — Project archive and links to case studies (`/work/:projectId`).
- **Open source** — Open Source contributions hub from the home stats widget (not a dock app).

## Tech stack

- React 18, TypeScript, React Router, Framer Motion
- Create React App (`react-scripts`)
- Typography: Graphik (UI) + monospace tokens in `index.css`
- Build: Puppeteer scripts for OG / Awwwards preview assets (`npm run build`)

## Getting started

**Prerequisites:** Node.js 16+, npm or yarn

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000).

**Production build:**

```bash
npm run build
```

Output goes to `build/`. Local dev proxies `POST /api/contact` via `src/setupProxy.js` (see `api/contact.js`; deployed as serverless on Vercel when applicable).

## Project layout (high level)

```
src/
├── components/
│   ├── IPhoneHome/     # Phone UI, lock screen, widgets, in-app shells
│   ├── ProjectsPage/   # /work gallery
│   ├── Header/         # Used on /work and 404 routes
│   └── Footer/
├── data/
│   ├── portfolio.ts    # Projects, experience, personalInfo
│   ├── iphoneHome.ts   # Apps, folders, dock
│   └── aboutMe.ts      # About Me copy & asset paths
├── pages/              # Home, CaseStudy, NotFound
├── theme/              # Phone appearance themes
└── App.tsx             # Routes
public/
├── images/profile.jpg
└── resume/mandar-vyas-resume.pdf
```

## Customization

- Copy & roles: `src/data/portfolio.ts`, `src/data/aboutMe.ts`
- Home screen apps & dock: `src/data/iphoneHome.ts`
- Phone themes: `src/theme/phoneThemes.ts` + `PhoneShellTheme.css`
- Headshot & résumé: `public/images/profile.jpg`, `public/resume/mandar-vyas-resume.pdf`

## License

[MIT License](LICENSE)

## Contact

Mandar Vyas — [mandar.vyas20@gmail.com](mailto:mandar.vyas20@gmail.com) · [LinkedIn](https://www.linkedin.com/in/mandar-vyas/) · [GitHub](https://github.com/keeplay20)