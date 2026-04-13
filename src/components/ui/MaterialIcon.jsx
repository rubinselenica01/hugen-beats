/** Google Material Symbols — loaded via index.html */
export function MaterialIcon({
  name,
  className = '',
  filled = false,
  style,
  ...rest
}) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={{
        fontVariationSettings: filled ? "'FILL' 1" : undefined,
        ...style,
      }}
      {...rest}
    >
      {name}
    </span>
  )
}
