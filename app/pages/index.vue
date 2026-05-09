<!-- pages/index.vue -->
<script setup lang="ts">
const { shopifyFetch } = useShopify()

type ProductsResponse = {
  products: {
    edges: Array<{
      node: {
        id: string
        title: string
        handle: string
        description: string
        featuredImage: { url: string; altText: string | null } | null
        priceRange: {
          minVariantPrice: { amount: string; currencyCode: string }
        }
      }
    }>
  }
}

const query = `
  query GetProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          featuredImage { url altText }
          priceRange {
            minVariantPrice { amount currencyCode }
          }
        }
      }
    }
  }
`

const { data, error } = await useAsyncData('products', () =>
  shopifyFetch<ProductsResponse>(query, { first: 10 }),
)

const products = computed(
  () => data.value?.products.edges.map((e) => e.node) ?? [],
)
</script>

<template>
  <div class="mx-auto max-w-6xl p-8">
    <h1 class="mb-8 text-4xl font-bold">MaakM Studio</h1>

    <div v-if="error" class="rounded bg-red-50 p-4 text-red-600">
      Fout bij ophalen producten: {{ error.message }}
    </div>

    <div v-else-if="products.length === 0" class="text-gray-500">
      Nog geen producten gevonden. Check of je product op ACTIVE staat en
      gepubliceerd is naar het Headless-kanaal (zie hieronder).
    </div>

    <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <NuxtLink
        v-for="product in products"
        :key="product.id"
        :to="`/products/${product.handle}`"
        class="block overflow-hidden rounded-lg border transition hover:shadow-lg"
      >
        <img
          v-if="product.featuredImage"
          :src="product.featuredImage.url"
          :alt="product.featuredImage.altText || product.title"
          class="aspect-square w-full object-cover"
        />
        <div
          v-else
          class="flex aspect-square items-center justify-center bg-gray-100 text-gray-400"
        >
          Geen afbeelding
        </div>
        <div class="p-4">
          <h2 class="font-semibold">{{ product.title }}</h2>
          <p class="mt-1 text-sm text-gray-600">
            €{{ Number(product.priceRange.minVariantPrice.amount).toFixed(2) }}
          </p>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
