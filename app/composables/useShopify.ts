// composables/useShopify.ts
export const useShopify = () => {
  const config = useRuntimeConfig()

  const shopifyFetch = async <T = unknown>(
    query: string,
    variables?: Record<string, unknown>
  ): Promise<T> => {
    const url = `https://${config.public.shopifyDomain}/api/${config.public.shopifyApiVersion}/graphql.json`

    const response = await $fetch<{ data: T; errors?: Array<{ message: string }> }>(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': config.public.shopifyToken,
      },
      body: { query, variables },
    })

    if (response.errors?.length) {
      throw new Error(response.errors.map((e) => e.message).join(', '))
    }

    return response.data
  }

  return { shopifyFetch }
}
