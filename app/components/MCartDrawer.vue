<script setup lang="ts">
import { formatPrice } from '~/utils/product'
import { FREE_SHIPPING_THRESHOLD } from '~/composables/useCart'

const cart = useCart()

const lineImageErrors = ref<Set<string>>(new Set())
function onLineImageError(id: string) {
  lineImageErrors.value = new Set([...lineImageErrors.value, id])
}

function selectedOptionsLabel(line: { merchandise: { selectedOptions: { name: string; value: string }[] } }) {
  return line.merchandise.selectedOptions
    .filter((o) => o.name !== 'Title')
    .map((o) => `${o.name}: ${o.value}`)
    .join(' · ')
}

const subtotalLabel = computed(() => formatPrice(cart.subtotal.value, cart.currency.value))
const freeShippingLabel = computed(() => formatPrice(cart.freeShippingRemaining.value, cart.currency.value))

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape' && cart.drawerOpen.value) cart.closeDrawer()
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  document.body.style.removeProperty('overflow')
})

watch(
  () => cart.drawerOpen.value,
  (open) => {
    if (!import.meta.client) return
    document.body.style.overflow = open ? 'hidden' : ''
  },
)
</script>

<template>
  <Teleport to="body">
    <div
      class="overlay"
      :class="{ 'overlay--open': cart.drawerOpen.value }"
      @click="cart.closeDrawer"
    />
    <aside
      class="drawer"
      :class="{ 'drawer--open': cart.drawerOpen.value }"
      role="dialog"
      aria-label="Winkelmand"
    >
      <header class="drawer__head">
        <h3>Winkelmand <span class="drawer__count mono" v-if="cart.totalQuantity.value">· {{ cart.totalQuantity.value }}</span></h3>
        <button class="drawer__close" type="button" aria-label="Sluiten" @click="cart.closeDrawer">
          <MIcon name="x" :size="18" />
        </button>
      </header>

      <div class="drawer__body">
        <div v-if="cart.lines.value.length === 0" class="drawer__empty">
          <div class="kicker drawer__empty-kicker">Leeg</div>
          <h4 class="h3">Je winkelmand is leeg.</h4>
          <p>Bekijk de catalogus — alles wordt op bestelling geprint in Raamsdonksveer.</p>
          <NuxtLink to="/shop" @click="cart.closeDrawer"
            ><MBtn>Bekijk shop</MBtn></NuxtLink
          >
        </div>

        <ul v-else class="drawer__lines">
          <li v-for="line in cart.lines.value" :key="line.id" class="line">
            <NuxtLink
              :to="`/products/${line.merchandise.product.handle}`"
              class="line__img"
              @click="cart.closeDrawer"
            >
              <img
                v-if="(line.merchandise.image?.url || line.merchandise.product.featuredImage?.url) && !lineImageErrors.has(line.id)"
                :src="line.merchandise.image?.url ?? line.merchandise.product.featuredImage!.url"
                :alt="line.merchandise.product.title"
                @error="onLineImageError(line.id)"
              />
              <div v-else class="line__placeholder" aria-hidden="true" />
            </NuxtLink>

            <div class="line__meta">
              <NuxtLink
                :to="`/products/${line.merchandise.product.handle}`"
                class="line__title"
                @click="cart.closeDrawer"
                >{{ line.merchandise.product.title }}</NuxtLink
              >
              <div v-if="selectedOptionsLabel(line)" class="line__opts">
                {{ selectedOptionsLabel(line) }}
              </div>

              <div class="line__controls">
                <div class="qty" role="group" aria-label="Aantal">
                  <button
                    type="button"
                    aria-label="Verlaag"
                    :disabled="cart.loading.value"
                    @click="cart.updateLine(line.id, line.quantity - 1)"
                  >
                    <MIcon name="minus" :size="12" />
                  </button>
                  <span>{{ line.quantity }}</span>
                  <button
                    type="button"
                    aria-label="Verhoog"
                    :disabled="cart.loading.value"
                    @click="cart.updateLine(line.id, line.quantity + 1)"
                  >
                    <MIcon name="plus" :size="12" />
                  </button>
                </div>
                <button
                  class="line__remove"
                  type="button"
                  :disabled="cart.loading.value"
                  @click="cart.removeLine(line.id)"
                >
                  Verwijder
                </button>
              </div>
            </div>

            <div class="line__price">
              {{ formatPrice(Number(line.cost.totalAmount.amount), line.cost.totalAmount.currencyCode) }}
            </div>
          </li>
        </ul>
      </div>

      <footer v-if="cart.lines.value.length" class="drawer__foot">
        <div class="ship">
          <div class="ship__bar">
            <div class="ship__fill" :style="{ width: `${cart.freeShippingProgress.value * 100}%` }" />
          </div>
          <div class="ship__label">
            <template v-if="cart.freeShippingRemaining.value > 0">
              Nog <strong>{{ freeShippingLabel }}</strong> tot gratis verzending.
            </template>
            <template v-else>
              <strong>Gratis verzending</strong> ontgrendeld.
            </template>
          </div>
        </div>

        <div class="totals">
          <span class="mono">Subtotaal</span>
          <span class="totals__value">{{ subtotalLabel }}</span>
        </div>

        <div v-if="cart.lastError.value" class="drawer__error">{{ cart.lastError.value }}</div>

        <a v-if="cart.checkoutUrl.value" :href="cart.checkoutUrl.value">
          <MBtn variant="accent" size="lg" full :loading="cart.loading.value">
            Naar afrekenen
            <MIcon name="arrow-right" :size="16" />
          </MBtn>
        </a>

        <p class="drawer__note">
          Verzending en kortingen worden in de checkout berekend.
        </p>
      </footer>
    </aside>
  </Teleport>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(20, 20, 18, 0.4);
  z-index: 100;
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--duration-base) ease;
}

.overlay--open {
  opacity: 1;
  pointer-events: auto;
}

.drawer {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 460px;
  max-width: 100vw;
  background: var(--color-bg);
  z-index: 101;
  transform: translateX(100%);
  transition: transform var(--duration-slow) var(--ease-maakm);
  display: flex;
  flex-direction: column;
}

.drawer--open {
  transform: translateX(0);
}

.drawer__head {
  padding: 22px 24px;
  border-bottom: 1px solid var(--color-line);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.drawer__head h3 {
  font-size: 18px;
  font-weight: 500;
  letter-spacing: -0.01em;
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.drawer__count {
  color: var(--color-ink-3);
  font-size: 11px;
}

.drawer__close {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-pill);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--color-ink-2);
  transition: color var(--duration-fast) ease, background var(--duration-fast) ease;
}

.drawer__close:hover {
  background: var(--color-line-2);
  color: var(--color-ink);
}

.drawer__body {
  flex: 1;
  overflow-y: auto;
}

.drawer__body::-webkit-scrollbar {
  width: 6px;
}
.drawer__body::-webkit-scrollbar-thumb {
  background: var(--color-line);
  border-radius: 999px;
}

.drawer__empty {
  padding: 56px 32px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  align-items: flex-start;
}

.drawer__empty-kicker {
  color: var(--color-ink-3);
}

.drawer__empty p {
  color: var(--color-ink-2);
  font-size: 14px;
  line-height: 1.55;
  max-width: 36ch;
}

.drawer__empty a {
  text-decoration: none;
}

.drawer__lines {
  list-style: none;
  padding: 0;
  margin: 0;
}

.line {
  display: grid;
  grid-template-columns: 80px 1fr auto;
  gap: 16px;
  padding: 18px 24px;
  border-bottom: 1px solid var(--color-line-2);
  align-items: start;
}

.line__img {
  aspect-ratio: 1;
  border-radius: var(--radius-xs);
  overflow: hidden;
  background: var(--color-line-2);
}

.line__img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.line__placeholder {
  width: 100%;
  height: 100%;
  background:
    repeating-linear-gradient(45deg, rgba(0, 0, 0, 0.03) 0 2px, transparent 2px 14px),
    linear-gradient(135deg, #e8e3d6, #ddd6c5);
}

.line__meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.line__title {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-ink);
  line-height: 1.35;
}

.line__title:hover {
  color: var(--color-accent);
}

.line__opts {
  font-size: 12px;
  color: var(--color-ink-3);
}

.line__controls {
  display: flex;
  gap: 14px;
  align-items: center;
  margin-top: 10px;
}

.qty {
  display: inline-flex;
  align-items: center;
  border: 1px solid var(--color-line);
  border-radius: var(--radius-pill);
  background: var(--color-paper);
}

.qty button {
  width: 26px;
  height: 26px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--color-ink-2);
  cursor: pointer;
}

.qty button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.qty span {
  min-width: 22px;
  text-align: center;
  font-size: 13px;
}

.line__remove {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-ink-3);
  background: none;
  padding: 0;
  cursor: pointer;
}

.line__remove:hover {
  color: var(--color-accent);
}

.line__remove:disabled {
  cursor: wait;
  opacity: 0.5;
}

.line__price {
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
}

.drawer__foot {
  border-top: 1px solid var(--color-line);
  padding: 20px 24px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: var(--color-bg);
}

.ship {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ship__bar {
  height: 4px;
  background: var(--color-line-2);
  border-radius: 999px;
  overflow: hidden;
}

.ship__fill {
  height: 100%;
  background: var(--color-accent);
  transition: width var(--duration-base) ease;
}

.ship__label {
  font-size: 12px;
  color: var(--color-ink-2);
}

.totals {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.totals__value {
  font-size: 18px;
  font-weight: 500;
  letter-spacing: -0.01em;
}

.drawer__error {
  font-size: 12px;
  color: var(--color-accent);
  padding: 8px 12px;
  background: rgba(214, 90, 49, 0.08);
  border-radius: var(--radius-sm);
}

.drawer__foot a {
  text-decoration: none;
}

.drawer__note {
  font-size: 11px;
  color: var(--color-ink-3);
  text-align: center;
}
</style>
