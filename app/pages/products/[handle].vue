<script setup lang="ts">
import {
  PRODUCTS_QUERY,
  PRODUCT_BY_HANDLE_QUERY,
  type ShopifyProductResponse,
  type ShopifyProductsResponse,
  imagesFromNode,
  toProductCardData,
  variantsFromNode,
} from '~/utils/shopify'
import {
  badgeFromTags,
  badgeLabel,
  colorHex,
  formatPrice,
  materialFromTags,
  PRODUCT_COLORS,
} from '~/utils/product'

const route = useRoute()
const handle = computed(() => String(route.params.handle))

const { shopifyFetch } = useShopify()

const { data: productData, error } = await useAsyncData(
  () => `product-${handle.value}`,
  async () => {
    const res = await shopifyFetch<ShopifyProductResponse>(PRODUCT_BY_HANDLE_QUERY, {
      handle: handle.value,
    })
    return res.product
  },
)

const product = computed(() => productData.value)

const images = computed(() => (product.value ? imagesFromNode(product.value) : []))
const variants = computed(() => (product.value ? variantsFromNode(product.value) : []))
const options = computed(() => product.value?.options ?? [])

const selectedOptions = ref<Record<string, string>>({})
watchEffect(() => {
  // initialise from the first variant once data lands
  const first = variants.value[0]
  if (!first) return
  if (Object.keys(selectedOptions.value).length) return
  selectedOptions.value = Object.fromEntries(
    first.selectedOptions.map((o) => [o.name, o.value]),
  )
})

const selectedVariant = computed(() => {
  return variants.value.find((v) =>
    v.selectedOptions.every((o) => selectedOptions.value[o.name] === o.value),
  )
})

const activeImage = ref(0)
const erroredImages = ref<Set<string>>(new Set())
function onImageError(url: string) {
  erroredImages.value = new Set([...erroredImages.value, url])
}
watchEffect(() => {
  // when the selected variant has its own image, switch to it
  const img = selectedVariant.value?.image
  if (!img) return
  const idx = images.value.findIndex((i) => i.url === img.url)
  if (idx >= 0) activeImage.value = idx
})

function isColorOption(name: string) {
  return name === 'Kleur' || name === 'Color' || name === 'Colour'
}

const COLOR_FALLBACK = '#d9c9a8'
function swatchHex(value: string) {
  return PRODUCT_COLORS[value]?.hex ?? COLOR_FALLBACK
}

const qty = ref(1)
function inc() {
  qty.value = Math.min(qty.value + 1, 20)
}
function dec() {
  qty.value = Math.max(qty.value - 1, 1)
}

const material = computed(() =>
  product.value?.tags ? materialFromTags(product.value.tags) : undefined,
)
const badge = computed(() => {
  if (!product.value?.tags) return undefined
  const v = badgeFromTags(product.value.tags)
  return v ? badgeLabel(v) : undefined
})

const priceLabel = computed(() => {
  const v = selectedVariant.value
  if (v) return formatPrice(Number(v.price.amount), v.price.currencyCode)
  const min = product.value?.priceRange.minVariantPrice
  return min ? formatPrice(Number(min.amount), min.currencyCode) : ''
})

const inStock = computed(() => selectedVariant.value?.availableForSale ?? true)

type TabKey = 'details' | 'specs' | 'shipping'
const activeTab = ref<TabKey>('details')
const tabs: { key: TabKey; label: string }[] = [
  { key: 'details', label: 'Details' },
  { key: 'specs', label: 'Specificaties' },
  { key: 'shipping', label: 'Verzending' },
]

const { data: relatedData } = await useAsyncData(
  () => `related-${handle.value}`,
  async () => {
    const productType = product.value?.productType
    const res = await shopifyFetch<ShopifyProductsResponse>(PRODUCTS_QUERY, {
      first: 8,
      query: productType ? `product_type:'${productType}'` : null,
    })
    return res.products.edges
      .map((e) => toProductCardData(e.node))
      .filter((p) => p.handle !== handle.value)
      .slice(0, 4)
  },
  { watch: [product] },
)

const related = computed(() => relatedData.value ?? [])

const cart = useCart()
const toast = useToast()

async function addToCart() {
  const variantId = selectedVariant.value?.id
  if (!variantId) {
    toast.error('Kies eerst een variant.')
    return
  }
  const ok = await cart.addLine(variantId, qty.value)
  if (ok) {
    toast.success(
      qty.value === 1
        ? `${product.value?.title} toegevoegd.`
        : `${qty.value}× ${product.value?.title} toegevoegd.`,
    )
  } else {
    toast.error(cart.lastError.value ?? 'Toevoegen mislukt.')
  }
}
</script>

<template>
  <div class="pdp shell">
    <nav class="pdp__crumbs mono">
      <NuxtLink to="/shop">Shop</NuxtLink>
      <span>›</span>
      <span>{{ product?.title ?? '…' }}</span>
    </nav>

    <div v-if="error" class="state state--error">
      Product niet gevonden: {{ error.message }}
    </div>

    <div v-else-if="!product" class="state">Product wordt geladen…</div>

    <article v-else class="pdp__main">
      <section class="pdp__gallery">
        <div class="pdp__hero">
          <img
            v-if="images[activeImage] && !erroredImages.has(images[activeImage].url)"
            :src="images[activeImage]?.url"
            :alt="images[activeImage]?.altText ?? product.title"
            @error="onImageError(images[activeImage]!.url)"
          />
          <div v-else class="pdp__hero-placeholder" aria-hidden="true" />
        </div>
        <div v-if="images.length > 1" class="pdp__thumbs">
          <button
            v-for="(img, i) in images"
            :key="img.url"
            type="button"
            class="pdp__thumb"
            :class="{ 'pdp__thumb--active': activeImage === i }"
            @click="activeImage = i"
          >
            <img :src="img.url" :alt="img.altText ?? `${product.title} ${i + 1}`" />
          </button>
        </div>
      </section>

      <section class="pdp__info">
        <div class="pdp__heads">
          <div v-if="badge || material" class="pdp__chips">
            <MChip v-if="badge">{{ badge }}</MChip>
            <MChip v-if="material">{{ material }}</MChip>
          </div>
          <h1 class="h2 pdp__title">{{ product.title }}</h1>
          <div v-if="product.productType" class="pdp__sub">{{ product.productType }}</div>
          <div class="pdp__price">{{ priceLabel }}</div>
        </div>

        <div v-for="opt in options" :key="opt.name" class="pdp__option">
          <div class="kicker pdp__option-label">{{ opt.name }}</div>

          <div v-if="isColorOption(opt.name)" class="pdp__colors">
            <button
              v-for="value in opt.values"
              :key="value"
              type="button"
              class="pdp__color"
              :class="{ 'pdp__color--on': selectedOptions[opt.name] === value }"
              :title="value"
              :aria-label="value"
              :style="{ background: swatchHex(value) }"
              @click="selectedOptions[opt.name] = value"
            />
          </div>

          <div v-else class="pdp__pills">
            <button
              v-for="value in opt.values"
              :key="value"
              type="button"
              class="pdp__pill"
              :class="{ 'pdp__pill--on': selectedOptions[opt.name] === value }"
              @click="selectedOptions[opt.name] = value"
            >
              {{ value }}
            </button>
          </div>
        </div>

        <div class="pdp__buy">
          <div class="pdp__qty" role="group" aria-label="Aantal">
            <button type="button" aria-label="Verlaag" @click="dec">
              <MIcon name="minus" :size="14" />
            </button>
            <span>{{ qty }}</span>
            <button type="button" aria-label="Verhoog" @click="inc">
              <MIcon name="plus" :size="14" />
            </button>
          </div>
          <MBtn
            variant="accent"
            size="lg"
            full
            :loading="cart.loading.value || !inStock"
            @click="addToCart"
          >
            <MIcon name="cart" :size="16" />
            {{
              cart.loading.value
                ? 'Toevoegen…'
                : inStock
                  ? 'In winkelmand'
                  : 'Uitverkocht'
            }}
          </MBtn>
        </div>

        <ul class="pdp__trust">
          <li><MIcon name="truck" :size="16" /> Levertijd 3–5 dagen · NL</li>
          <li><MIcon name="leaf" :size="16" /> Op bestelling — geen voorraad, geen verspilling</li>
          <li><MIcon name="shield" :size="16" /> 30 dagen retour</li>
        </ul>
      </section>
    </article>

    <section v-if="product" class="pdp__tabs">
      <nav class="pdp__tabs-nav">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          type="button"
          class="pdp__tab"
          :class="{ 'pdp__tab--active': activeTab === tab.key }"
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
        </button>
      </nav>

      <div class="pdp__tab-body">
        <div v-if="activeTab === 'details'" class="pdp__prose">
          <div v-if="product.descriptionHtml" v-html="product.descriptionHtml" />
          <p v-else-if="product.description">{{ product.description }}</p>
          <p v-else class="muted">Geen omschrijving beschikbaar.</p>
        </div>

        <dl v-else-if="activeTab === 'specs'" class="pdp__specs">
          <div v-if="material">
            <dt class="kicker">Materiaal</dt>
            <dd>{{ material }}</dd>
          </div>
          <div v-for="opt in options" :key="opt.name">
            <dt class="kicker">{{ opt.name }}</dt>
            <dd>{{ opt.values.join(' · ') }}</dd>
          </div>
          <div v-if="product.productType">
            <dt class="kicker">Type</dt>
            <dd>{{ product.productType }}</dd>
          </div>
        </dl>

        <div v-else class="pdp__prose">
          <p>
            Elk object wordt op bestelling geprint in onze studio in Raamsdonksveer.
            Verwachte levertijd is <strong>3–5 werkdagen</strong>. Gratis verzending
            binnen Nederland vanaf €50; daaronder rekenen we €4,95.
          </p>
          <p>
            Niet wat je had verwacht? Stuur het binnen 30 dagen retour — we
            recyclen waar mogelijk en geven het materiaal een tweede leven.
          </p>
        </div>
      </div>
    </section>

    <section v-if="related.length" class="pdp__related">
      <MSectionHeader
        title="Vergelijkbaar"
        link-to="/shop"
        link-label="Bekijk alles"
      />
      <div class="pdp__related-grid">
        <MProductCard v-for="p in related" :key="p.id" :product="p" />
      </div>
    </section>

    <div v-if="product" class="pdp-stick" role="complementary">
      <div class="pdp-stick__info">
        <div class="pdp-stick__title">{{ product.title }}</div>
        <div class="pdp-stick__price">{{ priceLabel }}</div>
      </div>
      <MBtn
        variant="accent"
        :loading="cart.loading.value || !inStock"
        @click="addToCart"
      >
        <MIcon name="cart" :size="14" />
        {{ inStock ? 'In winkelmand' : 'Uitverkocht' }}
      </MBtn>
    </div>
  </div>
</template>

<style scoped>
.pdp {
  padding-top: 32px;
  padding-bottom: var(--spacing-3xl);
}

.muted {
  color: var(--color-ink-3);
}

.pdp__crumbs {
  display: flex;
  gap: 8px;
  align-items: center;
  color: var(--color-ink-3);
  padding-bottom: 24px;
}

.pdp__crumbs a {
  color: var(--color-ink-2);
}
.pdp__crumbs a:hover {
  color: var(--color-ink);
}

.pdp__main {
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: 48px;
  align-items: start;
}

.pdp__gallery {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.pdp__hero {
  aspect-ratio: 4 / 5;
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--color-line-2);
}

.pdp__hero img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.pdp__hero-placeholder {
  width: 100%;
  height: 100%;
  background:
    repeating-linear-gradient(45deg, rgba(0, 0, 0, 0.03) 0 2px, transparent 2px 14px),
    linear-gradient(135deg, #e8e3d6, #ddd6c5);
}

.pdp__thumbs {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.pdp__thumb {
  aspect-ratio: 1;
  border-radius: var(--radius-sm);
  overflow: hidden;
  border: 1px solid var(--color-line);
  padding: 0;
  background: var(--color-paper);
  cursor: pointer;
  transition: border-color var(--duration-fast) ease;
}

.pdp__thumb:hover {
  border-color: var(--color-ink);
}

.pdp__thumb--active {
  border-color: var(--color-ink);
}

.pdp__thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.pdp__info {
  position: sticky;
  top: 96px;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.pdp__heads {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.pdp__chips {
  display: flex;
  gap: 8px;
}

.pdp__title {
  margin-top: 4px;
}

.pdp__sub {
  color: var(--color-ink-3);
  font-size: 14px;
}

.pdp__price {
  font-size: 22px;
  font-weight: 500;
  letter-spacing: -0.02em;
  margin-top: 6px;
  color: var(--color-accent);
}

.pdp__option {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.pdp__option-label {
  color: var(--color-ink-2);
}

.pdp__colors {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.pdp__color {
  width: 28px;
  height: 28px;
  border-radius: 999px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  cursor: pointer;
  padding: 0;
  outline-offset: 3px;
  transition: outline var(--duration-fast) ease;
}

.pdp__color--on {
  outline: 1px solid var(--color-ink);
}

.pdp__pills {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.pdp__pill {
  font: inherit;
  font-size: 13px;
  padding: 8px 14px;
  border-radius: var(--radius-pill);
  border: 1px solid var(--color-line);
  background: var(--color-paper);
  color: var(--color-ink-2);
  cursor: pointer;
  transition:
    border-color var(--duration-fast) ease,
    color var(--duration-fast) ease;
}

.pdp__pill:hover {
  border-color: var(--color-ink);
  color: var(--color-ink);
}

.pdp__pill--on {
  background: var(--color-ink);
  border-color: var(--color-ink);
  color: var(--color-bg);
}

.pdp__buy {
  display: flex;
  gap: 12px;
  align-items: stretch;
}

.pdp__qty {
  display: inline-flex;
  align-items: center;
  border: 1px solid var(--color-line);
  border-radius: var(--radius-pill);
  background: var(--color-paper);
}

.pdp__qty button {
  width: 40px;
  height: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--color-ink-2);
  cursor: pointer;
}

.pdp__qty span {
  min-width: 26px;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
}

.pdp__trust {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 18px 0 0;
  border-top: 1px solid var(--color-line);
  color: var(--color-ink-2);
  font-size: 13px;
}

.pdp__trust li {
  display: flex;
  gap: 10px;
  align-items: center;
}

.pdp__tabs {
  margin-top: var(--spacing-3xl);
  border-top: 1px solid var(--color-line);
  padding-top: 32px;
}

.pdp__tabs-nav {
  display: flex;
  gap: 4px;
}

.pdp__tab {
  font: inherit;
  padding: 10px 16px;
  border-radius: var(--radius-pill);
  font-size: 13px;
  color: var(--color-ink-3);
  cursor: pointer;
  transition: color var(--duration-fast) ease, background var(--duration-fast) ease;
}

.pdp__tab:hover {
  color: var(--color-ink);
}

.pdp__tab--active {
  background: var(--color-paper);
  border: 1px solid var(--color-line);
  color: var(--color-ink);
}

.pdp__tab-body {
  padding-top: 24px;
  max-width: 640px;
}

.pdp__prose {
  color: var(--color-ink-2);
  font-size: 15px;
  line-height: 1.65;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.pdp__prose :deep(p) {
  margin-bottom: 12px;
}

.pdp__specs {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 12px 24px;
  font-size: 14px;
  color: var(--color-ink-2);
}

.pdp__specs > div {
  display: contents;
}

.pdp__specs dt {
  padding-top: 4px;
}

.pdp__specs dd {
  border-bottom: 1px solid var(--color-line-2);
  padding-bottom: 10px;
}

.pdp__related {
  margin-top: var(--spacing-3xl);
}

.pdp__related-grid {
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
  .pdp__main {
    grid-template-columns: 1fr;
  }
  .pdp__info {
    position: static;
  }
  .pdp__related-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 720px) {
  .pdp__specs {
    grid-template-columns: 1fr;
  }
}

.pdp-stick {
  display: none;
}

@media (max-width: 1024px) {
  .pdp-stick {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 60;
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 20px calc(14px + env(safe-area-inset-bottom));
    background: color-mix(in srgb, var(--color-bg) 92%, transparent);
    border-top: 1px solid var(--color-line);
    backdrop-filter: blur(10px);
  }
  .pdp-stick__info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .pdp-stick__title {
    font-size: 13px;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .pdp-stick__price {
    font-size: 12px;
    color: var(--color-accent);
    font-weight: 500;
  }
  .pdp {
    padding-bottom: calc(var(--spacing-3xl) + 88px);
  }
}
</style>
