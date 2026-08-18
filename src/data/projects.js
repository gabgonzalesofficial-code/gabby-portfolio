import {
  BudgjetShot,
  SmartPOSShot,
  KBAppShot,
  RoseatteShot,
  FormConversionToolShot,
  LizbethGalarzaShot,
} from './profileImages'

// Projects — flagship, quantified-impact work first, then the rest.
export const projects = [
  {
    id: 6,
    name: 'PPL Admin Dashboard',
    tagline: 'Custom Laravel platform centralizing advertising campaigns, lead distribution, client management, subscriptions, and billing into a single internal system.',
    description: 'A custom internal business platform built to replace third-party CRM tools and centralize the company’s lead-generation workflow.\n\nThe application combines campaign management, website/lead management, client accounts, subscriptions, invoices, and lead distribution into one administrative dashboard. Campaigns can be configured with products, budgets, and active periods, then connected to specific lead-generation websites where forms capture incoming leads.\n\nA core part of the system is the lead distribution workflow. Incoming leads are processed and assigned to clients according to configurable business rules, including account balance and lead eligibility. This allows the business to control when and where leads are delivered without relying on manual processes.\n\nThe platform also handles internal billing and subscription workflows, significantly reducing the company’s reliance on external CRM software and consolidating previously fragmented operations into a single system.',
    problem: 'The team relied on Bitrix24 and other third-party platforms for lead delivery, with no single interface for lead intake, no dashboard for ad/lead metrics, and fully manual ad setup in Google and Meta.',
    solution: 'Built a Laravel system covering campaign and ad creation across Meta and Google, funnel creation with API-based lead intake, lead validation, Google Voice and Telnyx integration for calls/SMS, and multi-channel lead delivery to CRMs like Jobber and GoHighLevel.',
    impact: 'Boosted team efficiency by 50% and let the company cancel third-party CRM subscriptions for lead delivery, with full control and scalability. Centralized metrics improved decision-making, lead quality stayed high, and many manual SOPs were eliminated.',
    metrics: [
      { label: 'Team efficiency', value: '+50%' },
      { label: 'Leads delivered', value: '10-20/wk', detail: 'per client' },
      { label: '3rd-party CRM cost', value: '$0', detail: 'subscriptions cancelled' },
    ],
    role: 'Solo developer',
    company: 'Proweaver Inc.',
    url: null,
    private: true,
    stack: ['laravel', 'php', 'chatgpt', 'meta', 'googlecloud', 'hubspot', 'telnyx', 'gohighlevel', 'sql', 'digitalocean']
  },
  {
    id: 8,
    name: 'Social Media Content Generator',
    tagline: 'AI tool generating a full 3-month social content plan in place of manual prompting.',
    problem: 'Manually producing social media content took the SMM team significant time, and prompt/output quality was inconsistent.',
    solution: 'Built a Laravel app powered by OpenAI that generates a 3-month social media content plan — hashtags, reels, and images — tailored to the business or service.',
    impact: 'Boosted team efficiency by 70%, with consistently higher-quality output and a lot of manual SOPs eliminated.',
    metrics: [
      { label: 'Team efficiency', value: '+70%' },
    ],
    role: 'Solo developer',
    company: 'Proweaver Inc.',
    url: null,
    private: true,
    stack: ['laravel', 'php', 'chatgpt']
  },
  {
    id: 5,
    name: 'Form Conversion Tool',
    tagline: 'Cuts manual form-to-code conversion time roughly in half.',
    problem: 'As part of the Form Developers group, converting forms into code was done manually — slow and error-prone.',
    solution: 'Built a React + Tailwind tool that generates ready-to-use form code, copy-pasteable in a few clicks.',
    impact: 'Increased conversion speed and cut typical conversion time from about 2 hours to about 1 hour, with fewer errors.',
    metrics: [
      { label: 'Conversion time', value: '-50%', detail: '2 hrs → 1 hr' },
    ],
    role: 'Solo developer',
    url: 'https://formconversiontool.vercel.app/',
    image: FormConversionToolShot,
    stack: ['react', 'vite']
  },
  {
    id: 2,
    name: 'Smart POS',
    tagline: 'A full-stack, offline-first Point of Sale system for a small business.',
    description: 'A full-stack Point of Sale system for a small business, built as a monorepo with a Next.js frontend and a NestJS API, backed by PostgreSQL via Prisma — with offline-first support so it keeps working through spotty connections.',
    url: 'https://smart-sari-pos.vercel.app/',
    image: SmartPOSShot,
    stack: ['nextjs', 'react', 'nestjs', 'prisma', 'postgresql', 'typescript', 'tailwind']
  },
  {
    id: 1,
    name: 'Budgjet',
    tagline: 'A personal budget tracker with AI-powered spending insights.',
    description: 'A personal budget tracking app with AI-powered spending insights — built with Next.js and Supabase, using Groq to analyze spending patterns and surface recommendations in real time.',
    url: 'https://budgjet.vercel.app/',
    image: BudgjetShot,
    stack: ['nextjs', 'react', 'typescript', 'supabase', 'tailwind', 'groq']
  },
  {
    id: 4,
    name: 'Knowledge Base App',
    tagline: 'A resource-sharing hub built for a friend group.',
    description: 'A knowledge-sharing app for my friend group to upload, organize, and share resources — built with Next.js and Supabase, with file storage on AWS S3.',
    url: 'https://knwrepo.vercel.app/',
    image: KBAppShot,
    stack: ['nextjs', 'react', 'typescript', 'supabase', 's3', 'tailwind']
  },
  {
    id: 7,
    name: 'Lizbeth Galarza Website',
    tagline: 'A real estate site with live MLS-synced listings.',
    description: 'A real estate website that dynamically syncs and displays property listings pulled live from Smart MLS.',
    url: 'https://homeswithliz.com/',
    image: LizbethGalarzaShot,
    stack: ['wordpress']
  },
  {
    id: 3,
    name: 'Roseatte',
    tagline: "A creative portfolio site designed and built end-to-end.",
    description: 'A WordPress website I designed and built for my girlfriend to showcase her artwork and creative portfolio.',
    url: 'https://roseatte.lovestoblog.com',
    image: RoseatteShot,
    stack: ['wordpress']
  },
  {
    id: 9,
    name: 'Uni-verse',
    tagline: 'A 2D RPG-style Learning Management System.',
    description: "A 2D RPG-style Learning Management System — lessons and quizzes reward the player's character, making studying feel like playing a game. Built in Godot with GDScript.",
    url: null,
    stack: ['godot']
  }
]
