// Tech Icons Component — uses @icons-pack/react-simple-icons for authentic,
// build-time brand colors (color="default"), falling back to react-icons for
// brands that package doesn't ship (removed from upstream Simple Icons, or
// not a Simple Icons brand at all).
import {
  SiHtml5,
  SiCss,
  SiJavascript,
  SiJquery,
  SiVuedotjs,
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiVite,
  SiJson,
  SiPhp,
  SiLaravel,
  SiC,
  SiCplusplus,
  SiSharp,
  SiMysql,
  SiSupabase,
  SiPrisma,
  SiGit,
  SiGithub,
  SiBitbucket,
  SiVercel,
  SiWordpress,
  SiFormspree,
  SiPython,
  SiSelenium,
  SiGoogle,
  SiGodotengine,
  SiFigma,
  SiClaude,
  SiSuno,
  SiHubspot,
  SiMeta,
  SiGooglecloud,
  SiMongodb,
  SiDigitalocean,
  SiCursor,
  SiNestjs,
  SiPostgresql,
  SiTypescript
} from '@icons-pack/react-simple-icons'
import { SiSalesforce, SiAmazons3, SiCanva, SiOpenai } from 'react-icons/si'
import { DiDatabase, DiJava } from 'react-icons/di'
import { FaBolt } from 'react-icons/fa'
import { TbBrandMonday } from 'react-icons/tb'
import { VscVscode } from 'react-icons/vsc'

// GoHighLevel has no published icon anywhere — render a monogram badge in
// their official "Space Blue" instead.
function GoHighLevelIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={{ display: 'inline-block', flexShrink: 0 }}>
      <rect width="24" height="24" rx="6" fill="#0B223F" />
      <text x="12" y="17" textAnchor="middle" fontSize="13" fontWeight="700" fill="#FFFFFF" fontFamily="Arial, sans-serif">G</text>
    </svg>
  )
}

// Telnyx isn't in Simple Icons either — monogram badge in their brand black.
function TelnyxIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={{ display: 'inline-block', flexShrink: 0 }}>
      <rect width="24" height="24" rx="6" fill="#000000" />
      <text x="12" y="17" textAnchor="middle" fontSize="13" fontWeight="700" fill="#FFFFFF" fontFamily="Arial, sans-serif">T</text>
    </svg>
  )
}

// Brands whose Simple Icons mark is black/near-black — left theme-adaptive
// (currentColor) instead of forced to brand color, so they stay legible in
// dark mode against a dark pill background.
const MONOCHROME_KEYS = new Set(['nextjs', 'json', 'prisma', 'github', 'vercel', 'cursor'])

const RSI_ICONS = {
  html: SiHtml5,
  css: SiCss,
  javascript: SiJavascript,
  jquery: SiJquery,
  vue: SiVuedotjs,
  react: SiReact,
  nextjs: SiNextdotjs,
  tailwind: SiTailwindcss,
  vite: SiVite,
  json: SiJson,
  php: SiPhp,
  laravel: SiLaravel,
  c: SiC,
  cpp: SiCplusplus,
  csharp: SiSharp,
  mysql: SiMysql,
  supabase: SiSupabase,
  prisma: SiPrisma,
  git: SiGit,
  github: SiGithub,
  bitbucket: SiBitbucket,
  vercel: SiVercel,
  wordpress: SiWordpress,
  formspree: SiFormspree,
  python: SiPython,
  selenium: SiSelenium,
  gemini: SiGoogle,
  godot: SiGodotengine,
  figma: SiFigma,
  claude: SiClaude,
  suno: SiSuno,
  hubspot: SiHubspot,
  meta: SiMeta,
  googlecloud: SiGooglecloud,
  mongodb: SiMongodb,
  digitalocean: SiDigitalocean,
  cursor: SiCursor,
  nestjs: SiNestjs,
  postgresql: SiPostgresql,
  typescript: SiTypescript
}

// Brands removed from upstream Simple Icons (trademark takedowns), or not a
// Simple Icons brand at all — colored manually via their official hex.
const RI_ICONS = {
  salesforce: SiSalesforce,
  s3: SiAmazons3,
  canva: SiCanva,
  chatgpt: SiOpenai,
  java: DiJava,
  sql: DiDatabase,
  groq: FaBolt,
  monday: TbBrandMonday,
  vscode: VscVscode
}
const RI_COLORS = {
  salesforce: '#00A1E0',
  s3: '#569A31',
  canva: '#00C4CC',
  chatgpt: '#412991',
  java: '#ED8B00',
  monday: '#FF3D57',
  vscode: '#007ACC'
  // sql, groq have no distinct brand identity — left theme-adaptive
}

function TechIcon({ name, className = "w-5 h-5" }) {
  const key = name.toLowerCase()

  if (key === 'gohighlevel') {
    return <GoHighLevelIcon className={className} />
  }
  if (key === 'telnyx') {
    return <TelnyxIcon className={className} />
  }

  const RsiComponent = RSI_ICONS[key]
  if (RsiComponent) {
    const color = MONOCHROME_KEYS.has(key) ? undefined : 'default'
    return <RsiComponent className={className} color={color} style={{ display: 'inline-block', flexShrink: 0 }} />
  }

  const RiComponent = RI_ICONS[key]
  if (RiComponent) {
    return <RiComponent className={className} style={{ display: 'inline-block', flexShrink: 0, color: RI_COLORS[key] }} />
  }

  return <div className={`${className} rounded bg-gray-300`} style={{ minWidth: '1rem', minHeight: '1rem' }}></div>
}

export default TechIcon
