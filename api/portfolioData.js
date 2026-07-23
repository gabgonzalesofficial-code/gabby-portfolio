// Portfolio data for AI chatbot - kept in sync with src/data/profileData.js
// This ensures the AI has access to accurate information

export const portfolioData = {
  profileInfo: {
    name: 'Gabriel Gonzales',
    location: 'Cebu City, Philippines',
    title: 'Full Stack Web/WordPress Developer',
    contact: {
      email: 'gabgonzalesofficial@gmail.com',
      mobile: '+63 945 804 7946',
      linkedin: 'https://www.linkedin.com/in/gabriel-gonzales-9733ab1a3'
    }
  },

  aboutContent: [
    'A proactive and fast-learning professional who consistently strives for excellence in every task.',
    'Recently, I have been exploring and integrating AI into application development, with hands-on experience using AI tools such as Cursor, ChatGPT, and Gemini to improve productivity, streamline workflows, and enhance overall efficiency in the workplace.'
  ],

  techStack: {
    frontend: ['HTML', 'CSS', 'JavaScript', 'jQuery', 'Vue.js', 'React', 'Next.js', 'Tailwind CSS', 'Vite', 'JSON'],
    backend: ['PHP', 'Laravel', 'Java', 'Python', 'C', 'C++', 'C#'],
    crmCms: ['WordPress', 'Salesforce', 'GoHighLevel', 'HubSpot'],
    productivity: ['Monday.com'],
    automation: ['Selenium'],
    database: ['MySQL', 'SQL', 'Supabase', 'Prisma', 'MongoDB'],
    cloud: ['Amazon S3', 'Meta API', 'Google Cloud Console', 'Digital Ocean'],
    design: ['Figma', 'Canva'],
    tools: ['Git', 'GitHub', 'Bitbucket', 'VS Code', 'Cursor', 'Vercel', 'Formspree', 'Laravel Forge'],
    gameDev: ['Godot'],
    aiTools: [
      { name: 'Gemini AI Studio', description: 'AI Integration' },
      { name: 'ChatGPT', description: 'Content Generation' },
      { name: 'Gemini', description: 'Content Generation' },
      { name: 'Claude', description: 'AI Assistant' },
      { name: 'Groq', description: 'AI Inference API' },
      { name: 'Suno', description: 'AI Music Generation' }
    ]
  },

  beyondCoding: [
    'I love to write poems',
    'I also love to cook whenever I have the resources'
  ],

  certifications: [
    { name: 'WordPress Fundamentals (Content Management System)', issuer: 'Alison', year: '2026' },
    { name: 'AI for Commmunities Workshop', issuer: 'Vjal Institure', year: '2026' },
    { name: 'Top Performer (Multiple Awards)', issuer: 'Proweaver Inc.', year: '2024-2025' },
    { name: 'Top Conversion (Multiple Awards)', issuer: 'Proweaver Inc.', year: '2024-2025' },
    { name: 'Java Programming', issuer: 'University of Southern Philippines Foundation', year: '2022' },
    { name: 'Hackathon Champion', issuer: 'University of Southern Philippines Foundation', year: '2021' },
    { name: 'Best Oral Presentation', issuer: 'University of Southern Philippines Foundation', year: '2021' },
    { name: 'Best Research Paper', issuer: 'University of Southern Philippines Foundation', year: '2020' },
    { name: 'Pautakan First Place', issuer: 'National Privacy Commission', year: '2020' }
  ],

  experience: [
    { role: 'Full Stack Developer', company: 'Launch Smarter Inc.', year: '2026 - present' },
    { role: 'Senior Web/WordPress Developer', company: 'Proweaver Inc.', year: '2023 - 2026' },
    { role: 'Salesforce Automation Testing Intern', company: 'Accenture', year: '2023 - 2023' },
    { role: 'B.S. in Computer Science', company: 'University of Southern Philippines Foundation (graduate)', year: '2019 - 2023' },
    { role: 'Student Projects Developer', company: 'Freelance', year: '2016 - 2018' },
    { role: 'B.S. in Computer Science', company: 'University of Philippines College Cebu (non-graduate)', year: '2012 - 2015' }
  ],

  projects: [
    {
      name: 'Budgjet',
      description: 'A personal budget tracking app with AI-powered spending insights — built with Next.js and Supabase, using Groq to analyze spending patterns and surface recommendations in real time.',
      url: 'https://budgjet.vercel.app/'
    },
    {
      name: 'Smart POS',
      description: 'A full-stack Point of Sale system for a small business, built as a monorepo with a Next.js frontend and a NestJS API, backed by PostgreSQL via Prisma — with offline-first support so it keeps working through spotty connections.',
      url: 'https://smart-sari-pos.vercel.app/'
    },
    {
      name: 'Roseatte',
      description: 'A WordPress website I designed and built for my girlfriend to showcase her artwork and creative portfolio.',
      url: 'https://roseatte.lovestoblog.com'
    },
    {
      name: 'Knowledge Base App',
      description: 'A knowledge-sharing app for my friend group to upload, organize, and share resources — built with Next.js and Supabase, with file storage on AWS S3.',
      url: 'https://knwrepo.vercel.app/'
    },
    {
      name: 'Form Conversion Tool',
      description: 'A tool that streamlines my form-conversion work by using AI to generate the source code for online forms — built with React and Vite.',
      url: 'https://formconversiontool.vercel.app/'
    },
    {
      name: 'PPL Admin Dashboard',
      description: 'An in-house tool I built for the company to manage ad campaigns and distribute leads across multiple channels — built in Laravel/Blade, integrating OpenAI, Meta Graph API, Google Cloud APIs, HubSpot, Telnyx, and GoHighLevel, deployed via Laravel Forge on DigitalOcean.',
      url: null,
      private: true
    },
    {
      name: 'Lizbeth Galarza Website',
      description: 'A real estate website that dynamically syncs and displays property listings pulled live from Smart MLS.',
      url: 'https://homeswithliz.com/'
    },
    {
      name: 'Social Media Content Generator',
      description: 'Another in-house tool I built for the company, generating a structured social media content calendar and post copy — built in Laravel and powered by OpenAI.',
      url: null,
      private: true
    },
    {
      name: 'Uni-verse',
      description: "A 2D RPG-style Learning Management System — lessons and quizzes reward the player's character, making studying feel like playing a game. Built in Godot with GDScript.",
      url: null
    }
  ],

  recommendations: [
    {
      quote: 'Gabriel is a goal-oriented individual who consistently delivers high-quality outputs. He works independently, takes initiative in completing his tasks, and is always willing to extend a helping hand to his colleagues.',
      author: 'Claudine Benitez',
      position: 'Supervisor at Proweaver Inc.'
    },
    {
      quote: 'An exceptional web developer at Proweaver, he consistently delivers high-quality work backed by strong technical expertise, keen attention to detail, and a solid understanding of modern web standards. Highly skilled yet very approachable, he is always willing to help, share knowledge, and step up whenever the team needs support—his many meaningful contributions have played a vital role in improving workflows and driving the team\'s overall growth. From my perspective as his Team Leader, his professionalism, reliability, and collaborative mindset make him a valuable asset to the company and a developer any organization would be fortunate to have.',
      author: 'Christopher Perez',
      position: 'Team Leader at Proweaver Inc.'
    },
    {
      quote: 'Sir Gabriel is an exceptional colleague who consistently completes tasks with precision and excellence. He works efficiently, stays highly organized, and is very easy to communicate and collaborate with. He is also attentive, approachable, and a pleasure to work with.',
      author: 'Eliezer Aguipo',
      position: 'Quality Checker Specialist at Proweaver Inc.',
    },
    {
      quote: 'He is a motivated and reliable team member who consistently delivers high-quality work. He takes initiative, handles tasks efficiently with little supervision, and is always willing to assist others when needed. He is also approachable and easy to work with, helping create a positive and comfortable environment for the team.',
      author: 'Angelica Sullano',
      position: 'Web Developer at Proweaver Inc.',
    },
    {
      quote: 'I would like to express my sincere appreciation for the opportunity to work with Gabriel. He consistently demonstrates a high level of professionalism, reliability, and accountability in all responsibilities entrusted to him. His strong attention to detail, effective communication, and willingness to collaborate contribute significantly to the team’s efficiency and overall success. Gabriel remains composed and solution-oriented even under pressure, allowing him to deliver quality results while meeting deadlines. He takes initiative when addressing challenges and can be relied upon to work independently with minimal supervision. Beyond his technical capabilities, Gabriel maintains a respectful, positive, and professional attitude that promotes a healthy and productive work environment. His strong work ethic, commitment to excellence, and supportive nature make him a valuable asset to the team. It has been a pleasure working alongside him, and his consistent contributions deserve recognition.',
      author: 'Kenrick Labuca',
      position: 'Web Developer at Proweaver Inc.',
    }
  ]
}
