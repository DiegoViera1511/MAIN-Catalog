<script setup lang="ts">
  import {computed, onMounted, onUnmounted, ref} from 'vue';
  import {Menu, Phone, ShoppingCart, X} from "lucide-vue-next";
  import {useProductStore} from "@/store/productStore.ts";
  import type {CartProduct} from "@/lib/types.ts";
  import {useRoute, useRouter} from "vue-router";
  import {Routes} from "@/lib/routes.ts";
  import NavbarItem from "@/components/Navbar/NavbarItem.vue";

  const isMobile = ref(false);
  const openMenu = ref(false);
  const isDarkMode = ref(false);
  const cartProducts = ref<CartProduct[]>([])

  const route = useRoute();
  const showCartButton = computed(() => route.path !== Routes.CART);
  const router = useRouter();
  const store = useProductStore();
  const cartCount = computed(() => store.cart.reduce((sum, product) => sum + product.quantity, 0));

  onMounted(() => {
    const store = useProductStore()
    cartProducts.value = store.cart
    isMobile.value = window.matchMedia('(max-width: 768px)').matches;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    updateDarkMode();
    mediaQuery.addEventListener('change', updateDarkMode);
  })

  onUnmounted(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.removeEventListener('change', updateDarkMode);
  });

  function updateDarkMode() {
    isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function onClickMenu() {
    openMenu.value = !openMenu.value;
  }

  function goRoute(route: Routes, closeMenu: boolean = true){
    if (closeMenu && isMobile.value) {
      onClickMenu();
    }
    router.push(route)
  }

</script>

<template>
  <nav
      class="flex w-full flex-shrink-0 z-30 items-center bg-slate-50 dark:bg-neutral-900 dark:text-white"
  >
    <div
        class="flex flex-row items-center w-full gap-4"
        :class="isMobile ?
        'p-4 justify-between'
        :
        'px-8 justify-around'"
    >
      <button
          v-if="isMobile"
          @click="onClickMenu"
      >
        <Menu class=" cursor-pointer" :size="30"/>
      </button>
      <div
          class="flex items-center justify-between"
          :class="isMobile ?
          'w-[40px] h-[40px]'
          :
          'w-[50px] h-[70px]'"
      >
        <img v-show="isDarkMode" src="../../../public/logo%202.png" alt="logo">
        <img v-show="!isDarkMode" src="../../../public/logo%203.png" alt="logo">
      </div>
      <div
          v-if="!isMobile"
          class="flex flex-row w-full items-center justify-center gap-4 p-6"
      >
        <NavbarItem text="Todo" :on-click="() => goRoute(Routes.HOME)"/>
        <NavbarItem text="Hombre" :on-click="() => goRoute(Routes.MEN)"/>
        <NavbarItem text="Mujer" :on-click="() => goRoute(Routes.WOMEN)"/>
        <NavbarItem text="Accesorios" :on-click="() => goRoute(Routes.ACCESSORIES)"/>
      </div>
      <button
          v-show="showCartButton"
          @click="() => goRoute(Routes.CART,false)"
          class="relative"
      >
        <ShoppingCart class="cursor-pointer" :size="30"/>
        <span v-if="cartCount > 0" class="absolute -top-2 -right-2 bg-cyan-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{{ cartCount }}</span>
      </button>
      <button
          v-show="!showCartButton"
          @click="() => goRoute(Routes.CONTACT,false)"
      >
        <Phone class="cursor-pointer" :size="30"/>
      </button>
    </div>

    <div
        class="flex fixed z-30 flex-col p-6 px-4 top-0 transition-all w-[80%] dark:bg-neutral-900 dark:text-white shadow-md py-7 duration-200 gap-6 justify-start trans h-full items-start bg-white"
        :class="[openMenu ? 'left-0' : 'left-[-100%] overscroll-y-none']"
    >
      <div @click="onClickMenu" class="flex  w-fit items-center p-1 rounded-md justify-center">
          <X/>
      </div>
      <div class="flex flex-col gap-3 text-2xl w-full">
        <NavbarItem text="Todo" :on-click="() => goRoute(Routes.HOME)"/>
        <hr class="border-b border-gray-200" />
        <NavbarItem text="Hombre" :on-click="() => goRoute(Routes.MEN)"/>
        <hr class="border-b border-gray-200"/>
        <NavbarItem text="Mujer" :on-click="() => goRoute(Routes.WOMEN)"/>
        <hr class="border-b border-gray-200"/>
        <NavbarItem text="Accesorios" :on-click="() => goRoute(Routes.ACCESSORIES)"/>
      </div>
    </div>
    <div
        class="fixed bg-black transition-all duration-400"
        :class="[openMenu ? 'opacity-10 inset-0' : 'opacity-0']"
    >
    </div>
  </nav>
</template>