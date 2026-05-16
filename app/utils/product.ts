/**
 * MAAKM product conventions.
 * Wired to Shopify Storefront product nodes per docs/design-system/PLAN.md §0.
 */

export type ProductColor = {
  hex: string
  label: string
}

/**
 * Hex map for the `Kleur` option values. Seeded with the four colors shown in
 * the design pattern doc — extend as new shades go into production.
 */
export const PRODUCT_COLORS: Record<string, ProductColor> = {
  Zand: { hex: '#d9c9a8', label: 'Zand' },
  Terracotta: { hex: '#c75a3c', label: 'Terracotta' },
  Crème: { hex: '#ece4d3', label: 'Crème' },
  Mos: { hex: '#3a4a37', label: 'Mos' },
  Antraciet: { hex: '#2a2a26', label: 'Antraciet' },
  Wit: { hex: '#f5f3ec', label: 'Wit' },
}

const FALLBACK_HEX = '#d9c9a8'

export function colorHex(value: string): string {
  return PRODUCT_COLORS[value]?.hex ?? FALLBACK_HEX
}

const MATERIAL_PREFIX = 'material:'
const BADGE_PREFIX = 'badge:'

export function materialFromTags(tags: string[]): string | undefined {
  const tag = tags.find((t) => t.startsWith(MATERIAL_PREFIX))
  return tag?.slice(MATERIAL_PREFIX.length)
}

export function badgeFromTags(tags: string[]): string | undefined {
  const tag = tags.find((t) => t.startsWith(BADGE_PREFIX))
  return tag?.slice(BADGE_PREFIX.length)
}

const BADGE_LABELS: Record<string, string> = {
  bestseller: 'Bestseller',
  nieuw: 'Nieuw',
  laatste: 'Laatste stuks',
}

export function badgeLabel(value: string): string {
  return BADGE_LABELS[value.toLowerCase()] ?? value
}

export type ProductCardData = {
  id: string
  handle: string
  title: string
  sub?: string
  imageUrl: string | null
  imageAlt?: string | null
  price: number
  currency: string
  tags: string[]
  colors: string[]
}

export function formatPrice(amount: number, currency = 'EUR', locale = 'nl-NL'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount)
}
