<script setup lang="ts">
import {
  COLLECTION_BY_HANDLE_QUERY,
  type ShopifyCollectionResponse,
  toProductCardData,
} from '~/utils/shopify'

const route = useRoute()
const handle = computed(() => String(route.params.handle))

const { shopifyFetch } = useShopify()

const { data, error } = await useAsyncData(
  () => `collection-${handle.value}`,
  async () => {
    const res = await shopifyFetch<ShopifyCollectionResponse>(
      COLLECTION_BY_HANDLE_QUERY,
      { handle: handle.value, first: 60 },
    )
    return res.collection
  },
)

const collection = computed(() => data.value)
const products = computed(
  () =>
    collection.value?.products?.edges.map((e) => toProductCardData(e.node)) ?? [],
)

const heroErrored = ref(false)
</script>

<template>
  <div class="cd shell">
    <nav class="cd__crumbs mono">
      <NuxtLink to="/collecties">Collecties</NuxtLink>
      <span>›</span>
      <span>{{ collection?.title ?? '…' }}</span>
    </nav>

    <div v-if="error" class="state state--error">
      Collectie niet gevonden: {{ error.message }}
    </div>

    <div v-else-if="!collection" class="state">Collectie wordt geladen…</div>

    <template v-else>
      <header class="cd__header">
        <div class="cd__copy">
          <h1 class="h2">
            {{ collection.title
            }}<span v-if="products.length" class="serif cd__count">
              · {{ products.length }} {{ products.length === 1 ? 'object' : 'objecten' }}</span
            >
          </h1>
          <div
            v-if="collection.descriptionHtml"
            class="cd__lead"
            v-html="collection.descriptionHtml"
          />
          <p v-else-if="collection.description" class="cd__lead">
            {{ collection.description }}
          </p>
        </div>
        <div v-if="collection.image && !heroErrored" class="cd__hero">
          <img
            :src="collection.image.url"
            :alt="collection.image.altText ?? collection.title"
            @error="heroErrored = true"
          />
        </div>
      </header>

      <div v-if="!products.length" class="state">
        Nog geen producten in deze collectie.
      </div>

      <div v-else class="cd__grid">
        <MProductCard v-for="p in products" :key="p.id" :product="p" />
      </div>
    </template>
  </div>
</template>

<style scoped>
.cd {
  padding-top: 32px;
  padding-bottom: var(--spacing-3xl);
}

.cd__crumbs {
  display: flex;
  gap: 8px;
  align-items: center;
  color: var(--color-ink-3);
  padding-bottom: 24px;
}

.cd__crumbs a {
  color: var(--color-ink-2);
}

.cd__crumbs a:hover {
  color: var(--color-ink);
}

.cd__header {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 48px;
  align-items: end;
  padding: 32px 0 48px;
  border-bottom: 1px solid var(--color-line);
  margin-bottom: 48px;
}

.cd__copy {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.cd__count {
  color: var(--color-ink-3);
  font-size: 0.7em;
}

.cd__lead {
  color: var(--color-ink-2);
  max-width: 50ch;
  font-size: 16px;
  line-height: 1.6;
}

.cd__lead :deep(p) {
  margin-bottom: 8px;
}

.cd__hero {
  aspect-ratio: 4 / 3;
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--color-line-2);
}

.cd__hero img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cd__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
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
  .cd__header {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  .cd__grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 720px) {
  .cd__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
