// Portfolio data for AI chatbot
// Projects are imported from the shared source of truth: src/data/projectsText.js
// Other profile data is defined here for the chatbot context.

import { projectsText } from '../src/data/projectsText'

export const portfolioData = {
  profileInfo: {
    name: 'Gabriel Gonzales',
    location: 'Cebu City, Philippines',
    title: 'Full Stack Web/WordPress Developer',
    tagline: 'Building tools that boost team efficiency and cut manual work.',
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

  expertise: [
    { name: 'WordPress Development', description: 'Custom themes and plugins, complex form flows, and ongoing maintenance.' },
    { name: 'Internal Tools & Automation', description: 'In-house platforms that replace costly third-party SaaS and cut repetitive manual work.' },
    { name: 'API & Platform Integrations', description: 'Connecting CRMs, telephony, ad platforms, and internal systems.' },
    { name: 'AI Integration', description: 'Weaving LLMs and AI workflows into real products.' },
    { name: 'Debugging & Troubleshooting', description: 'Finding root causes in unfamiliar codebases and fixing them properly.' }
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

  beyondCoding: ['I love to write poems', 'I also love to cook whenever I have the resources'],

  certifications: [
    { name: 'WordPress Fundamentals', issuer: 'Alison', year: '2026' },
    { name: 'AI for Communities Workshop', issuer: 'Vjal Institute', year: '2026' },
    { name: 'Top Performer', issuer: 'Proweaver Inc.', year: '2024-2025' },
    { name: 'Top Conversion', issuer: 'Proweaver Inc.', year: '2024-2025' },
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

  // Projects imported from shared source of truth
  projects: projectsText,

  recommendations: [
    { quote: 'Gabriel is a goal-oriented individual who consistently delivers high-quality outputs. He works independently, takes initiative, and is always willing to extend a helping hand.', author: 'Claudine Benitez', position: 'Supervisor at Proweaver Inc.' },
    { quote: 'An exceptional web developer who consistently delivers high-quality work backed by strong technical expertise, keen attention to detail, and a solid understanding of modern web standards.', author: 'Christopher Perez', position: 'Team Leader at Proweaver Inc.' },
    { quote: 'An exceptional colleague who consistently completes tasks with precision and excellence. He works efficiently, stays highly organized, and is very easy to communicate with.', author: 'Eliezer Aguipo', position: 'Quality Checker Specialist at Proweaver Inc.' },
    { quote: 'A motivated and reliable team member who consistently delivers high-quality work. He takes initiative, handles tasks efficiently, and is always willing to assist others.', author: 'Angelica Sullano', position: 'Web Developer at Proweaver Inc.' },
    { quote: 'Gabriel remains composed and solution-oriented even under pressure. He takes initiative when addressing challenges and can be relied upon to work independently.', author: 'Kenrick Labuca', position: 'Web Developer at Proweaver Inc.' }
  ]
}
