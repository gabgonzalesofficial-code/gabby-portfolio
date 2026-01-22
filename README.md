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

## Tech Stack

- React 19
- Vite
- Tailwind CSS v4
- React Icons

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

## Project Structure

```
my-portfolio/
├── src/
│   ├── components/     # Reusable components
│   │   ├── Modal.jsx
│   │   └── TechIcon.jsx
│   ├── data/           # Data and content
│   │   └── profileData.js
│   ├── assets/         # Images and static assets
│   ├── App.jsx         # Main app component
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles
├── public/             # Public assets
├── vercel.json         # Vercel configuration
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
