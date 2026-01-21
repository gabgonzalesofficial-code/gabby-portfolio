// Tech Icons Component using react-icons
import { 
  SiHtml5, 
  SiCss3, 
  SiJavascript, 
  SiJquery,
  SiVuedotjs,
  SiReact,
  SiTailwindcss,
  SiVite,
  SiJson,
  SiPhp,
  SiLaravel,
  SiC,
  SiCplusplus,
  SiSharp,
  SiMysql,
  SiGit,
  SiGithub,
  SiBitbucket,
  SiVscodium,
  SiOpenai,
  SiGoogle
} from 'react-icons/si'
import { DiMysql, DiDatabase, DiJava } from 'react-icons/di'
import { FaCode } from 'react-icons/fa'

function TechIcon({ name, className = "w-5 h-5" }) {
  const iconMap = {
    html: SiHtml5,
    css: SiCss3,
    javascript: SiJavascript,
    jquery: SiJquery,
    vue: SiVuedotjs,
    react: SiReact,
    tailwind: SiTailwindcss,
    vite: SiVite,
    json: SiJson,
    php: SiPhp,
    laravel: SiLaravel,
    java: DiJava,
    c: SiC,
    cpp: SiCplusplus,
    csharp: SiSharp,
    mysql: SiMysql,
    sql: DiDatabase,
    git: SiGit,
    github: SiGithub,
    bitbucket: SiBitbucket,
    vscode: SiVscodium,
    cursor: FaCode,
    gemini: SiGoogle,
    chatgpt: SiOpenai
  }

  const IconComponent = iconMap[name.toLowerCase()]
  
  if (!IconComponent) {
    return <div className={`${className} rounded bg-gray-300`} style={{ minWidth: '1rem', minHeight: '1rem' }}></div>
  }
  
  return <IconComponent className={className} style={{ display: 'inline-block', flexShrink: 0 }} />
}

export default TechIcon
