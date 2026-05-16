<script setup lang="ts">
import {
  PRODUCTS_QUERY,
  type ShopifyProductsResponse,
  toProductCardData,
} from '~/utils/shopify'
import {
  badgeFromTags,
  materialFromTags,
  type ProductCardData,
} from '~/utils/product'

const { shopifyFetch } = useShopify()

const { data, error, pending } = await useAsyncData('shop-products', async () => {
  const res = await shopifyFetch<ShopifyProductsResponse>(PRODUCTS_QUERY, { first: 60 })
  return res.products.edges.map((e) => toProductCardData(e.node))
})

const allProducts = computed(() => data.value ?? [])

const materialFilter = ref<string[]>([])
const colorFilter = ref<string[]>([])
const badgeFilter = ref<string[]>([])

type SortKey = 'featured' | 'price-asc' | 'price-desc'
const sort = ref<SortKey>('featured')

function countBy<T, K extends string | undefined>(items: T[], key: (i: T) => K) {
  const map = new Map<string, number>()
  for (const i of items) {
    const k = key(i)
    if (!k) continue
    map.set(k, (map.get(k) ?? 0) + 1)
  }
  return map
}

const materialOptions = computed(() => {
  const counts = countBy(allProducts.value, (p) => materialFromTags(p.tags))
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([id, count]) => ({ id, label: id, count }))
})

const colorOptions = computed(() => {
  const counts = new Map<string, number>()
  for (const p of allProducts.value) {
    for (const c of p.colors) counts.set(c, (counts.get(c) ?? 0) + 1)
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([id, count]) => ({ id, label: id, count }))
})

const badgeOptions = computed(() => {
  const counts = countBy(allProducts.value, (p) => badgeFromTags(p.tags))
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([id, count]) => ({ id, label: id, count }))
})

const filtered = computed(() => {
  let list: ProductCardData[] = allProducts.value
  if (materialFilter.value.length) {
    list = list.filter((p) => {
      const m = materialFromTags(p.tags)
      return m ? materialFilter.value.includes(m) : false
    })
  }
  if (colorFilter.value.length) {
    list = list.filter((p) => p.colors.some((c) => colorFilter.value.includes(c)))
  }
  if (badgeFilter.value.length) {
    list = list.filter((p) => {
      const b = badgeFromTags(p.tags)
      return b ? badgeFilter.value.includes(b) : false
    })
  }
  if (sort.value === 'price-asc') list = [...list].sort((a, b) => a.price - b.price)
  if (sort.value === 'price-desc') list = [...list].sort((a, b) => b.price - a.price)
  return list
})

function resetFilters() {
  materialFilter.value = []
  colorFilter.value = []
  badgeFilter.value = []
}

const hasFilters = computed(
  () =>
    materialFilter.value.length || colorFilter.value.length || badgeFilter.value.length,
)
</script>

<template>
  <div class="shop shell">
    <header class="shop__header">
      <h1 class="h2">
        De catalogus<span class="serif shop__accent"> — alles wat we maken.</span>
      </h1>
      <p class="shop__lead">
        Alles wordt op bestelling geprint in Raamsdonksveer. Levertijd 3–5 dagen.
      </p>
    </header>

    <div class="shop__layout">
      <aside class="shop__sidebar">
        <div class="shop__filters-header">
          <h2 class="kicker">Filters</h2>
          <button
            v-if="hasFilters"
            type="button"
            class="shop__reset"
            @click="resetFilters"
          >
            Reset
          </button>
        </div>

        <MFilterGroup
          v-if="materialOptions.length"
          v-model="materialFilter"
          title="Materiaal"
          :options="materialOptions"
        />
        <MFilterGroup
          v-if="colorOptions.length"
          v-model="colorFilter"
          title="Kleur"
          :options="colorOptions"
        />
        <MFilterGroup
          v-if="badgeOptions.length"
          v-model="badgeFilter"
          title="Labels"
          :options="badgeOptions"
        />
      </aside>

      <section class="shop__results">
        <div class="shop__results-bar">
          <span class="mono">
            {{ filtered.length }} van {{ allProducts.length }}
          </span>
          <label class="shop__sort">
            <span class="kicker">Sorteer</span>
            <select v-model="sort">
              <option value="featured">Aanbevolen</option>
              <option value="price-asc">Prijs · laag → hoog</option>
              <option value="price-desc">Prijs · hoog → laag</option>
            </select>
          </label>
        </div>

        <div v-if="error" class="state state--error">
          Fout bij ophalen producten: {{ error.message }}
        </div>

        <div v-else-if="pending && !allProducts.length" class="state">Laden…</div>

        <div v-else-if="!filtered.length" class="state">
          Geen producten gevonden met deze filters.
        </div>

        <div v-else class="grid">
          <MProductCard v-for="p in filtered" :key="p.id" :product="p" />
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.shop {
  padding-top: var(--spacing-3xl);
  padding-bottom: var(--spacing-3xl);
}

.shop__header {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-bottom: 40px;
  border-bottom: 1px solid var(--color-line);
  margin-bottom: 40px;
}

.shop__accent {
  color: var(--color-ink-3);
}

.shop__lead {
  color: var(--color-ink-2);
  max-width: 50ch;
}

.shop__layout {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 48px;
  align-items: start;
}

.shop__sidebar {
  position: sticky;
  top: 96px;
}

.shop__filters-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
}

.shop__reset {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-accent);
  background: none;
  border: 0;
  padding: 0;
  cursor: pointer;
}

.shop__results-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--color-line);
  margin-bottom: 32px;
}

.shop__sort {
  display: flex;
  align-items: center;
  gap: 10px;
}

.shop__sort select {
  font: inherit;
  border: 1px solid var(--color-line);
  border-radius: var(--radius-sm);
  background: var(--color-paper);
  padding: 8px 12px;
  font-size: 13px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.state {
  padding: 32px;
  border: 1px solid var(--color-line);
  border-radius: var(--radius-md);
  color: var(--color-ink-2);
  background: var(--color-paper);
}

.state--error {
  border-color: var(--color-accent);
  color: var(--color-accent);
}

@media (max-width: 1024px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 720px) {
  .shop__layout {
    grid-template-columns: 1fr;
  }
  .shop__sidebar {
    position: static;
  }
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
