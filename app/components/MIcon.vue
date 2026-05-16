<script setup lang="ts">
export type IconName =
  | 'cart'
  | 'search'
  | 'user'
  | 'heart'
  | 'x'
  | 'plus'
  | 'minus'
  | 'arrow-right'
  | 'arrow-left'
  | 'arrow-up-right'
  | 'check'
  | 'truck'
  | 'shield'
  | 'leaf'
  | 'tool'
  | 'menu'
  | 'star'
  | 'filter'

withDefaults(
  defineProps<{
    name: IconName
    size?: number | string
  }>(),
  { size: 18 },
)
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <template v-if="name === 'cart'">
      <path d="M3 4h2l2.5 12h11l2-9H6" />
      <circle cx="9" cy="20" r="1.5" />
      <circle cx="18" cy="20" r="1.5" />
    </template>
    <template v-else-if="name === 'search'">
      <circle cx="11" cy="11" r="6" />
      <path d="m20 20-4-4" />
    </template>
    <template v-else-if="name === 'user'">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 4-7 8-7s8 3 8 7" />
    </template>
    <template v-else-if="name === 'heart'">
      <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" />
    </template>
    <template v-else-if="name === 'x'">
      <path d="m6 6 12 12M18 6 6 18" />
    </template>
    <template v-else-if="name === 'plus'">
      <path d="M12 5v14M5 12h14" />
    </template>
    <template v-else-if="name === 'minus'">
      <path d="M5 12h14" />
    </template>
    <template v-else-if="name === 'arrow-right'">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </template>
    <template v-else-if="name === 'arrow-left'">
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </template>
    <template v-else-if="name === 'arrow-up-right'">
      <path d="M7 17 17 7M8 7h9v9" />
    </template>
    <template v-else-if="name === 'check'">
      <path d="m4 12 5 5 11-11" />
    </template>
    <template v-else-if="name === 'truck'">
      <path d="M3 6h11v10H3zM14 9h4l3 3v4h-7" />
      <circle cx="7" cy="18" r="1.5" />
      <circle cx="17" cy="18" r="1.5" />
    </template>
    <template v-else-if="name === 'shield'">
      <path d="M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6z" />
    </template>
    <template v-else-if="name === 'leaf'">
      <path d="M5 19c0-8 6-14 14-14 0 8-6 14-14 14zM5 19l6-6" />
    </template>
    <template v-else-if="name === 'tool'">
      <path d="M14 6a4 4 0 1 0-4 4l-6 6 2 2 6-6a4 4 0 0 0 4-4z" />
    </template>
    <template v-else-if="name === 'menu'">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </template>
    <template v-else-if="name === 'star'">
      <path
        fill="currentColor"
        d="m12 2 2.9 6.9 7.4.6-5.6 4.9 1.7 7.2L12 17.8 5.6 21.6l1.7-7.2-5.6-4.9 7.4-.6z"
      />
    </template>
    <template v-else-if="name === 'filter'">
      <path d="M4 5h16M7 12h10M10 19h4" />
    </template>
  </svg>
</template>
