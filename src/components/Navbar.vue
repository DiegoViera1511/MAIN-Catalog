<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import {Menu, X, Instagram,Send} from "lucide-vue-next";

  const isMobile = ref(false);
  const openMenu = ref(false);
  
  function onClickMenu() {
    openMenu.value = !openMenu.value;
  }
  
  onMounted(() => {
  isMobile.value = window.matchMedia('(max-width: 768px)').matches;
  });
</script>

<template>
  <div class="w-full items-center border-b border-b-gray-200 bg-gray-100 dark:bg-neutral-900 dark:border-b-gray-950 dark:text-white">
    <div v-show="!isMobile" class="flex flex-row px-8 items-center justify-around w-full gap-4">
      <p class="p-3 px-4 font-serif font-medium">MAIN</p>
      <div class="flex flex-row w-full items-center justify-center gap-4 p-6">
        <p class="hover:text-orange-600 font-medium cursor-pointer">Home</p>
        <p class="hover:text-orange-600 font-medium cursor-pointer">Men</p>
        <p class="hover:text-orange-600 font-medium cursor-pointer">Women</p>
        <p class="hover:text-orange-600 font-medium cursor-pointer">Accessories</p>  
      </div>
      <Instagram class="hover:text-orange-600 cursor-pointer" :size="30" />
    </div>
    <div v-show="isMobile" class="flex flex-row items-center justify-between p-6 px-4 w-full gap-4">
      <div class="items-center justify-center gap-4 ">
          <Send />
      </div>
      <p class="font-serif font-medium">MAIN</p>
      <button @click="onClickMenu">
        <Menu/>
      </button>
    </div>
    <div 
        class="flex flex-col absolute top-0 transition-all dark:bg-neutral-900 dark:text-white shadow-md rounded-br-md p-4 duration-200 gap-4 justify-start trans w-fit h-full items-start bg-white"
        :class="[openMenu ? 'left-0' : 'left-[-100%] overscroll-y-none']"
    >
      <div @click="onClickMenu" class="flex w-full items-center justify-start">
          <X/>
      </div>
      <div class="flex flex-col gap-3">
        <p class="hover:text-orange-600 font-medium cursor-pointer">Home</p>
        <hr class="border-b border-gray-200" />
        <p class="hover:text-orange-600 font-medium cursor-pointer">Men</p>
        <hr class="border-b border-gray-200"/>
        <p class="hover:text-orange-600 font-medium cursor-pointer">Women</p>
        <hr class="border-b border-gray-200"/>
        <p class="hover:text-orange-600 font-medium cursor-pointer">Accessories</p>
      </div>
    </div>
  </div>
</template>