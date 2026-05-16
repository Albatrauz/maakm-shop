<script setup lang="ts">
withDefaults(
  defineProps<{
    items: string[]
    duration?: number
  }>(),
  { duration: 40 },
)
</script>

<template>
  <div class="strip">
    <div class="strip__track" :style="{ animationDuration: `${duration}s` }">
      <span v-for="(item, i) in items" :key="`a-${i}`" class="strip__item">{{ item }}</span>
      <span v-for="(item, i) in items" :key="`b-${i}`" class="strip__item" aria-hidden="true">{{
        item
      }}</span>
    </div>
  </div>
</template>

<style scoped>
.strip {
  border-top: 1px solid var(--color-line);
  border-bottom: 1px solid var(--color-line);
  padding: 14px 0;
  overflow: hidden;
  background: var(--color-bg);
}

.strip__track {
  display: flex;
  gap: 56px;
  animation-name: slide;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  white-space: nowrap;
  width: max-content;
}

.strip__item {
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-ink-2);
}

@keyframes slide {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .strip__track {
    animation: none;
  }
}
</style>
