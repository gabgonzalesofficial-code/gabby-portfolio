import {
  BudgjetShot, SmartPOSShot, KBAppShot, RoseatteShot,
  FormConversionToolShot, LizbethGalarzaShot,
} from './profileImages'


// Map string image references to imported assets
const imageMap = { SmartPOSShot, BudgjetShot, KBAppShot, RoseatteShot, FormConversionToolShot, LizbethGalarzaShot };
export const projects = [
  {
    "id": 6,
    "name": "PPL Admin Dashboard",
    "category": "Internal Business Platform",
    "tagline": "A custom Laravel business platform built to replace fragmented CRM workflows and centralize the company lead-generation operations.",
    "overview": "The system manages the workflow from campaign setup and advertising configuration to lead intake, validation, distribution, client accounts, subscriptions, and billing.",
    "challenge": "The team relied on third-party platforms for lead delivery. There was no single internal interface for managing the complete lead-generation workflow.",
    "solution": "Built a custom Laravel platform that centralizes campaign management, lead intake, validation, distribution, client management, subscriptions, billing, and operational workflows.",
    "capabilities": [
      "Campaign management",
      "Google and Meta advertising workflows",
      "Lead-generation website management",
      "API-based lead intake",
      "Lead validation",
      "Rule-based lead distribution",
      "Client account management",
      "Subscription management",
      "Invoice and billing workflows",
      "CRM integrations",
      "Google Voice integration",
      "Telnyx integration for calling and SMS",
      "Funnel creation and management",
      "Centralized reporting and metrics"
    ],
    "integrations": [
      "Google",
      "Meta",
      "Stripe",
      "GoHighLevel",
      "Jobber",
      "Telnyx",
      "Google Voice"
    ],
    "impact": "Approximately 50% improvement in team efficiency. Reduced dependency on third-party CRM tools.",
    "metrics": [
      {
        "label": "Team efficiency",
        "value": "+50%"
      },
      {
        "label": "Leads delivered",
        "value": "10-20/wk",
        "detail": "per client"
      },
      {
        "label": "3rd-party CRM cost",
        "value": "$0",
        "detail": "subscriptions cancelled"
      }
    ],
    "role": "Solo developer",
    "company": "Proweaver Inc.",
    "url": null,
    "nda": true,
    "stack": [
      "laravel",
      "php",
      "chatgpt",
      "meta",
      "googlecloud",
      "hubspot",
      "telnyx",
      "gohighlevel",
      "sql",
      "digitalocean"
    ]
  },
  {
    "id": 2,
    "name": "Smart POS",
    "category": "Full-Stack Application",
    "tagline": "A full-stack Point of Sale system designed for small businesses, built with an offline-first approach.",
    "overview": "A POS system for small businesses, built as a monorepo with Next.js frontend and NestJS backend API, backed by PostgreSQL via Prisma.",
    "challenge": "Small businesses experience unreliable internet connections, making traditional web-based POS systems difficult to rely on.",
    "solution": "Built a full-stack POS with Next.js, NestJS API, PostgreSQL, Prisma ORM, monorepo architecture, and offline-first support.",
    "highlights": [
      {
        "title": "Monorepo Architecture",
        "description": "Frontend and backend in a shared codebase."
      },
      {
        "title": "API-Driven Backend",
        "description": "Dedicated NestJS API."
      },
      {
        "title": "Database Layer",
        "description": "PostgreSQL via Prisma ORM."
      },
      {
        "title": "Offline-First",
        "description": "Core functionality without internet."
      }
    ],
    "impact": "Complete full-stack POS with offline-first capability.",
    "url": "https://smart-sari-pos.vercel.app/",
    "image": imageMap["SmartPOSShot"],
    "stack": [
      "nextjs",
      "react",
      "nestjs",
      "prisma",
      "postgresql",
      "typescript",
      "tailwind"
    ]
  },
  {
    "id": 5,
    "name": "Form Conversion Tool",
    "category": "Internal Tool",
    "tagline": "A React-based internal tool built to reduce the time required to convert forms into production-ready code.",
    "overview": "Manually converting form structures into code took approximately two hours per form. The tool streamlines this by generating ready-to-use form code.",
    "challenge": "Form conversion was a repetitive manual process, time-consuming and potentially error-prone.",
    "solution": "Built a lightweight internal tool that automates the conversion process.",
    "impact": "Approximately 50% reduction in conversion time. 2 hours to 1 hour.",
    "metrics": [
      {
        "label": "Conversion time",
        "value": "-50%"
      },
      {
        "label": "Typical workflow",
        "value": "2h to 1h"
      }
    ],
    "role": "Solo developer",
    "url": "https://formconversiontool.vercel.app/",
    "image": imageMap["FormConversionToolShot"],
    "stack": [
      "react",
      "vite"
    ]
  },
  {
    "id": 8,
    "name": "Social Media Content Generator",
    "category": "AI Tool",
    "tagline": "An internal AI-powered tool that generates structured three-month social media content plans.",
    "overview": "A Laravel application powered by OpenAI that generates complete three-month social media content plans.",
    "challenge": "Creating long-term content plans required significant manual prompting and organization.",
    "solution": "Built an internal AI-powered application that standardizes content generation.",
    "capabilities": [
      "Three-month content planning",
      "AI-generated content ideas",
      "Hashtag generation",
      "Reel concepts",
      "Image-related content generation",
      "Structured output"
    ],
    "impact": "Approximately 70% improvement in team efficiency.",
    "metrics": [
      {
        "label": "Team efficiency",
        "value": "+70%"
      }
    ],
    "role": "Solo developer",
    "company": "Proweaver Inc.",
    "url": null,
    "nda": true,
    "stack": [
      "laravel",
      "php",
      "chatgpt"
    ]
  },
  {
    "id": 1,
    "name": "Budgjet",
    "category": "AI-Powered Web App",
    "tagline": "A personal finance application that combines budget tracking with AI-powered insights.",
    "overview": "Combines traditional budget tracking with AI-powered analysis using Groq to analyze spending patterns.",
    "challenge": "Most budget trackers focus on recording transactions. Budgjet explores how AI adds value.",
    "solution": "Built with Next.js and Supabase, integrated Groq for spending analysis.",
    "highlights": [
      {
        "title": "Full-Stack",
        "description": "Next.js and Supabase."
      },
      {
        "title": "AI Insights",
        "description": "Groq for spending analysis."
      },
      {
        "title": "Data-Driven",
        "description": "Turns activity into insights."
      }
    ],
    "impact": "AI-powered personal finance with spending analysis.",
    "url": "https://budgjet.vercel.app/",
    "image": imageMap["BudgjetShot"],
    "stack": [
      "nextjs",
      "react",
      "typescript",
      "supabase",
      "tailwind",
      "groq"
    ]
  },
  {
    "id": 4,
    "name": "Knowledge Base App",
    "category": "Full-Stack Web App",
    "tagline": "A centralized knowledge-sharing platform backed by Supabase and AWS S3.",
    "overview": "A web application for uploading, organizing, and sharing resources.",
    "challenge": "Files and resources scattered across platforms.",
    "solution": "Built a knowledge-sharing application with AWS S3 file storage.",
    "highlights": [
      {
        "title": "Cloud Storage",
        "description": "AWS S3 for file uploads."
      },
      {
        "title": "Organization",
        "description": "Structured resource management."
      },
      {
        "title": "Full-Stack",
        "description": "Next.js with Supabase."
      }
    ],
    "impact": "Centralized platform for resource sharing.",
    "url": "https://knwrepo.vercel.app/",
    "image": imageMap["KBAppShot"],
    "stack": [
      "nextjs",
      "react",
      "typescript",
      "supabase",
      "s3",
      "tailwind"
    ]
  },
  {
    "id": 7,
    "name": "Homes with Liz",
    "category": "Real Estate / API Integration",
    "tagline": "A real estate website with dynamically synchronized MLS property listings.",
    "overview": "Dynamically displays property listings from Smart MLS.",
    "challenge": "Property listings change regularly, making manual updates inefficient.",
    "solution": "Built a website with Smart MLS integration.",
    "highlights": [
      {
        "title": "MLS Integration",
        "description": "Smart MLS data synchronization."
      },
      {
        "title": "Dynamic Listings",
        "description": "Auto-updated property data."
      },
      {
        "title": "Client-Facing",
        "description": "Buyer-focused interface."
      }
    ],
    "impact": "Automated property listing management.",
    "url": "https://homeswithliz.com/",
    "image": imageMap["LizbethGalarzaShot"],
    "stack": [
      "wordpress"
    ]
  },
  {
    "id": 3,
    "name": "Roseatte",
    "category": "WordPress Website",
    "tagline": "A custom WordPress website for an artist creative portfolio.",
    "overview": "Custom WordPress portfolio for an artist.",
    "challenge": "Needed structured presentation reflecting the artist style.",
    "solution": "Designed and developed a WordPress website focused on visual storytelling.",
    "highlights": [
      {
        "title": "Custom Design",
        "description": "Visual-first presentation."
      },
      {
        "title": "Portfolio Structure",
        "description": "Organized creative content."
      },
      {
        "title": "Responsive",
        "description": "All devices."
      }
    ],
    "impact": "Dedicated online portfolio with custom design.",
    "url": "https://roseatte.lovestoblog.com",
    "image": imageMap["RoseatteShot"],
    "stack": [
      "wordpress"
    ]
  },
  {
    "id": 9,
    "name": "Uni-verse",
    "category": "Game Dev / Experimental",
    "tagline": "A 2D RPG-style Learning Management System with character progression.",
    "overview": "An experimental LMS designed as a 2D RPG.",
    "challenge": "Traditional LMS can feel repetitive.",
    "solution": "Built with Godot and GDScript.",
    "highlights": [
      {
        "title": "Gamified Learning",
        "description": "Lessons as gameplay."
      },
      {
        "title": "Progression",
        "description": "Character advancement."
      },
      {
        "title": "RPG Mechanics",
        "description": "Interactive lessons."
      }
    ],
    "impact": "Explored gamification in education.",
    "url": null,
    "stack": [
      "godot"
    ]
  }
]
