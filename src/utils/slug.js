export const makeSlug = (str) => {
  return (str || "")
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove invalid chars
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
}
