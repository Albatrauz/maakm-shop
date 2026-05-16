<script setup lang="ts">
type Variant = 'primary' | 'accent' | 'ghost' | 'icon'
type Size = 'md' | 'lg' | 'sm'

withDefaults(
  defineProps<{
    variant?: Variant
    size?: Size
    full?: boolean
    loading?: boolean
    type?: 'button' | 'submit' | 'reset'
  }>(),
  { variant: 'primary', size: 'md', type: 'button' },
)
</script>

<template>
  <button
    :type="type"
    :class="['btn', `btn--${variant}`, `btn--${size}`, { 'btn--full': full, 'is-loading': loading }]"
    :disabled="loading"
  >
    <slot />
  </button>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px 22px;
  border-radius: var(--radius-pill);
  border: 1px solid var(--color-ink);
  background: var(--color-ink);
  color: var(--color-bg);
  font-family: inherit;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  transition:
    transform var(--duration-fast) ease,
    background var(--duration-fast) ease,
    color var(--duration-fast) ease,
    border-color var(--duration-fast) ease;
}

.btn:hover:not(:disabled) {
  transform: translateY(-1px);
}

.btn--ghost {
  background: transparent;
  color: var(--color-ink);
}
.btn--ghost:hover:not(:disabled) {
  background: var(--color-ink);
  color: var(--color-bg);
}

.btn--accent {
  background: var(--color-accent);
  border-color: var(--color-accent);
  color: #fff;
}
.btn--accent:hover:not(:disabled) {
  background: var(--color-accent-hover);
  border-color: var(--color-accent-hover);
}

.btn--icon {
  width: 40px;
  height: 40px;
  padding: 0;
  background: var(--color-paper);
  color: var(--color-ink);
  border-color: var(--color-line);
}
.btn--icon:hover:not(:disabled) {
  border-color: var(--color-ink);
  transform: none;
}
.btn--icon.btn--sm {
  width: 36px;
  height: 36px;
}

.btn--lg {
  padding: 18px 28px;
  font-size: 15px;
}

.btn--full {
  width: 100%;
}

.is-loading {
  opacity: 0.6;
  pointer-events: none;
  cursor: wait;
}
</style>
