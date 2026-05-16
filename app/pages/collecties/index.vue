<script setup lang="ts">
import {
  COLLECTIONS_QUERY,
  type ShopifyCollectionsResponse,
} from '~/utils/shopify'

const { shopifyFetch } = useShopify()

const { data, error } = await useAsyncData('collections-index', async () => {
  const res = await shopifyFetch<ShopifyCollectionsResponse>(COLLECTIONS_QUERY, {
    first: 24,
  })
  return res.collections.edges.map((e) => e.node)
})

const collections = computed(() => data.value ?? [])

const erroredImages = ref<Set<string>>(new Set())
function onImageError(id: string) {
  erroredImages.value = new Set([...erroredImages.value, id])
}
</script>

<template>
  <div class="collecties shell">
    <header class="collecties__header">
      <h1 class="h2">
        Collecties<span class="serif collecties__accent"> — gecureerd per gebruik.</span>
      </h1>
      <p class="collecties__lead">
        Selecties uit de catalogus, samengesteld rond een vorm of een ruimte. Bedoeld
        als startpunt — bij een briefing maken we ook nieuwe.
      </p>
    </header>

    <div v-if="error" class="state state--error">
      Fout bij ophalen collecties: {{ error.message }}
    </div>

    <div v-else-if="!collections.length" class="state">
      Nog geen collecties beschikbaar.
    </div>

    <div v-else class="collecties__grid">
      <NuxtLink
        v-for="c in collections"
        :key="c.id"
        :to="`/collecties/${c.handle}`"
        class="tile"
      >
        <div class="tile__img">
          <img
            v-if="c.image && !erroredImages.has(c.id)"
            :src="c.image.url"
            :alt="c.image.altText ?? c.title"
            loading="lazy"
            @error="onImageError(c.id)"
          />
          <div v-else class="tile__placeholder" aria-hidden="true" />
        </div>
        <div class="tile__meta">
          <h3 class="h3 tile__title">{{ c.title }}</h3>
          <p v-if="c.description" class="tile__sub">{{ c.description }}</p>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.collecties {
  padding-top: var(--spacing-3xl);
  padding-bottom: var(--spacing-3xl);
}

.collecties__header {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-bottom: 40px;
  border-bottom: 1px solid var(--color-line);
  margin-bottom: 48px;
}

.collecties__accent {
  color: var(--color-ink-3);
}

.collecties__lead {
  color: var(--color-ink-2);
  max-width: 50ch;
}

.collecties__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px 24px;
}

.tile {
  display: flex;
  flex-direction: column;
  gap: 14px;
  color: inherit;
}

.tile__img {
  aspect-ratio: 4 / 3;
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--color-line-2);
}

.tile__img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--duration-slow) ease;
}

.tile:hover .tile__img img {
  transform: scale(1.005);
}

.tile__placeholder {
  width: 100%;
  height: 100%;
  background:
    repeating-linear-gradient(45deg, rgba(0, 0, 0, 0.03) 0 2px, transparent 2px 14px),
    linear-gradient(135deg, #e8e3d6, #ddd6c5);
}

.tile__meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.tile__title {
  letter-spacing: -0.02em;
}

.tile__sub {
  color: var(--color-ink-2);
  font-size: 14px;
  line-height: 1.5;
  max-width: 42ch;
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
  .collecties__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .collecties__grid {
    grid-template-columns: 1fr;
  }
}
</style>
