<script setup lang="ts">
defineProps<{
  label?: string
  hint?: string
  error?: string
}>()
</script>

<template>
  <label class="field">
    <span v-if="label" class="field__label">{{ label }}</span>
    <slot />
    <span v-if="error" class="field__error">{{ error }}</span>
    <span v-else-if="hint" class="field__hint">{{ hint }}</span>
  </label>
</template>

<style scoped>
.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field__label {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-ink-2);
}

.field__hint {
  font-size: 12px;
  color: var(--color-ink-3);
}

.field__error {
  font-size: 12px;
  color: var(--color-accent);
}

.field :deep(input),
.field :deep(select),
.field :deep(textarea) {
  font: inherit;
  padding: 12px 14px;
  border: 1px solid var(--color-line);
  border-radius: var(--radius-sm);
  background: var(--color-paper);
  color: var(--color-ink);
  width: 100%;
}

.field :deep(input:focus),
.field :deep(select:focus),
.field :deep(textarea:focus) {
  outline: none;
  border-color: var(--color-ink);
}

.field :deep(textarea) {
  min-height: 96px;
  resize: vertical;
}
</style>
