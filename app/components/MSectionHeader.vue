<script setup lang="ts">
defineProps<{
  kicker?: string
  title: string
  serifAccent?: string
  linkTo?: string
  linkLabel?: string
}>()
</script>

<template>
  <div class="sec-head">
    <div v-if="kicker" class="sec-head__kicker">{{ kicker }}</div>
    <h2 class="sec-head__title" :class="{ 'sec-head__title--full': !kicker }">
      {{ title }}<span v-if="serifAccent">&nbsp;<span class="serif">{{ serifAccent }}</span></span>
    </h2>
    <NuxtLink v-if="linkTo && linkLabel" :to="linkTo" class="sec-head__link">
      {{ linkLabel }} <span aria-hidden="true">→</span>
    </NuxtLink>
  </div>
</template>

<style scoped>
.sec-head {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 24px;
  align-items: end;
  padding: var(--spacing-3xl) 0 32px;
  border-top: 1px solid var(--color-line);
}

.sec-head__kicker {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-ink-2);
  padding-bottom: 6px;
}

.sec-head__title {
  font-size: clamp(28px, 3.5vw, 44px);
  line-height: 1;
  letter-spacing: -0.03em;
  font-weight: 500;
  text-wrap: balance;
}

.sec-head__title--full {
  grid-column: 1 / span 2;
}

.sec-head__title .serif {
  color: var(--color-ink-3);
}

.sec-head__link {
  font-size: 14px;
  color: var(--color-ink-2);
  border-bottom: 1px solid var(--color-ink-3);
  padding-bottom: 2px;
  transition:
    color var(--duration-fast) ease,
    border-color var(--duration-fast) ease;
  white-space: nowrap;
}

.sec-head__link:hover {
  color: var(--color-ink);
  border-color: var(--color-ink);
}

@media (max-width: 720px) {
  .sec-head {
    grid-template-columns: 1fr;
    gap: 12px;
    padding-top: var(--spacing-2xl);
  }
  .sec-head__title--full,
  .sec-head__title {
    grid-column: auto;
  }
}
</style>
