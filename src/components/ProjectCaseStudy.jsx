import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { FaArrowLeft, FaExternalLinkAlt } from 'react-icons/fa'
import TechIcon from './TechIcon'
import ProjectStatStrip from './ProjectStatStrip'
import ProjectNDAVisual from './ProjectNDAVisual'
import Masonry from './Masonry'

function GallerySection({ project }) {
  const images = project.gallery || []
  if (images.length === 0) return null
  const items = images.map((img, i) => ({
    id: project.id + '-gallery-' + i,
    img: typeof img === 'string' ? img : img.src,
    url: typeof img === 'string' ? img : img.src,
    height: typeof img === 'object' ? (img.height || 300) : (i % 3 === 0 ? 400 : i % 3 === 1 ? 280 : 350),
  }))
  return (
    <div className="mt-12">
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 600 }} className="text-cream mb-6">Screenshots</h3>
      <div style={{ height: 600 }} className="relative">
        <Masonry items={items} ease="power3.out" duration={0.6} stagger={0.05} animateFrom="bottom" scaleOnHover={true} hoverScale={0.97} blurToFocus={true} />
      </div>
    </div>
  )
}
