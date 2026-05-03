/** Split an array into fixed-size chunks (last chunk may be shorter). */
export function chunkEvery(items, size) {
  if (size < 1) return []
  const chunks = []
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size))
  }
  return chunks
}
