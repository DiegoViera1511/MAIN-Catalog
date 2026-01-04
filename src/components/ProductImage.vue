<script setup lang="ts">
import LoadImageContainer from "@/components/LoadImageContainer.vue";
import {ref} from "vue";
import {BgColors, Colors} from "@/lib/types.ts";
import {getDiscountPercentage} from "@/lib/utils.ts";
import DiscountPoster from "@/components/DiscountPoster.vue";

const props = defineProps<{
  imageSrc: string,
  colors?: string[],
  price?: number
  discount_price?: number | null
}>();

const isLoadingImage = ref(true);
function setLoadOff() {
  isLoadingImage.value = false;
}

</script>

<template>
  <div
      class="relative flex bg-gray-100 w-full justify-center h-[400px]"
  >
    <img
        loading="lazy"
        @load="setLoadOff"
        :class="`${ isLoadingImage ? 'opacity-0' : 'opacity-100'} transition-opacity object-cover`"
        :src="props.imageSrc"
        alt="product"
    >
    <div
        v-if="isLoadingImage"
        class="absolute w-full h-full flex items-center justify-center"
    >
      <LoadImageContainer />
    </div>
    <div
        v-if="props.colors && props.colors.length > 0"
        class="absolute bottom-1 right-1 flex flex-col gap-2 px-2 py-1 rounded-md"
    >
      <div
          v-for="(color, index) in props.colors"
          :key="index"
          :class="`w-6 h-6 rounded-full border-2 cursor-pointer ${BgColors[color as Colors]}`"
      ></div>
    </div>
    <DiscountPoster
        v-if="props.discount_price && props.price"
        :price="props.price"
        :discount_price="props.discount_price"
        cn="absolute top-2 right-2"
    />
  </div>
</template>