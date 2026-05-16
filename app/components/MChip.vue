<script setup lang="ts">
defineProps<{
  dotColor?: string
}>()
</script>

<template>
  <span class="chip">
    <span v-if="dotColor" class="chip__dot" :style="{ background: dotColor }" />
    <slot />
  </span>
</template>

<style scoped>
.chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  border: 1px solid var(--color-line);
  border-radius: var(--radius-pill);
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  background: var(--color-paper);
  color: var(--color-ink-2);
}

.chip__dot {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  display: inline-block;
}
</style>
