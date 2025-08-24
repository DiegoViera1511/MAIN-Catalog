<script setup lang="ts">

import ProductsList from "./ProductsList.vue";
import Carousel from "./Carousel.vue";
import {onMounted, ref} from "vue";
import {MessageCircle} from "lucide-vue-next";

const isMobile = ref(false);

onMounted(() => {
  isMobile.value = window.matchMedia('(max-width: 768px)').matches;
});
</script>

<template>
  <ProductsList/>
  <div v-show="isMobile" class="flex items-center justify-center w-ful p-3">
    <Carousel
        :images="[
          '../../public/Images/Women/ADAPTCAMOSEAMLESSLEGGINGS-ENG-L-A0146GSMidnightBlue-GSAshBlueB5A8B-UCDW-1343_0e6ec145-fde9-45a7-94c5-f7b6d8ddfb17_3840x.jpg.webp',
          '../../public/Images/Women/CROSSOVERFLAREDLEGGINGS-REGULAR-GSBlack-B5A8D-BB2J2468_4bdde574-3e79-48e6-bdf3-55df5734826c_3840x.jpg.webp',
          '../../public/Images/Women/RuchedSkortGSMutedPinkB3C8N-KB68-1111_A-0184_3840x.jpg.webp',   
      ]"
        :auto-play="true"
        :interval="3000"
    />
  </div>
  <button class="fixed top-30 right-2 bg-gray-200 dark:bg-neutral-900 rounded-full p-4">
    <MessageCircle class="text-green-500"/>
  </button>
</template>