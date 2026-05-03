import { producerBrand } from '../../producerBrand.js'

const LOGO_SRC = '/hugen-music-logo.png'

export function LogoMark({ className = 'size-14' }) {
  return (
    <img
      src={LOGO_SRC}
      alt=""
      className={`shrink-0 object-contain ${className}`}
      decoding="async"
    />
  )
}

export function LogoWordmark({ className = '' }) {
  return (
    <h2
      className={`font-display text-xl font-black uppercase leading-tight tracking-tight text-white ${className}`}
    >
      {producerBrand}
    </h2>
  )
}
