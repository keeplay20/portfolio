import { Experience, PersonalInfo, Project } from "../types";

export const personalInfo: PersonalInfo = {
  name: "Mandar Vyas",
  title: "Senior Mobile Engineer",
  summary:
    "Mobile products for millions at Dream11 and Superhealth—and web labs where motion and state are the interface.",
  yearsOfExperience: 5,
  location: "India",
  email: "mandar.vyas20@gmail.com",
  linkedin: "https://www.linkedin.com/in/mandar-vyas/",
  github: "https://github.com/keeplay20",
  website: "https://keeplay20.github.io/tech-practice-hub/",
};

export const experiences: Experience[] = [
  {
    id: "superhealth",
    company: "Superhealth",
    position: "Senior Mobile Engineer",
    duration: "Jul 2026 - Present",
    location: "Bangalore, India",
    description: [
      "Building the React Native mobile application from scratch, owning application architecture, engineering foundations, and development standards for Android and iOS.",
      "Establishing a scalable TypeScript architecture using Expo, Expo Router, Zustand, and TanStack Query with modular feature boundaries and a shared data layer.",
      "Building reusable UI foundations using design tokens, shared components, and a consistent design system in collaboration with Product and Design.",
      "Integrating Firebase for feature flags and remote configuration to support controlled feature rollouts and experimentation.",
      "Setting up core mobile capabilities including authentication, REST API integration, analytics, crash reporting, deep linking, push notifications, and WebView-based hybrid experiences.",
      "Defining engineering patterns for caching, error handling, session management, performance, maintainability, and production reliability.",
    ],
    technologies: [
      "React Native",
      "React",
      "JavaScript",
      "TypeScript",
      "GitHub Actions",
      "Node.js",
      "Expo",
      "Expo Router",
      "Zustand",
      "TanStack Query",
      "Design Tokens",
      "Shared Components",
      "Firebase",
      "Feature Flags",
    ],
  },
  {
    id: "dream11",
    company: "Dream11",
    position: "Software Engineer II",
    duration: "2021 - Jul 2026",
    location: "Mumbai, India",
    description: [
      "Built and shipped features in the Dream11 React Native app including My Balance, My Transactions, and Verification flows",
      "Developed multiple bottom sheets for seamless in-app interactions",
      "Designed and developed internal React-based admin panels to streamline Customer Support operations",
      "Architected Detox-based E2E testing framework integrated with CI/CD pipelines",
      "Created mock payment system for development and QA environments",
      "Built label-based automation framework to reduce test flakiness and improve maintainability",
    ],
    technologies: [
      "React Native",
      "React",
      "JavaScript",
      "TypeScript",
      "Jenkins",
      "Detox",
      "Node.js",
    ],
  },
  {
    id: "gupshup",
    company: "Gupshup",
    position: "Software Engineer",
    duration: "2019 - 2021",
    location: "Mumbai, India",
    description: [
      "Automated backend components (HTTPSender, SMSSender) to improve reliability and speed of messaging flows",
      "Developed shell scripts for automated test data generation, reducing manual dependency",
      "Conducted API performance testing using JMeter and Postman, identifying bottlenecks in message delivery",
      "Reviewed code/test coverage and guided teammates to improve system stability",
      "Collaborated with cross-functional teams to deliver high-quality messaging solutions",
    ],
    technologies: [
      "Postman",
      "JMeter",
      "Shell Scripting",
      "JIRA",
      "MySQL",
      "REST APIs",
    ],
  },
  {
    id: "vxl",
    company: "VXL Instruments",
    position: "Software Engineer",
    duration: "2016 - 2019",
    location: "Mumbai, India",
    description: [
      "Contributed to testing and development of Linux-based OS (LetOS, Gio6) and web-based management tools",
      "Developed automation scripts with Selenium + TestNG for Lenovo Terminal Manager, reducing manual QA cycles",
      "Collaborated with dev teams to design and execute test strategies for new releases",
      "Built comprehensive test suites for hardware-software integration testing",
    ],
    technologies: [
      "Selenium",
      "TestNG",
      "Linux OS",
      "JavaScript",
      "Python",
      "Bash",
      "Jenkins",
    ],
  },
  {
    id: "freelancer",
    company: "Freelancer",
    position: "Frontend Engineer",
    duration: "2015 - 2016",
    location: "Remote",
    description: [
      "Delivered custom automation and development projects for multiple startups",
      "Built web applications using modern JavaScript frameworks",
      "Developed testing frameworks and automation solutions",
      "Provided consulting services for small to medium businesses",
    ],
    technologies: [
      "JavaScript",
      "HTML/CSS",
      "Node.js",
      "MongoDB",
      "Express.js",
      "React",
    ],
  },
  {
    id: "wipro",
    company: "Wipro",
    position: "Technical Consultant",
    duration: "2014 - 2015",
    location: "Mumbai, India",
    description: [
      "Developed custom SharePoint pages for business process automation",
      "Installed, configured, and supported Microsoft SharePoint 2013 & SharePoint Online for EMEA & APAC clients",
      "Automated workflows to reduce manual processes in enterprise setups",
      "Provided technical support and training to end users",
    ],
    technologies: [
      "SharePoint 2013/Online",
      "JavaScript",
      "PowerShell",
      "C#",
      ".NET",
      "SQL Server",
    ],
  },
];

export function getProjectById(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}

export const projects: Project[] = [
  {
    id: "deep-link-doctor",
    featured: true,
    tagline: "Why your links open the website, not the app",
    title: "Deep Link Doctor",
    description:
      "Enter a domain and diagnose iOS Universal Link and Android App Link configuration, with clear steps to fix what is broken.",
    longDescription: [
      "Deep Link Doctor checks apple-app-site-association and assetlinks.json for a domain and explains exactly why links open the browser instead of the app.",
      "Built from real mobile-engineering pain: broken deep links are hard to debug, so the tool turns cryptic config issues into actionable fixes.",
      "Shipped as a Next.js app on Vercel with light and dark themes.",
    ],
    category: "Web App",
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Vercel"],
    features: [
      "iOS Universal Links diagnosis",
      "Android App Links diagnosis",
      "Actionable fix guidance",
      "Light and dark themes",
    ],
    highlights: [
      "Solves a real mobile deep-linking pain point",
      "Diagnosis paired with how-to-fix guidance",
    ],
    status: "Completed",
    liveDemo: "https://deep-link-doctor.vercel.app",
    duration: "1 week",
    teamSize: 1,
  },
  {
    id: "animate-spotlight-showcase",
    featured: true,
    tagline: "Thirty-nine motions, one playground",
    title: "Animate Spotlight Showcase",
    description:
      "Editorial UI motion catalog—live springs, parallax, reveals, and gestures with controls you can tweak.",
    longDescription: [
      "A curated surface for interface motion: each pattern ships with a live demo, difficulty rating, and copy written for designers and engineers who learn by touching controls.",
      "Built as a scroll-led gallery with photography and spotlight transitions, the site argues that motion literacy belongs in the same toolbox as typography and layout.",
      "Deployed as a static React experience on Vercel—fast routes, no server, every animation runnable in the browser.",
    ],
    category: "Web App",
    technologies: ["React", "TypeScript", "Vite", "CSS Motion", "Framer Motion"],
    features: [
      "39 interactive motion patterns",
      "Editorial layouts with photography",
      "Live parameter exploration",
      "Scroll-triggered reveals",
      "Accessible reduced-motion fallbacks",
    ],
    highlights: [
      "Motion catalog structured like a design publication",
      "Patterns grouped from core timing to mobile patterns",
      "Copy in the visitor's vocabulary, not framework jargon",
    ],
    status: "Completed",
    liveDemo: "https://animate-spotlight-showcase.vercel.app/",
    previewImage:
      "https://animate-spotlight-showcase.vercel.app/assets/mountain-DPinf_Ym.jpg",
    duration: "3 weeks",
    teamSize: 1,
    caseStudy: {
      problem:
        "Teams copy motion snippets without understanding timing, easing, or when to stop—interfaces feel either dead or chaotic.",
      role: "Design, engineering, and copy—single-author playground shipped to production.",
      outcome:
        "A browsable catalog where every pattern is runnable, labeled by difficulty, and written for the person searching—not the framework docs.",
      decisions: [
        {
          title: "Editorial pacing over component grid",
          body: "Scroll-led chapters with photography break the 'docs page' rhythm and keep attention on one pattern at a time.",
        },
        {
          title: "Spotlight transitions between patterns",
          body: "Shared-element style handoffs tie the catalog together so motion feels authored, not sprinkled on.",
        },
        {
          title: "Visitor vocabulary in microcopy",
          body: "Queries and labels mirror how people search for help—improves discovery and ARD-style semantic indexing.",
        },
      ],
    },
  },
  {
    id: "transition-trail-explorer",
    featured: true,
    tagline: "Fetch lifecycle, made tangible",
    title: "Transition Trail Explorer",
    description:
      "State-machine playground for API fetch flows—valid events, guarded retries, scripted scenarios, and a living history log.",
    longDescription: [
      "Teaches the classic fetch lifecycle as an explorable graph: every transition is clickable, invalid moves explain why guards failed.",
      "Scenario scripts auto-play happy path, guarded retry, and exhausted-retry arcs so teams can demo reliability patterns in seconds.",
      "Built for engineers onboarding to XState-style thinking without reading a manual first.",
    ],
    category: "Web App",
    technologies: ["React", "TypeScript", "State Machines", "Vite"],
    features: [
      "Interactive event panel with enabled/disabled cues",
      "Guarded RETRY with retryCount ceiling",
      "Scripted scenario runner",
      "Transition history with failure reasons",
    ],
    highlights: [
      "Pedagogy-first UI—state is visible, not implied",
      "Scenario library for demos and interviews",
      "Production-minded guards mirrored from real apps",
    ],
    status: "Completed",
    liveDemo: "https://transition-trail-explorer.vercel.app/",
    duration: "2 weeks",
    teamSize: 1,
    caseStudy: {
      problem:
        "Async fetch flows are taught with diagrams that don't fail—engineers don't feel why guards and retry ceilings matter.",
      role: "Concept, UI, and state model—built as a teaching surface for interviews and onboarding.",
      outcome:
        "A playground where invalid events explain themselves and scripted scenarios demonstrate exhaustion in under a minute.",
      decisions: [
        {
          title: "Events as the primary control",
          body: "Bright vs dimmed events show legality at a glance—closer to operating a real app than reading a chart.",
        },
        {
          title: "Guard failures in the history log",
          body: "Rejected transitions stay visible with reasons, mirroring production debugging instead of hiding errors.",
        },
        {
          title: "Scenario scripts for narrative",
          body: "Happy path, retry, and exhaustion arcs auto-play—useful for demos without live improvisation.",
        },
      ],
    },
  },
  {
    id: "moviebuzz",
    title: "MovieBuzz - Movie Discovery App",
    description:
      "Netflix-inspired movie discovery app built with React Native, TypeScript, and Expo featuring real-time search, watchlist management, and user profiles.",
    longDescription: [
      "MovieBuzz is a comprehensive movie discovery application that provides users with an intuitive Netflix-inspired interface to explore movies, manage watchlists, and discover new content.",
      "Built using React Native and TypeScript, the app integrates with The Movie Database (TMDB) API to provide real-time movie data including popular movies, trending content, detailed information with cast and crew details.",
      "The application demonstrates modern mobile development practices with custom hooks for state management, responsive design patterns, and production-ready deployment configuration through Expo EAS Build.",
    ],
    category: "Mobile App",
    technologies: [
      "React Native",
      "TypeScript",
      "TMDB API",
      "React Navigation",
      "AsyncStorage",
      "Axios",
      "Custom Hooks",
    ],
    features: [
      "Browse Popular & Trending Movies",
      "Real-time Movie Search",
      "Detailed Movie Information with Cast",
      "Watchlist Management System",
      "Netflix-inspired Dark Theme UI",
      "Responsive Design for All Screen Sizes",
    ],
    highlights: [
      "Netflix-quality UI/UX design",
      "Real-time search with debounced API calls",
      "Custom hooks for reusable state logic",
      "Local data persistence with AsyncStorage",
      "Responsive design with dynamic layouts",
      "TypeScript for type-safe development",
    ],
    status: "Completed",
    demoVideo: "/images/MovieBuzz.gif",
    liveDemo: "https://expo.dev/accounts/mandarvyas/projects/movie-buzz-app",
    githubRepo:
      "https://github.com/mandarvyas/tech-practice-hub/tree/main/React-Native/movieBuzz",
    downloadLinks: {
      apk: "https://expo.dev/accounts/mandarvyas/projects/movie-buzz-app/builds/9b16150f-76e2-48e8-b928-1dcc2415b300",
    },
    duration: "2 weeks",
    teamSize: 1,
  },
  {
    id: "sudoku",
    title: "Sudoku - Create & Solve Puzzle Game",
    description:
      "Interactive Sudoku game built with React Native and Expo where users create their own puzzles and solve them. Features a clean UI with customizable gameplay.",
    longDescription: [
      "Sudoku is an innovative puzzle game that flips the traditional approach - instead of solving pre-generated puzzles, users create their own puzzles and then solve them.",
      "Built with React Native and TypeScript using Expo Router, the app features a clean, intuitive interface with a 9×9 grid that supports both setup and play modes.",
      "The application demonstrates modern React Native development with proper state management, TypeScript interfaces, and a polished user experience with visual feedback for frozen puzzle cells.",
    ],
    category: "Mobile App",
    technologies: [
      "React Native",
      "Expo Router",
      "React Hooks",
      "Custom Components",
    ],
    features: [
      "Create Custom Sudoku Puzzles",
      "Freeze Puzzle Numbers",
      "Interactive 9*9 Grid",
      "Visual Cell States (Frozen/Editable)",
      "Clear Solution Feature",
      "New Game Reset",
    ],
    highlights: [
      "Unique create-your-own-puzzle gameplay",
      "Clean, intuitive UI with visual feedback",
      "Responsive grid layout for all screen sizes",
      "Input validation (1-9 only)",
      "TypeScript for type-safe development",
      "Smooth state management with React Hooks",
    ],
    status: "Completed",
    demoVideo: "/images/CustomSudoku.gif",
    liveDemo: "https://expo.dev/accounts/mandarvyas/projects/sudoku",
    githubRepo:
      "https://github.com/mandarvyas/tech-practice-hub/tree/main/React-Native/sudoku",
    downloadLinks: {
      apk: "https://expo.dev/artifacts/eas/gD8i9Kn22PY8yrTu69Jd1g.apk",
    },
    duration: "3 days",
    teamSize: 1,
  },
  {
    id: "wander-travel",
    title: "WANDER - Travel Discovery Platform",
    description:
      "Modern React travel website with stunning UI featuring destination discovery, interactive sections, and smooth animations.",
    longDescription: [
      "WANDER is a beautiful travel discovery platform built with React and modern CSS featuring a Netflix-inspired design aesthetic.",
      "The application showcases travel destinations with an immersive hero section, detailed destination cards, about section with statistics, and a modern contact form.",
      "Built with a focus on user experience, the site features smooth animations, glassmorphism effects, gradient designs, and hover interactions throughout.",
    ],
    category: "Web App",
    technologies: [
      "React",
      "JavaScript",
      "CSS3",
      "Vite",
      "Responsive Design",
      "Modern Animations",
    ],
    features: [
      "Immersive Hero Section with Overlay",
      "Interactive Destination Cards",
      "Statistics Dashboard",
      "Modern Contact Form",
      "Glassmorphism Navigation",
      "Smooth Scroll Animations",
    ],
    highlights: [
      "React with component architecture",
      "Modern gradient & glassmorphism design",
      "Smooth hover & transition animations",
      "Interactive destination showcase",
      "Fully responsive layout",
    ],
    status: "Completed",
    demoVideo: "/images/wander-react.gif",
    githubRepo:
      "https://github.com/mandarvyas/tech-practice-hub/tree/main/React/login-react/login",
    duration: "1 week",
    teamSize: 1,
  },
];

export const heroStats = [
  { label: "Years of Experience", value: "5+" },
  { label: "Projects Completed", value: "50+" },
  { label: "Companies Worked", value: "5+" },
  { label: "Technologies Mastered", value: "25+" },
];
