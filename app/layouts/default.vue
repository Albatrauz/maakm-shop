<script setup lang="ts">
const cart = useCart()

onMounted(() => {
  cart.init()
})
</script>

<template>
  <div class="layout">
    <MTopBar :cart-count="cart.totalQuantity.value" @open-cart="cart.openDrawer" />
    <main class="layout__main">
      <slot />
    </main>
    <MFooter />
    <MCartDrawer />
    <MToast />
  </div>
</template>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.layout__main {
  flex: 1;
}
</style>
