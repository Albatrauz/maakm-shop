<template>
  <span class="tag"><slot /></span>
</template>

<style scoped>
.tag {
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--color-ink-2);
  padding: 3px 7px;
  border: 1px solid var(--color-line);
  border-radius: var(--radius-xs);
  background: var(--color-paper);
  display: inline-block;
  line-height: 1.4;
}
</style>
