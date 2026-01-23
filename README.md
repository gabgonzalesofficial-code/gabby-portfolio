# My Portfolio

A modern, responsive portfolio website built with React and Vite.

## Features

- 🎨 Modern and clean UI design
- 📱 Fully responsive layout
- ⚡ Fast performance with Vite
- 🎯 Modular component structure
- 🎨 Tailwind CSS for styling
- 🔧 Tech stack showcase with icons
- 📝 Experience timeline
- 🖼️ Project gallery
- 💬 Recommendations section
- 📧 Contact information
- 🤖 AI Chatbot powered by Groq

## Tech Stack

- React 19
- Vite
- Tailwind CSS v4
- React Icons
- Groq AI (for chatbot)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd my-portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Build for Production

```bash
npm run build
```

The build output will be in the `dist` directory.

## Deployment

This project is configured for easy deployment on Vercel. Simply connect your GitHub repository to Vercel and it will automatically deploy.

### Setting up the Chatbot on Vercel

1. After deploying to Vercel, go to your project settings
2. Navigate to **Environment Variables**
3. Add a new environment variable:
   - **Name:** `GROQ_API_KEY`
   - **Value:** Your Groq API key from [Groq Console](https://console.groq.com/)
4. Redeploy your application for the changes to take effect

The chatbot will be available via the floating chat button in the bottom-right corner of your portfolio.

## Project Structure

```
my-portfolio/
├── api/                # Serverless API routes
│   └── chat.js         # Groq API integration
├── src/
│   ├── components/     # Reusable components
│   │   ├── Modal.jsx
│   │   ├── TechIcon.jsx
│   │   └── ChatBot.jsx # AI Chatbot component
│   ├── data/           # Data and content
│   │   └── profileData.js
│   ├── assets/         # Images and static assets
│   ├── App.jsx         # Main app component
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles
├── public/             # Public assets
├── vercel.json         # Vercel configuration
├── .env.example        # Environment variables template
└── package.json        # Dependencies
```

## Customization

All content is stored in `src/data/profileData.js`. Simply edit this file to update:
- Profile information
- Tech stack
- Experience
- Projects
- Certifications
- And more!

## License

© 2025 Gabriel Gonzales. All rights reserved.
