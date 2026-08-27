export default function Footer({ footer }) {
  return (
    <footer className="max-w-7xl mx-auto px-4 py-6 border-t border-tan/15">
      <p className="text-center text-tan/60 text-sm">{footer.copyright}</p>
      <p className="text-center text-tan/40 text-xs mt-1">
        {footer.modelCredit.prefix}
        <a
          href={footer.modelCredit.titleUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-cream/70"
        >
          {footer.modelCredit.title}
        </a>
        {footer.modelCredit.middle}
        <a
          href={footer.modelCredit.licenseUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-cream/70"
        >
          {footer.modelCredit.license}
        </a>
      </p>
    </footer>
  )
}
