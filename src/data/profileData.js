// Profile Information
import profileImage from '../assets/PP.png'
import gcashQR from '../assets/QRgcash.jpg'

export const profileInfo = {
  name: 'Gabriel Gonzales',
  location: 'Cebu City, Philippines',
  title: 'Web/WordPress Developer',
  profileImage: profileImage,
  verified: true,
  contact: {
    email: 'gabgonzalesofficial@gmail.com',
    mobile: '+63 945 804 7946',
    linkedin: 'https://www.linkedin.com/in/gabriel-gonzales-9733ab1a3'
  },
  donation: {
    gcash: {
      number: '09458047946',
      name: 'Gabriel Gonzales',
      qrCode: gcashQR // You can add a QR code image path here later
    },
    paypal: {
      email: 'jibrilgon@gmail.com',
      link: 'https://paypal.me/jibrilgonza', // Update with your PayPal link
      // Default donation amounts (in PHP)
      defaultAmounts: [100, 500, 1000, 2000, 5000],
      currency: 'PHP'
    },
    paymaya: {
      number: '', // Add your PayMaya number if you have one
      name: 'Gabriel Gonzales',
      qrCode: null // You can add a QR code image path here later
    },
    message: 'Thank you for your support! Your donation helps me continue creating great content and projects.'
  }
}

// Badges/Awards
export const badges = [
  {
    id: 1,
    text: 'Award Badge 1',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800',
    size: 'sm'
  },
  {
    id: 2,
    title: 'Award Badge 2 Title',
    organizer: 'ORGANIZED BY',
    description: 'Award description text placeholder',
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-800',
    size: 'lg'
  }
]

// CTA Buttons
export const ctaButtons = [
  {
    id: 1,
    text: 'Button 1',
    icon: 'calendar',
    variant: 'dark'
  },
  {
    id: 2,
    text: 'Button 2',
    icon: 'email',
    variant: 'light'
  },
  {
    id: 3,
    text: 'Button 3',
    icon: 'chat',
    variant: 'primary'
  }
]

// About Section
export const aboutContent = [
  'A proactive and fast-learning professional who consistently strives for excellence in every task.',
  'Recently, I have been exploring and integrating AI into application development, with hands-on experience using AI tools such as Cursor, ChatGPT, and Gemini to improve productivity, streamline workflows, and enhance overall efficiency in the workplace.'
]

// Tech Stack
export const techStack = {
  frontend: [
    { name: 'HTML', icon: 'html' },
    { name: 'CSS', icon: 'css' },
    { name: 'JavaScript', icon: 'javascript' },
    { name: 'jQuery', icon: 'jquery' },
    { name: 'Vue.js', icon: 'vue' },
    { name: 'React', icon: 'react' },
    { name: 'Next.js', icon: 'nextjs' },
    { name: 'Tailwind CSS', icon: 'tailwind' },
    { name: 'Vite', icon: 'vite' },
    { name: 'JSON', icon: 'json' }
  ],
  backend: [
    { name: 'PHP', icon: 'php' },
    { name: 'Laravel', icon: 'laravel' },
    { name: 'Java', icon: 'java' },
    { name: 'Python', icon: 'python' },
    { name: 'C', icon: 'c' },
    { name: 'C++', icon: 'cpp' },
    { name: 'C#', icon: 'csharp' }
  ],
  crmCms: [
    { name: 'WordPress', icon: 'wordpress' },
    { name: 'Salesforce', icon: 'salesforce' }
  ],
  automation: [
    { name: 'Selenium', icon: 'selenium' }
  ],
  database: [
    { name: 'MySQL', icon: 'mysql' },
    { name: 'SQL', icon: 'sql' },
    { name: 'Supabase', icon: 'supabase' }
  ],
  tools: [
    { name: 'Git', icon: 'git' },
    { name: 'GitHub', icon: 'github' },
    { name: 'Bitbucket', icon: 'bitbucket' },
    { name: 'VS Code', icon: 'vscode' },
    { name: 'Cursor', icon: 'cursor' },
    { name: 'Vercel', icon: 'vercel' },
    { name: 'Formspree', icon: 'formspree' }
  ],
  gameDev: [
    { name: 'Godot', icon: 'godot' }
  ],
  aiTools: [
    { name: 'Gemini AI Studio', icon: 'gemini', description: 'AI Integration' },
    { name: 'ChatGPT', icon: 'chatgpt', description: 'Content Generation' },
    { name: 'Gemini', icon: 'gemini', description: 'Content Generation' }
  ]
}

// Beyond Coding Section
export const beyondCoding = [
  'I love to write poems',
  'I also love to cook whenever I have the resources'
]

// Certifications
export const certifications = [
  { id: 1, name: 'Certificate of Completion', issuer: 'Vjal Institure', year: '2026' },
  { id: 2, name: 'Top Performer', issuer: 'Proweaver Inc.', year: '2025' },
  { id: 3, name: 'Top Performer', issuer: 'Proweaver Inc.', year: '2024' },
  { id: 4, name: 'Certification 4', issuer: 'Organization 4', year: '2023' },
  { id: 5, name: 'Certification 5', issuer: 'Organization 5', year: '2022' },
  { id: 6, name: 'Certification 6', issuer: 'Organization 6', year: '2022' },
  { id: 7, name: 'Certification 7', issuer: 'Organization 7', year: '2021' },
  { id: 8, name: 'Certification 8', issuer: 'Organization 8', year: '2021' },
  { id: 9, name: 'Certification 9', issuer: 'Organization 9', year: '2020' },
  { id: 10, name: 'Certification 10', issuer: 'Organization 10', year: '2020' }
]

// Organizations/Memberships
export const memberships = [
  { id: 1, name: 'Organization 1', url: '#' },
  { id: 2, name: 'Organization 2', url: '#' }
]

// Gallery Images
export const galleryImages = [
  { id: 1, src: 'https://via.placeholder.com/600x400?text=Gallery+Image+1', alt: 'Gallery Image 1' },
  { id: 2, src: 'https://via.placeholder.com/600x400?text=Gallery+Image+2', alt: 'Gallery Image 2' },
  { id: 3, src: 'https://via.placeholder.com/600x400?text=Gallery+Image+3', alt: 'Gallery Image 3' },
  { id: 4, src: 'https://via.placeholder.com/600x400?text=Gallery+Image+4', alt: 'Gallery Image 4' },
  { id: 5, src: 'https://via.placeholder.com/600x400?text=Gallery+Image+5', alt: 'Gallery Image 5' }
]

// Experience Timeline
export const experience = [
  { id: 1, role: 'Senior Web/WordPress Developer', company: 'Proweaver Inc.', year: '2023 - Present' },
  { id: 2, role: 'Salesforce Automation Testing Intern', company: 'Accenture', year: '2023 - 2023' },
  { id: 3, role: 'B.S. in Computer Science', company: 'University of Southern Philippines Foundation (graduate)', year: '2019 - 2023' },
  { id: 4, role: 'Student Projects Developer', company: 'Freelance', year: '2016 - 2018' },
  { id: 5, role: 'B.S. in Computer Science', company: 'University of Philippines College Cebu (non-graduate)', year: '2012 - 2015' }
]

// Projects
export const projects = [
  { id: 1, name: 'AI Form Converter', description: 'Using Laravel Vue and Gemini AI Studio to convert forms to using AI to read references', url: 'project1.com' },
  { id: 2, name: 'Roseatte', description: 'A WordPress website I made for my girlfriend', url: 'project2.com' },
  { id: 3, name: 'Form Conversion Tool', description: 'A tool I developed using react to for form conversion', url: 'https://formconversiontool.vercel.app/' },
  { id: 4, name: 'KB App 4', description: 'Knowledge Base App using Next.js and Supabase', url: 'https://kb-app-five.vercel.app/' }
]

// Recommendations
export const recommendations = [
  {
    id: 1,
    quote: 'Gabriel is a goal-oriented individual who consistently delivers high-quality outputs. He works independently, takes initiative in completing his tasks, and is always willing to extend a helping hand to his colleagues.',
    author: 'Claudine Benitez',
    position: 'Supervisor at Proweaver Inc.',
    active: true
  },
  {
    id: 2,
    quote: 'An exceptional web developer at Proweaver, he consistently delivers high-quality work backed by strong technical expertise, keen attention to detail, and a solid understanding of modern web standards. Highly skilled yet very approachable, he is always willing to help, share knowledge, and step up whenever the team needs support—his many meaningful contributions have played a vital role in improving workflows and driving the team’s overall growth. From my perspective as his Team Leader, his professionalism, reliability, and collaborative mindset make him a valuable asset to the company and a developer any organization would be fortunate to have.',
    author: 'Christopher Perez',
    position: 'Team Leader at Proweaver Inc.',
    active: false
  },
  {
    id: 3,
    quote: 'Third recommendation text placeholder.',
    author: 'Name 3',
    position: 'Title at Company 3',
    active: false
  },
  {
    id: 4,
    quote: 'Fourth recommendation text placeholder.',
    author: 'Name 4',
    position: 'Title at Company 4',
    active: false
  }
]

// Social Links
export const socialLinks = [
  { id: 1, name: 'Social 1', url: '#', icon: 'linkedin' },
  { id: 2, name: 'Social 2', url: '#', icon: 'github' },
  { id: 3, name: 'Social 3', url: '#', icon: 'instagram' }
]

// Speaking Section
export const speaking = {
  description: 'Speaking availability placeholder text.',
  ctaText: 'Get in touch'
}

// Contact Information
export const contactInfo = {
  email: 'email@example.com',
  scheduleCall: '#',
  joinDiscussion: '#'
}

// Footer
export const footer = {
  copyright: '© 2026 Gabriel Gonzales. All rights reserved.'
}
