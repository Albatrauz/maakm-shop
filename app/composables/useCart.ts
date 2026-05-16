import type { ShopifyImage, ShopifyMoneyV2, ShopifySelectedOption } from '~/utils/shopify'

export type CartLineMerchandise = {
  id: string
  title: string
  image: ShopifyImage | null
  price: ShopifyMoneyV2
  selectedOptions: ShopifySelectedOption[]
  product: {
    id: string
    handle: string
    title: string
    featuredImage: ShopifyImage | null
  }
}

export type CartLine = {
  id: string
  quantity: number
  cost: { totalAmount: ShopifyMoneyV2 }
  merchandise: CartLineMerchandise
}

export type Cart = {
  id: string
  checkoutUrl: string
  totalQuantity: number
  cost: {
    subtotalAmount: ShopifyMoneyV2
    totalAmount: ShopifyMoneyV2
  }
  lines: { edges: Array<{ node: CartLine }> }
}

type CartUserError = { field?: string[]; message: string }

const CART_FRAGMENT = /* GraphQL */ `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
      totalAmount {
        amount
        currencyCode
      }
    }
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
          merchandise {
            ... on ProductVariant {
              id
              title
              image {
                url
                altText
              }
              price {
                amount
                currencyCode
              }
              selectedOptions {
                name
                value
              }
              product {
                id
                handle
                title
                featuredImage {
                  url
                  altText
                }
              }
            }
          }
        }
      }
    }
  }
`

const CART_QUERY = /* GraphQL */ `
  query GetCart($id: ID!) {
    cart(id: $id) {
      ...CartFields
    }
  }
  ${CART_FRAGMENT}
`

const CART_CREATE = /* GraphQL */ `
  mutation CartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
  ${CART_FRAGMENT}
`

const CART_LINES_ADD = /* GraphQL */ `
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
  ${CART_FRAGMENT}
`

const CART_LINES_UPDATE = /* GraphQL */ `
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
  ${CART_FRAGMENT}
`

const CART_LINES_REMOVE = /* GraphQL */ `
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
  ${CART_FRAGMENT}
`

const CART_ID_KEY = 'maakm:cart-id'
export const FREE_SHIPPING_THRESHOLD = 50

export const useCart = () => {
  const cart = useState<Cart | null>('cart', () => null)
  const drawerOpen = useState<boolean>('cart-drawer-open', () => false)
  const initialized = useState<boolean>('cart-initialized', () => false)
  const loading = useState<boolean>('cart-loading', () => false)
  const lastError = useState<string | null>('cart-error', () => null)

  const { shopifyFetch } = useShopify()

  function persistId(id: string | null) {
    if (!import.meta.client) return
    if (id) localStorage.setItem(CART_ID_KEY, id)
    else localStorage.removeItem(CART_ID_KEY)
  }

  function readId(): string | null {
    if (!import.meta.client) return null
    return localStorage.getItem(CART_ID_KEY)
  }

  function handleUserErrors(errors: CartUserError[] | undefined) {
    if (errors?.length) throw new Error(errors[0].message)
  }

  async function init() {
    if (!import.meta.client || initialized.value) return
    initialized.value = true
    const id = readId()
    if (!id) return
    try {
      const res = await shopifyFetch<{ cart: Cart | null }>(CART_QUERY, { id })
      cart.value = res.cart
      if (!res.cart) persistId(null)
    } catch {
      persistId(null)
    }
  }

  async function ensureCart(): Promise<Cart> {
    if (cart.value?.id) return cart.value
    const res = await shopifyFetch<{
      cartCreate: { cart: Cart | null; userErrors: CartUserError[] }
    }>(CART_CREATE, { input: {} })
    handleUserErrors(res.cartCreate.userErrors)
    if (!res.cartCreate.cart) throw new Error('Kon winkelmand niet aanmaken.')
    cart.value = res.cartCreate.cart
    persistId(res.cartCreate.cart.id)
    return res.cartCreate.cart
  }

  async function withState(fn: () => Promise<void>): Promise<boolean> {
    loading.value = true
    lastError.value = null
    try {
      await fn()
      return true
    } catch (e) {
      lastError.value = e instanceof Error ? e.message : 'Iets ging mis.'
      return false
    } finally {
      loading.value = false
    }
  }

  function addLine(merchandiseId: string, quantity = 1) {
    return withState(async () => {
      const c = await ensureCart()
      const res = await shopifyFetch<{
        cartLinesAdd: { cart: Cart | null; userErrors: CartUserError[] }
      }>(CART_LINES_ADD, {
        cartId: c.id,
        lines: [{ merchandiseId, quantity }],
      })
      handleUserErrors(res.cartLinesAdd.userErrors)
      if (res.cartLinesAdd.cart) cart.value = res.cartLinesAdd.cart
      drawerOpen.value = true
    })
  }

  function updateLine(lineId: string, quantity: number): Promise<boolean> {
    if (quantity <= 0) return removeLine(lineId)
    return withState(async () => {
      if (!cart.value) return
      const res = await shopifyFetch<{
        cartLinesUpdate: { cart: Cart | null; userErrors: CartUserError[] }
      }>(CART_LINES_UPDATE, {
        cartId: cart.value.id,
        lines: [{ id: lineId, quantity }],
      })
      handleUserErrors(res.cartLinesUpdate.userErrors)
      if (res.cartLinesUpdate.cart) cart.value = res.cartLinesUpdate.cart
    })
  }

  function removeLine(lineId: string) {
    return withState(async () => {
      if (!cart.value) return
      const res = await shopifyFetch<{
        cartLinesRemove: { cart: Cart | null; userErrors: CartUserError[] }
      }>(CART_LINES_REMOVE, {
        cartId: cart.value.id,
        lineIds: [lineId],
      })
      handleUserErrors(res.cartLinesRemove.userErrors)
      if (res.cartLinesRemove.cart) cart.value = res.cartLinesRemove.cart
    })
  }

  const lines = computed(() => cart.value?.lines.edges.map((e) => e.node) ?? [])
  const totalQuantity = computed(() => cart.value?.totalQuantity ?? 0)
  const subtotal = computed(() => Number(cart.value?.cost.subtotalAmount.amount ?? 0))
  const currency = computed(() => cart.value?.cost.subtotalAmount.currencyCode ?? 'EUR')
  const checkoutUrl = computed(() => cart.value?.checkoutUrl ?? '')
  const freeShippingRemaining = computed(() =>
    Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal.value),
  )
  const freeShippingProgress = computed(() =>
    Math.min(1, subtotal.value / FREE_SHIPPING_THRESHOLD),
  )

  return {
    cart,
    lines,
    totalQuantity,
    subtotal,
    currency,
    checkoutUrl,
    freeShippingRemaining,
    freeShippingProgress,
    loading,
    lastError,
    drawerOpen,
    init,
    addLine,
    updateLine,
    removeLine,
    openDrawer: () => {
      drawerOpen.value = true
    },
    closeDrawer: () => {
      drawerOpen.value = false
    },
    toggleDrawer: () => {
      drawerOpen.value = !drawerOpen.value
    },
  }
}
