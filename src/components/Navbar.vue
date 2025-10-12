<script setup lang="ts">
import {ref, onMounted, onUnmounted, computed} from 'vue';
  import {Menu, X, ShoppingCart,Phone} from "lucide-vue-next";
  import {useProductStore} from "../store/productStore.ts";
  import type {CartProduct} from "../types.ts";
  import {useRouter,useRoute} from "vue-router";

  const isMobile = ref(false);
  const openMenu = ref(false);
  const isDarkMode = ref(false);
  const cartProducts = ref<CartProduct[]>([])
  const route = useRoute();
  const showCartButton = computed(() => route.path !== '/cart');

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

  const store = useProductStore();
  const cartCount = computed(() => store.cart.reduce((sum, product) => sum + product.quantity, 0));

  function goHome() {
    if (isMobile.value) {
      onClickMenu();
    }
    router.push('/');
  }
  function goMen() {
    if (isMobile.value) {
      onClickMenu();
    }
    router.push('/men');
  }
  function goWoman() {
    if (isMobile.value) {
      onClickMenu();
    }
    router.push('/women');
  }
  function goAccesories() {
    if (isMobile.value) {
      onClickMenu();
    }
    router.push('/accessories');
  }
  function goCart() {
    router.push('/cart');
  }

  function goContact() {
    router.push('/contact');
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
        <p
            class="hover:text-blue-800 font-medium cursor-pointer"
            @click="goHome"
        >
          Todo
        </p>
        <p
            class="hover:text-blue-800 font-medium cursor-pointer"
            @click="goMen"
        >
          Hombre
        </p>
        <p
            class="hover:text-blue-800 font-medium cursor-pointer"
            @click="goWoman"
        >
          Mujer
        </p>
        <p
            class="hover:text-blue-800 font-medium cursor-pointer"
            @click="goAccesories"
        >
          Accesorios
        </p>
      </div>
      <button v-show="showCartButton" @click="goCart" class="relative">
        <ShoppingCart class=" cursor-pointer" :size="30"/>
        <span v-if="cartCount > 0" class="absolute -top-2 -right-2 bg-cyan-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{{ cartCount }}</span>
      </button>
      <button v-show="!showCartButton" @click="goContact">
        <Phone class="cursor-pointer" :size="30"/>
      </button>
    </div>
    <div v-show="isMobile" class="flex flex-row items-center justify-between p-4 w-full gap-4">
      <button @click="onClickMenu">
        <Menu class=" cursor-pointer" :size="30"/>
      </button>
      <div class="flex items-center justify-between w-[40px] h-[40px]">
        <img v-show="isDarkMode" src="../../public/logo 2.png" alt="">
        <img v-show="!isDarkMode" src="../../public/logo 3.png" alt="">
      </div>
      <div class="items-center justify-center gap-4 ">
        <button v-show="showCartButton" @click="goCart" class="relative">
          <ShoppingCart class=" cursor-pointer" :size="30"/>
          <span v-if="cartCount > 0" class="absolute -top-2 -right-2 bg-cyan-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{{ cartCount }}</span>
        </button>
        <button v-show="!showCartButton" @click="goContact">
          <Phone class="cursor-pointer" :size="30"/>
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
        <p class="hover:text-blue-800 font-medium cursor-pointer"
           @click="goHome"
        >
          Todo
        </p>
        <hr class="border-b border-gray-200" />
        <p
            class="hover:text-blue-800 font-medium cursor-pointer"
            @click="goMen"
        >
          Hombre
        </p>
        <hr class="border-b border-gray-200"/>
        <p
            class="hover:text-blue-800 font-medium cursor-pointer"
            @click="goWoman"
        >
          Mujer
        </p>
        <hr class="border-b border-gray-200"/>
        <p
            class="hover:text-blue-800 font-medium cursor-pointer"
            @click="goAccesories"
        >
          Accesorios
        </p>
      </div>
    </div>
    <div
        class="fixed bg-black transition-all duration-400"
        :class="[openMenu ? 'opacity-10 inset-0' : 'opacity-0']"
    >
    </div>
  </div>
</template>