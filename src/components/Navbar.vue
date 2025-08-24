<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue';
  import {Menu, X, Instagram} from "lucide-vue-next";

  const isMobile = ref(false);
  const openMenu = ref(false);
  const isDarkMode = ref(false);

  function updateDarkMode() {
    isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  
  function onClickMenu() {
    openMenu.value = !openMenu.value;
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
  <div class="w-full fixed items-center border-b border-b-gray-200 bg-gray-100 dark:bg-neutral-900 dark:border-b-gray-950 dark:text-white">
    <div v-show="!isMobile" class="flex flex-row px-8 items-center justify-around w-full gap-4">
      <div class="flex items-center justify-between w-[50px] h-[70px]">
        <img v-show="isDarkMode" src="../../public/logo 2.png" alt="">
        <img v-show="!isDarkMode" src="../../public/logo 3.png" alt="">
      </div>
      <div class="flex flex-row w-full items-center justify-center gap-4 p-6">
        <p class="hover:text-blue-800 font-medium cursor-pointer">Home</p>
        <p class="hover:text-blue-800 font-medium cursor-pointer">Men</p>
        <p class="hover:text-blue-800 font-medium cursor-pointer">Women</p>
        <p class="hover:text-blue-800 font-medium cursor-pointer">Accessories</p>  
      </div>
      <Instagram class="hover:text-orange-600 cursor-pointer" :size="30" />
    </div>
    <div v-show="isMobile" class="flex flex-row items-center justify-between p-6 px-4 w-full gap-4">
      <button @click="onClickMenu">
        <Menu/>
      </button>
      <div class="flex items-center justify-between w-[40px] h-[40px]">
        <img v-show="isDarkMode" src="../../public/logo 2.png" alt="">
        <img v-show="!isDarkMode" src="../../public/logo 3.png" alt="">
      </div>
      <div class="items-center justify-center gap-4 ">
        <Instagram class="hover:text-orange-600 cursor-pointer" :size="30" />
      </div>
    </div>
    <div 
        class="flex fixed flex-col top-0 transition-all dark:bg-neutral-900 dark:text-white shadow-md p-4 py-7 duration-200 gap-4 justify-start trans w-fit h-full items-start bg-white"
        :class="[openMenu ? 'left-0' : 'left-[-100%] overscroll-y-none']"
    >
      <div @click="onClickMenu" class="flex w-full items-center justify-start">
          <X/>
      </div>
      <div class="flex flex-col gap-3">
        <p class="hover:text-blue-800 font-medium cursor-pointer">Home</p>
        <hr class="border-b border-gray-200" />
        <p class="hover:text-blue-800font-medium cursor-pointer">Men</p>
        <hr class="border-b border-gray-200"/>
        <p class="hover:text-blue-800 font-medium cursor-pointer">Women</p>
        <hr class="border-b border-gray-200"/>
        <p class="hover:text-blue-800 font-medium cursor-pointer">Accessories</p>
      </div>
    </div>
  </div>
</template>