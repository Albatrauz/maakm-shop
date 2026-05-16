<script setup lang="ts">
withDefaults(
  defineProps<{
    cartCount?: number
  }>(),
  { cartCount: 0 },
)

const emit = defineEmits<{
  (e: 'open-search'): void
  (e: 'open-account'): void
  (e: 'open-cart'): void
}>()

const navLinks = [
  { to: '/shop', label: 'Shop' },
  { to: '/collecties', label: 'Collecties' },
  { to: '/maatwerk', label: 'Maatwerk' },
  { to: '/over', label: 'Over' },
]
</script>

<template>
  <header class="topbar">
    <NuxtLink to="/" class="wordmark"
      >MAAKM<span class="wordmark__dot">.</span>shop</NuxtLink
    >

    <nav class="nav">
      <NuxtLink
        v-for="link in navLinks"
        :key="link.to"
        :to="link.to"
        class="nav__link"
        active-class="nav__link--active"
      >
        {{ link.label }}
      </NuxtLink>
    </nav>

    <div class="actions">
      <MBtn variant="icon" size="sm" aria-label="Zoeken" @click="emit('open-search')">
        <MIcon name="search" :size="16" />
      </MBtn>
      <MBtn variant="icon" size="sm" aria-label="Account" @click="emit('open-account')">
        <MIcon name="user" :size="16" />
      </MBtn>
      <button
        class="cart-btn"
        type="button"
        aria-label="Winkelmand"
        @click="emit('open-cart')"
      >
        <MIcon name="cart" :size="16" />
        <span v-if="cartCount > 0" class="cart-btn__badge">{{ cartCount }}</span>
      </button>
    </div>
  </header>
</template>

<style scoped>
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 28px;
  border-bottom: 1px solid var(--color-line);
  position: sticky;
  top: 0;
  background: color-mix(in srgb, var(--color-bg) 86%, transparent);
  z-index: 50;
  backdrop-filter: blur(8px);
}

.wordmark {
  font-weight: 600;
  letter-spacing: -0.02em;
  font-size: 18px;
  color: var(--color-ink);
}
.wordmark__dot {
  color: var(--color-accent);
}

.nav {
  display: flex;
  gap: 28px;
}
.nav__link {
  font-size: 14px;
  color: var(--color-ink-2);
  transition: color var(--duration-fast) ease;
}
.nav__link:hover,
.nav__link--active {
  color: var(--color-ink);
}

.actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.cart-btn {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-pill);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-line);
  background: var(--color-paper);
  color: var(--color-ink);
  position: relative;
  transition: border-color var(--duration-fast) ease;
}
.cart-btn:hover {
  border-color: var(--color-ink);
}

.cart-btn__badge {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: var(--radius-pill);
  background: var(--color-accent);
  color: #fff;
  font-size: 10px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 720px) {
  .nav {
    display: none;
  }
}
</style>
