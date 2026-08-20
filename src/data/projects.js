import {
  BudgjetShot, SmartPOSShot, KBAppShot, RoseatteShot,
  FormConversionToolShot, LizbethGalarzaShot,
} from './profileImages'

const imageMap = { SmartPOSShot, BudgjetShot, KBAppShot, RoseatteShot, FormConversionToolShot, LizbethGalarzaShot }

export const projects = [
  {
    "id": 1,
    "name": "PPL Admin Dashboard",
    "category": "Internal Business Platform",
    "categories": [
      "CRM",
      "Lead Management",
      "Automation"
    ],
    "tagline": "A custom Laravel business platform built to replace fragmented CRM workflows and centralize the company lead-generation operations.",
    "overview": "The system manages the workflow from campaign setup and advertising configuration to lead intake, validation, distribution, client accounts, subscriptions, and billing. The goal was to consolidate previously fragmented workflows and reduce reliance on third-party CRM platforms and manual processes.",
    "challenge": "The team relied on third-party platforms for lead delivery and other workflows. There was no single internal interface for managing the complete lead-generation workflow, and several processes required manual handling.",
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
    "impact": [
      "Approximately 50% improvement in team efficiency",
      "Reduced dependency on third-party CRM tools",
      "Allowed the company to eliminate subscriptions previously used for lead delivery",
      "Automated workflows that were previously handled manually"
    ],
    "metrics": [
      {
        "value": "+50%",
        "label": "Team efficiency"
      },
      {
        "value": "10-20/wk",
        "label": "Leads delivered",
        "detail": "per client"
      },
      {
        "value": "$0",
        "label": "3rd-party CRM cost",
        "detail": "subscriptions cancelled"
      }
    ],
    "role": "Main Developer and Architect (working directly with the company founder)",
    "company": "LaunchSmarter Inc.",
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
    "categories": [
      "Point of Sale System"
    ],
    "tagline": "A full-stack Point of Sale system designed for small businesses, built with an offline-first approach to remain usable during unreliable internet connections.",
    "overview": "A Point of Sale system designed for small businesses. The application is built as a monorepo with a Next.js frontend and a NestJS backend API, backed by PostgreSQL using Prisma. One of the main focuses of the project is offline-first functionality, allowing the application to continue supporting core workflows even when the internet connection is unstable.",
    "challenge": "Small businesses can experience unreliable internet connections, making traditional web-based systems difficult to rely on during day-to-day operations. The goal was to build a modern POS application with a clear frontend/backend architecture while exploring how offline-first behavior could improve reliability.",
    "solution": "Built a full-stack POS application with a Next.js frontend, a NestJS API, PostgreSQL for data storage, Prisma as the database ORM, a monorepo architecture, and offline-first support for unreliable connections.",
    "highlights": [
      {
        "title": "Monorepo Architecture",
        "description": "The frontend and backend are organized within a shared codebase, making it easier to manage the different parts of the application while keeping the architecture structured."
      },
      {
        "title": "API-Driven Backend",
        "description": "The frontend communicates with a dedicated NestJS API rather than directly handling backend logic."
      },
      {
        "title": "Database Layer",
        "description": "PostgreSQL is managed through Prisma, providing a structured way to work with application data."
      },
      {
        "title": "Offline-First",
        "description": "The system was designed with unreliable connectivity in mind, allowing core functionality to remain usable when an internet connection is interrupted."
      }
    ],
    "impact": "Complete full-stack POS with offline-first capability for small businesses.",
    "role": "Solo developer",
    "url": "https://smart-sari-pos.vercel.app/",
    "stack": [
      "nextjs",
      "react",
      "nestjs",
      "prisma",
      "postgresql",
      "typescript",
      "tailwind"
    ],
    "image": imageMap.SmartPOSShot
  },
  {
    "id": 3,
    "name": "Form Conversion Tool",
    "category": "Internal Tool",
    "categories": [
      "Workflow Automation"
    ],
    "tagline": "A React-based internal tool built to reduce the time required to convert forms into production-ready code.",
    "overview": "The original workflow involved manually converting form structures into code, which could take approximately two hours per form and created opportunities for repetitive mistakes. The tool streamlines this process by generating ready-to-use form code that can be copied and implemented in just a few steps.",
    "challenge": "Form conversion was previously a repetitive manual process. Developers needed to manually translate form structures into code, making the workflow time-consuming and potentially error-prone.",
    "solution": "Built a lightweight internal tool that automates much of the conversion process. The application allows users to generate form code through a simplified workflow, reducing the amount of repetitive development work required.",
    "impact": "Approximately 50% reduction in conversion time. Typical workflow: 2 hours to 1 hour. The tool also helped standardize the output and reduce opportunities for manual errors.",
    "metrics": [
      {
        "value": "50%",
        "label": "Reduction in Conversion Time"
      },
      {
        "value": "2h → 1h",
        "label": "Typical Workflow"
      }
    ],
    "highlights": [
      {
        "title": "Automated Generation",
        "description": "Automated form-to-code generation that transforms form structures into production-ready code."
      },
      {
        "title": "Copy-Ready Output",
        "description": "Generated code can be copied and implemented in just a few steps."
      },
      {
        "title": "Internal Workflow",
        "description": "Simplified internal workflow built specifically around an existing development process."
      }
    ],
    "role": "Solo developer",
     "company": "Proweaver Inc.",
    "url": "https://formconversiontool.vercel.app/",
    "stack": [
      "react",
      "vite"
    ],
    "image": imageMap.FormConversionToolShot
  },
  {
    "id": 4,
    "name": "Social Media Content Generator",
    "category": "AI Tool",
    "categories": [
      "Internal Automation"
    ],
    "tagline": "An internal AI-powered tool that generates structured three-month social media content plans, reducing repetitive prompting and manual planning.",
    "overview": "An internal Laravel application powered by the OpenAI API. The tool generates a complete three-month social media content plan based on a business or service. Instead of repeatedly creating prompts and manually organizing the results, the application provides a more structured workflow for generating content ideas, hashtags, reels, and image-related content.",
    "challenge": "Creating long-term social media content plans required significant manual prompting and organization. The process was repetitive, time-consuming, and could produce inconsistent results depending on how prompts were written.",
    "solution": "Built an internal AI-powered application that standardizes the content generation workflow. Users provide information about a business or service, and the application generates a structured social media plan covering multiple content types.",
    "capabilities": [
      "Three-month content planning",
      "AI-generated content ideas",
      "Hashtag generation",
      "Reel concepts",
      "Image-related content generation",
      "Structured output instead of repeated manual prompting"
    ],
    "impact": "Approximately 70% improvement in team efficiency. The tool reduced repetitive manual work and helped create a more consistent content-generation workflow.",
    "metrics": [
      {
        "value": "+70%",
        "label": "Team efficiency"
      }
    ],
    "role": "Co-developer",
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
    "id": 5,
    "name": "Budgjet",
    "category": "AI-Powered Web App",
    "categories": [
      "Personal Finance"
    ],
    "tagline": "A personal finance application that combines budget tracking with AI-powered insights into spending patterns.",
    "overview": "Budgjet is a personal finance application designed to help users track spending and better understand their financial habits. The application combines traditional budget tracking with AI-powered analysis. Instead of simply recording transactions, the application uses AI to analyze spending patterns and surface insights and recommendations based on the user financial activity.",
    "challenge": "Most budget trackers focus primarily on recording income and expenses. The goal of Budgjet was to explore how AI could add another layer of value by helping users interpret their spending patterns rather than simply presenting raw financial data.",
    "solution": "Built a web application that combines budget tracking with AI-generated insights. Users can manage their financial information while the AI analyzes spending behavior and provides recommendations based on available data.",
    "highlights": [
      {
        "title": "Full-Stack Web Application",
        "description": "Built with Next.js for the application experience and Supabase for backend services and data management."
      },
      {
        "title": "AI-Powered Insights",
        "description": "Integrated Groq to analyze spending patterns and generate contextual recommendations."
      },
      {
        "title": "Data-Driven Recommendations",
        "description": "The application focuses on turning financial activity into more understandable insights rather than presenting only raw transaction data."
      }
    ],
    "impact": "AI-powered personal finance with spending analysis and recommendations.",
    "url": "https://budgjet.vercel.app/",
    "stack": [
      "nextjs",
      "react",
      "typescript",
      "supabase",
      "tailwind",
      "groq"
    ],
    "image": imageMap.BudgjetShot
  },
  {
    "id": 6,
    "name": "Knowledge Base App",
    "category": "Full-Stack Web App",
    "categories": [
      "Knowledge Sharing",
      "Cloud Storage"
    ],
    "tagline": "A centralized knowledge-sharing platform for uploading, organizing, and sharing resources, backed by Supabase and AWS S3.",
    "overview": "A web application built to help a small group upload, organize, and share useful resources in one centralized place. The project combines a modern Next.js frontend with Supabase and AWS S3 for data and file storage. Rather than relying on scattered links and files across different platforms, the application provides a dedicated environment for managing shared resources.",
    "challenge": "Useful files, links, and learning resources can easily become scattered across messaging platforms, cloud storage, and different websites. The goal was to build a centralized space where resources could be uploaded, organized, and shared more easily.",
    "solution": "Built a knowledge-sharing application that allows users to manage resources through a dedicated web interface. AWS S3 is used for file storage, while Next.js and Supabase support the application broader functionality.",
    "highlights": [
      {
        "title": "Cloud File Storage",
        "description": "Integrated AWS S3 for handling uploaded files."
      },
      {
        "title": "Resource Organization",
        "description": "Built around organizing and sharing resources rather than simply storing files."
      },
      {
        "title": "Full-Stack Architecture",
        "description": "Combines Next.js with Supabase and external cloud storage services."
      }
    ],
    "impact": "Centralized platform for resource sharing and organization.",
    "url": "https://knwrepo.vercel.app/",
    "stack": [
      "nextjs",
      "react",
      "typescript",
      "supabase",
      "s3",
      "tailwind"
    ],
    "image": imageMap.KBAppShot
  },
  {
    "id": 7,
    "name": "Homes with Liz",
    "category": "Real Estate Website",
    "categories": [
      "MLS Integration",
      "Web Development"
    ],
    "tagline": "A real estate website that dynamically displays property listings synchronized from Smart MLS.",
    "overview": "A real estate website built to dynamically display property listings synchronized from Smart MLS. Rather than manually adding and maintaining listings, the website integrates with an external MLS data source to present property information dynamically. The project combines client-facing web development with external data integration.",
    "challenge": "Property listings change regularly, making manual website updates inefficient and difficult to maintain. The website needed a way to display property information from an external MLS source while maintaining a polished and user-friendly real estate experience.",
    "solution": "Built a real estate website capable of dynamically displaying property listings sourced from Smart MLS. The website was designed to provide visitors with an accessible browsing experience while reducing the need for manual listing management.",
    "highlights": [
      {
        "title": "MLS Integration",
        "description": "Property data is synchronized from Smart MLS rather than being manually maintained on the website."
      },
      {
        "title": "Dynamic Listings",
        "description": "Property information is displayed dynamically based on available MLS data."
      },
      {
        "title": "Client-Facing Experience",
        "description": "The interface focuses on presenting listings in a way that is useful for prospective buyers and visitors."
      }
    ],
    "impact": "Automated property listing management with real-time MLS synchronization.",
    "url": "https://homeswithliz.com/",
    "stack": [
      "wordpress"
    ],
    "image": imageMap.LizbethGalarzaShot
  },
  {
    "id": 8,
    "name": "Roseatte",
    "category": "WordPress Website",
    "categories": [
      "Portfolio Website"
    ],
    "tagline": "A custom WordPress website designed and developed to showcase an artist work and creative portfolio.",
    "overview": "A custom WordPress website designed and developed as an online portfolio for an artist. The goal was to create a visually focused website that allows artwork and creative projects to take center stage while remaining easy to manage and update.",
    "challenge": "The website needed to function as more than a simple collection of images. It needed to present creative work in a structured way while maintaining a design that reflected the artist style and personality.",
    "solution": "Designed and developed a WordPress website focused on visual storytelling and portfolio presentation. The site was built to provide a responsive experience across devices while giving the artist a dedicated online space to showcase their work.",
    "highlights": [
      {
        "title": "Custom Design",
        "description": "Visual-first presentation designed around the artist style and personality."
      },
      {
        "title": "Portfolio Structure",
        "description": "Organized creative content with structured presentation."
      },
      {
        "title": "Responsive Layouts",
        "description": "Provides a consistent experience across all devices."
      }
    ],
    "impact": "Dedicated online portfolio with custom WordPress design.",
    "url": "https://roseatte.lovestoblog.com",
    "stack": [
      "wordpress"
    ],
    "image": imageMap.RoseatteShot
  },
  {
    "id": 9,
    "name": "Uni-verse",
    "category": "Game Dev / Experimental",
    "categories": [
      "Gamified Learning"
    ],
    "tagline": "A 2D RPG-style Learning Management System that combines lessons and quizzes with character progression and game mechanics.",
    "overview": "An experimental Learning Management System designed as a 2D RPG-style experience. Instead of presenting learning as a traditional series of pages and quizzes, Uni-verse explores a more interactive approach where lessons and assessments contribute to the player progression. Students interact with the application as a game, completing learning activities and quizzes while advancing their character.",
    "challenge": "Traditional Learning Management Systems can feel repetitive and disconnected from the kind of interactive experiences users are already familiar with. This project explored whether game mechanics could make learning feel more engaging.",
    "solution": "Built a 2D RPG-style learning experience using Godot and GDScript. Lessons and quizzes are incorporated into the player progression, allowing educational activities to become part of the gameplay loop.",
    "highlights": [
      {
        "title": "Gamified Learning",
        "description": "Lessons and quizzes are incorporated into gameplay progression."
      },
      {
        "title": "Character Progression",
        "description": "Students advance their in-game character through learning activities."
      },
      {
        "title": "RPG Mechanics",
        "description": "Interactive lessons built around game-based learning."
      }
    ],
    "impact": "Explored gamification in education with RPG-inspired mechanics.",
    "url": null,
    "stack": [
      "godot"
    ]
  }
]
