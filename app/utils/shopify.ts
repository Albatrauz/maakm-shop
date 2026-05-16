import type { ProductCardData } from '~/utils/product'

export type ShopifyImage = { url: string; altText: string | null }

export type ShopifyMoneyV2 = { amount: string; currencyCode: string }

export type ShopifyOption = { name: string; values: string[] }

export type ShopifySelectedOption = { name: string; value: string }

export type ShopifyProductVariant = {
  id: string
  title: string
  availableForSale: boolean
  price: ShopifyMoneyV2
  selectedOptions: ShopifySelectedOption[]
  image: ShopifyImage | null
}

export type ShopifyProductNode = {
  id: string
  handle: string
  title: string
  description?: string
  descriptionHtml?: string
  productType?: string
  tags?: string[]
  featuredImage?: ShopifyImage | null
  images?: { edges: Array<{ node: ShopifyImage }> }
  priceRange: { minVariantPrice: ShopifyMoneyV2 }
  options?: ShopifyOption[]
  variants?: { edges: Array<{ node: ShopifyProductVariant }> }
}

export type ShopifyProductsResponse = {
  products: { edges: Array<{ node: ShopifyProductNode }> }
}

export type ShopifyProductResponse = {
  product: ShopifyProductNode | null
}

/* GraphQL fragments — keep in sync with adapter shape. */

export const PRODUCT_CARD_FRAGMENT = /* GraphQL */ `
  fragment ProductCardFields on Product {
    id
    handle
    title
    productType
    tags
    featuredImage {
      url
      altText
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    options {
      name
      values
    }
  }
`

export const PRODUCT_DETAIL_FRAGMENT = /* GraphQL */ `
  fragment ProductDetailFields on Product {
    id
    handle
    title
    description
    descriptionHtml
    productType
    tags
    featuredImage {
      url
      altText
    }
    images(first: 8) {
      edges {
        node {
          url
          altText
        }
      }
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    options {
      name
      values
    }
    variants(first: 50) {
      edges {
        node {
          id
          title
          availableForSale
          price {
            amount
            currencyCode
          }
          selectedOptions {
            name
            value
          }
          image {
            url
            altText
          }
        }
      }
    }
  }
`

export const PRODUCTS_QUERY = /* GraphQL */ `
  query GetProducts($first: Int!, $query: String) {
    products(first: $first, query: $query) {
      edges {
        node {
          ...ProductCardFields
        }
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
`

export const PRODUCT_BY_HANDLE_QUERY = /* GraphQL */ `
  query GetProduct($handle: String!) {
    product(handle: $handle) {
      ...ProductDetailFields
    }
  }
  ${PRODUCT_DETAIL_FRAGMENT}
`

export type ShopifyCollectionNode = {
  id: string
  handle: string
  title: string
  description?: string
  descriptionHtml?: string
  image: ShopifyImage | null
  products?: { edges: Array<{ node: ShopifyProductNode }> }
}

export type ShopifyCollectionsResponse = {
  collections: { edges: Array<{ node: ShopifyCollectionNode }> }
}

export type ShopifyCollectionResponse = {
  collection: ShopifyCollectionNode | null
}

export const COLLECTIONS_QUERY = /* GraphQL */ `
  query GetCollections($first: Int!) {
    collections(first: $first) {
      edges {
        node {
          id
          handle
          title
          description
          image {
            url
            altText
          }
        }
      }
    }
  }
`

export const COLLECTION_BY_HANDLE_QUERY = /* GraphQL */ `
  query GetCollection($handle: String!, $first: Int!) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      descriptionHtml
      image {
        url
        altText
      }
      products(first: $first) {
        edges {
          node {
            ...ProductCardFields
          }
        }
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
`

const COLOR_OPTION_NAMES = ['Kleur', 'Color', 'Colour']

export function getColorOption(node: ShopifyProductNode): string[] {
  const option = node.options?.find((o) => COLOR_OPTION_NAMES.includes(o.name))
  return option?.values ?? []
}

export function toProductCardData(node: ShopifyProductNode): ProductCardData {
  return {
    id: node.id,
    handle: node.handle,
    title: node.title,
    sub: node.productType || undefined,
    imageUrl: node.featuredImage?.url ?? null,
    imageAlt: node.featuredImage?.altText ?? null,
    price: Number(node.priceRange.minVariantPrice.amount),
    currency: node.priceRange.minVariantPrice.currencyCode,
    tags: node.tags ?? [],
    colors: getColorOption(node),
  }
}

export function imagesFromNode(node: ShopifyProductNode): ShopifyImage[] {
  const list = node.images?.edges.map((e) => e.node) ?? []
  if (list.length) return list
  return node.featuredImage ? [node.featuredImage] : []
}

export function variantsFromNode(node: ShopifyProductNode): ShopifyProductVariant[] {
  return node.variants?.edges.map((e) => e.node) ?? []
}
