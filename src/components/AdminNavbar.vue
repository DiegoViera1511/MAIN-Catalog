<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import {useProductStore} from "../store/productStore.ts";
import type {CartProduct} from "../lib/types.ts";

const isMobile = ref(false);
const isDarkMode = ref(false);
const cartProducts = ref<CartProduct[]>([])

onMounted(() => {
  const store = useProductStore()
  cartProducts.value = store.cart
})

function updateDarkMode() {
  isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
}

onMounted(() => {
  isMobile.value = window.matchMedia('(max-width: 768px)').matches;
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  updateDarkMode();
  mediaQuery.addEventListener('change', updateDarkMode);

});
onUnmounted(() => {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.removeEventListener('change', updateDarkMode);
});

</script>

<template>
  <div class="w-full fixed items-center bg-slate-50  dark:bg-neutral-900 dark:text-white">
    <div class="flex flex-row items-center justify-center py-2 px-4 w-full gap-4">
      <div class="flex items-center justify-between w-[50px] h-[50px]">
        <img src="../../public/logo 1.png" alt="logo">
      </div>
    </div>
  </div>
</template>