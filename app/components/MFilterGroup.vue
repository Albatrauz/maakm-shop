<script setup lang="ts" generic="T extends string">
type Option = { id: T; label: string; count?: number }

defineProps<{
  title: string
  options: Option[]
}>()

const selected = defineModel<T[]>({ required: true })

function toggle(id: T) {
  const set = new Set(selected.value)
  if (set.has(id)) set.delete(id)
  else set.add(id)
  selected.value = [...set]
}

function isOn(id: T) {
  return selected.value.includes(id)
}
</script>

<template>
  <fieldset class="filter">
    <legend class="filter__title">{{ title }}</legend>
    <ul class="filter__list">
      <li v-for="option in options" :key="option.id">
        <button
          type="button"
          class="filter__row"
          :aria-pressed="isOn(option.id)"
          @click="toggle(option.id)"
        >
          <span class="filter__label">
            <span class="filter__cb" :class="{ 'filter__cb--on': isOn(option.id) }">
              <MIcon v-if="isOn(option.id)" name="check" :size="10" />
            </span>
            <span>{{ option.label }}</span>
          </span>
          <span v-if="typeof option.count === 'number'" class="filter__count"
            >{{ option.count }}</span
          >
        </button>
      </li>
    </ul>
  </fieldset>
</template>

<style scoped>
.filter {
  padding: 18px 0;
  border-bottom: 1px solid var(--color-line-2);
  border-top: 0;
  border-left: 0;
  border-right: 0;
  margin: 0;
}

.filter__title {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-ink-2);
  margin-bottom: 12px;
  padding: 0;
}

.filter__list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.filter__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 6px 0;
  font-size: 14px;
  width: 100%;
  text-align: left;
  cursor: pointer;
  background: none;
  border: 0;
  color: inherit;
  transition: color var(--duration-fast) ease;
}

.filter__row:hover {
  color: var(--color-accent);
}

.filter__label {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  flex: 1;
}

.filter__label > span:last-child {
  white-space: normal;
  overflow-wrap: anywhere;
}

.filter__count {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--color-ink-3);
  flex-shrink: 0;
  white-space: nowrap;
}

.filter__cb {
  width: 16px;
  height: 16px;
  border: 1px solid var(--color-line);
  border-radius: 3px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--color-paper);
  color: transparent;
  flex-shrink: 0;
  transition:
    background var(--duration-fast) ease,
    border-color var(--duration-fast) ease,
    color var(--duration-fast) ease;
}

.filter__cb--on {
  background: var(--color-ink);
  border-color: var(--color-ink);
  color: var(--color-bg);
}
</style>
