<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue';
  import {Menu, X, ShoppingCart} from "lucide-vue-next";
  import {useProductStore} from "../store/productStore.ts";
  import type {CartProduct} from "../types.ts";
  import {useRouter} from "vue-router";

  const isMobile = ref(false);
  const openMenu = ref(false);
  const isDarkMode = ref(false);
  const cartProducts = ref<CartProduct[]>([])

  onMounted(() => {
    const store = useProductStore()
    cartProducts.value = store.cart
  })

  function updateDarkMode() {
    isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  
  function onClickMenu() {
    openMenu.value = !openMenu.value;
  }

  const router = useRouter();

  function goHome() {
    onClickMenu();
    router.push('/');
  }
  function goCart() {
    router.push('/cart');
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
    <div v-show="!isMobile" class="flex flex-row px-8 items-center justify-around w-full gap-4">
      <div class="flex items-center justify-between w-[50px] h-[70px]">
        <img v-show="isDarkMode" src="../../public/logo 2.png" alt="">
        <img v-show="!isDarkMode" src="../../public/logo 3.png" alt="">
      </div>
      <div class="flex flex-row w-full items-center justify-center gap-4 p-6">
        <p class="hover:text-blue-800 font-medium cursor-pointer">Todo</p>
        <p class="hover:text-blue-800 font-medium cursor-pointer">Hombre</p>
        <p class="hover:text-blue-800 font-medium cursor-pointer">Mujer</p>
        <p class="hover:text-blue-800 font-medium cursor-pointer">Accesorios</p>
      </div>
      <button @click="goCart">
        <ShoppingCart class="hover:text-orange-600 cursor-pointer" :size="30"/>
      </button>
    </div>
    <div v-show="isMobile" class="flex flex-row items-center justify-between p-6 px-4 w-full gap-4">
      <button @click="onClickMenu">
        <Menu class="hover:text-orange-600 cursor-pointer" :size="30"/>
      </button>
      <div class="flex items-center justify-between w-[40px] h-[40px]">
        <img v-show="isDarkMode" src="../../public/logo 2.png" alt="">
        <img v-show="!isDarkMode" src="../../public/logo 3.png" alt="">
      </div>
      <div class="items-center justify-center gap-4 ">
        <button @click="goCart">
          <ShoppingCart class="hover:text-orange-600 cursor-pointer" :size="30"/>
        </button>
      </div>
    </div>
    <div 
        class="flex fixed flex-col p-6 px-4 top-0 transition-all w-[80%] z-30 dark:bg-neutral-900 dark:text-white shadow-md py-7 duration-200 gap-6 justify-start trans h-full items-start bg-white"
        :class="[openMenu ? 'left-0' : 'left-[-100%] overscroll-y-none']"
    >
      <div @click="onClickMenu" class="flex  w-fit items-center p-1 rounded-md justify-center">
          <X/>
      </div>
      <div class="flex flex-col gap-3 text-2xl w-full">
        <p class="hover:text-blue-800font-medium cursor-pointer"
           @click="goHome"
        >
          Todo
        </p>
        <hr class="border-b border-gray-200" />
        <p class="hover:text-blue-800 font-medium cursor-pointer">Hombre</p>
        <hr class="border-b border-gray-200"/>
        <p class="hover:text-blue-800 font-medium cursor-pointer">Mujer</p>
        <hr class="border-b border-gray-200"/>
        <p class="hover:text-blue-800 font-medium cursor-pointer">Accesorios</p>
      </div>
    </div>
    <div
        class="fixed bg-black transition-all duration-400"
        :class="[openMenu ? 'opacity-10 inset-0' : 'opacity-0']"
    >
    </div>
  </div>
</template>