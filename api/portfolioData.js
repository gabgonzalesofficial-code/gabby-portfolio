// Portfolio data for AI chatbot - extracted from src/data/profileData.js
// This ensures the AI has access to accurate information

export const portfolioData = {
  profileInfo: {
    name: 'Gabriel Gonzales',
    location: 'Cebu City, Philippines',
    title: 'Web/WordPress Developer',
    contact: {
      email: 'fdg.gonzalesgabriel@gmail.com',
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
    crmCms: ['WordPress', 'Salesforce'],
    automation: ['Selenium'],
    database: ['MySQL', 'SQL', 'Supabase'],
    tools: ['Git', 'GitHub', 'Bitbucket', 'VS Code', 'Cursor', 'Vercel', 'Formspree'],
    gameDev: ['Godot'],
    aiTools: [
      { name: 'Gemini AI Studio', description: 'AI Integration' },
      { name: 'ChatGPT', description: 'Content Generation' },
      { name: 'Gemini', description: 'Content Generation' }
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
    { role: 'Senior Web/WordPress Developer', company: 'Proweaver Inc.', year: '2023 - Present' },
    { role: 'Salesforce Automation Testing Intern', company: 'Accenture', year: '2023 - 2023' },
    { role: 'B.S. in Computer Science', company: 'University of Southern Philippines Foundation (graduate)', year: '2019 - 2023' },
    { role: 'Student Projects Developer', company: 'Freelance', year: '2016 - 2018' },
    { role: 'B.S. in Computer Science', company: 'University of Philippines College Cebu (non-graduate)', year: '2012 - 2015' }
  ],

  projects: [
    { name: 'AI Form Converter', description: 'Using Laravel Vue and Gemini AI Studio to convert forms to using AI to read references', url: 'tobedeployed.com' },
    { name: 'Roseatte', description: 'A WordPress website I made for my girlfriend using a custom theme, I deployed this on Free hosting platform, InfinityFree. This is also still a work in progress. It needs polishing and more features to be added as well as content.', url: 'https://roseatte.lovestoblog.com' },
    { name: 'Form Conversion Tool', description: 'A tool I developed using react to for form conversion using reactJS and Vite. Deployed in Vercel through GitHub', url: 'https://formconversiontool.vercel.app/' },
    { name: 'Knowledge Base App', description: 'An app I developed to be used by my friends to share knowledge and resourece. Made using Next.js and Supabase. Deployed in Vercel through GitHub', url: 'https://kb-app-five.vercel.app/' }
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
      quote: 'Third recommendation text placeholder.',
      author: 'Name 3',
      position: 'Title at Company 3'
    },
    {
      quote: 'Fourth recommendation text placeholder.',
      author: 'Name 4',
      position: 'Title at Company 4'
    }
  ]
}
