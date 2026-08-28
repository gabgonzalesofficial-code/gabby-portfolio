import { fallbacks } from '../data/profileImages'

/**
 * Serves WebP via <picture> with the original JPG/PNG as fallback.
 * Looks up the fallback from the profileImages registry so call sites
 * can keep passing a single `src` string.
 */
export default function OptimizedImage({
  src,
  alt = '',
  className,
  style,
  loading = 'lazy',
  decoding = 'async',
  ...rest
}) {
  const fallback = src ? fallbacks.get(src) : undefined
  const img = (
    <img
      src={fallback || src}
      alt={alt}
      className={className}
      style={style}
      loading={loading}
      decoding={decoding}
      {...rest}
    />
  )

  if (!fallback) return img

  return (
    <picture style={{ display: 'contents' }}>
      <source srcSet={src} type="image/webp" />
      {img}
    </picture>
  )
}
