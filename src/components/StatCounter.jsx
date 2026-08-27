import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { prefersReducedMotion } from '../lib/motion'

let registered = false
if (!registered) {
  gsap.registerPlugin(ScrollTrigger)
  registered = true
}

// Parses a leading sign/currency + number out of strings like "+50%", "-70%", "$0".
// Ranges like "10-20/wk" aren't a single number to count up to, so they're left as static text.
function parseValue(raw) {
  if (/^\d+\s*-\s*\d+/.test(raw)) return null
  const match = /^([+-]?)(\$?)(\d+(?:\.\d+)?)(.*)$/.exec(raw)
  if (!match) return null
  const [, sign, currency, number, suffix] = match
  return { sign, currency, target: parseFloat(number), isInt: Number.isInteger(parseFloat(number)), suffix }
}

export default function StatCounter({ value }) {
  const ref = useRef(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return

    const parsed = parseValue(value)
    if (!parsed || prefersReducedMotion()) return

    el.textContent = `${parsed.sign}${parsed.currency}0${parsed.suffix}`
    const obj = { n: 0 }

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          n: parsed.target,
          duration: 1.1,
          ease: 'power1.out',
          onUpdate: () => {
            const formatted = parsed.isInt ? Math.round(obj.n) : obj.n.toFixed(1)
            el.textContent = `${parsed.sign}${parsed.currency}${formatted}${parsed.suffix}`
          },
        })
      },
    })

    return () => trigger.kill()
  }, [value])

  return <span ref={ref}>{value}</span>
}
