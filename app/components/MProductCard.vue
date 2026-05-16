<script setup lang="ts">
import {
  type ProductCardData,
  badgeFromTags,
  badgeLabel,
  colorHex,
  formatPrice,
  materialFromTags,
} from '~/utils/product'

const props = defineProps<{
  product: ProductCardData
  to?: string
}>()

const imgErrored = ref(false)

const material = computed(() => materialFromTags(props.product.tags))
const badge = computed(() => {
  const value = badgeFromTags(props.product.tags)
  return value ? badgeLabel(value) : undefined
})

const visibleColors = computed(() => props.product.colors.slice(0, 5))
const overflowColors = computed(() => Math.max(0, props.product.colors.length - 5))

const href = computed(() => props.to ?? `/products/${props.product.handle}`)
const priceLabel = computed(() => formatPrice(props.product.price, props.product.currency))
</script>

<template>
  <NuxtLink :to="href" class="card">
    <div class="card__img">
      <img
        v-if="product.imageUrl && !imgErrored"
        :src="product.imageUrl"
        :alt="product.imageAlt ?? product.title"
        loading="lazy"
        @error="imgErrored = true"
      />
      <div v-else class="card__placeholder" aria-hidden="true">
        <span class="card__placeholder-label mono">{{ product.title }}</span>
      </div>
    </div>

    <div class="card__meta">
      <div class="card__primary">
        <div class="card__title">{{ product.title }}</div>
        <div v-if="product.sub" class="card__sub">{{ product.sub }}</div>
        <div v-if="badge || material" class="card__tags">
          <MTag v-if="badge">{{ badge }}</MTag>
          <MTag v-if="material">{{ material }}</MTag>
        </div>
      </div>
      <div class="card__price">{{ priceLabel }}</div>
    </div>

    <div v-if="visibleColors.length" class="card__colors">
      <span
        v-for="color in visibleColors"
        :key="color"
        class="card__swatch"
        :style="{ background: colorHex(color) }"
        :title="color"
      />
      <span v-if="overflowColors > 0" class="card__swatch-more mono"
        >+{{ overflowColors }}</span
      >
    </div>
  </NuxtLink>
</template>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  color: inherit;
  cursor: pointer;
}

.card__img {
  aspect-ratio: 4 / 5;
  border-radius: var(--radius-sm);
  overflow: hidden;
  background: var(--color-line-2);
}

.card__img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--duration-slow) ease;
}

.card:hover .card__img img {
  transform: scale(1.005);
}

.card__placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  padding: 14px;
  background:
    repeating-linear-gradient(45deg, rgba(0, 0, 0, 0.03) 0 2px, transparent 2px 14px),
    linear-gradient(135deg, #e8e3d6, #ddd6c5);
  color: var(--color-ink-2);
}

.card__placeholder-label {
  background: rgba(255, 255, 255, 0.7);
  padding: 4px 10px;
  border-radius: var(--radius-pill);
  font-size: 10px;
  letter-spacing: 0.1em;
}

.card__meta {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: flex-start;
}

.card__primary {
  min-width: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.card__title {
  font-size: 16px;
  font-weight: 500;
  letter-spacing: -0.01em;
  line-height: 1.3;
}

.card__sub {
  font-size: 13px;
  color: var(--color-ink-3);
  line-height: 1.3;
}

.card__tags {
  display: flex;
  gap: 6px;
  margin-top: 6px;
  flex-wrap: wrap;
}

.card__price {
  font-size: 15px;
  font-weight: 500;
  white-space: nowrap;
}

.card__colors {
  display: flex;
  gap: 6px;
  align-items: center;
}

.card__swatch {
  width: 14px;
  height: 14px;
  border-radius: 999px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  display: inline-block;
}

.card__swatch-more {
  font-size: 10px;
  color: var(--color-ink-3);
  letter-spacing: 0.04em;
}
</style>
