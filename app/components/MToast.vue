<script setup lang="ts">
const toast = useToast()
</script>

<template>
  <Teleport to="body">
    <ClientOnly>
      <TransitionGroup tag="div" name="toast" class="toasts" appear>
        <div
          v-for="t in toast.toasts.value"
          :key="t.id"
          class="toast"
          :class="`toast--${t.tone}`"
          role="status"
          @click="toast.dismiss(t.id)"
        >
          <MIcon
            v-if="t.tone === 'success'"
            name="check"
            :size="14"
          />
          <MIcon
            v-else-if="t.tone === 'error'"
            name="x"
            :size="14"
          />
          <span>{{ t.message }}</span>
        </div>
      </TransitionGroup>
    </ClientOnly>
  </Teleport>
</template>

<style scoped>
.toasts {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 200;
  align-items: center;
  pointer-events: none;
}

.toast {
  background: var(--color-ink);
  color: var(--color-bg);
  padding: 12px 18px;
  border-radius: var(--radius-pill);
  font-size: 13px;
  display: flex;
  gap: 10px;
  align-items: center;
  box-shadow: 0 12px 32px -16px rgba(20, 20, 18, 0.4);
  pointer-events: auto;
  cursor: pointer;
  max-width: min(420px, calc(100vw - 32px));
}

.toast--success {
  background: var(--color-accent-2);
}

.toast--error {
  background: var(--color-accent);
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(12px);
}

.toast-enter-active,
.toast-leave-active {
  transition:
    opacity var(--duration-base) ease,
    transform var(--duration-base) ease;
}
</style>
