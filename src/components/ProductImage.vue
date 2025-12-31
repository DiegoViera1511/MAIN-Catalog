<script setup lang="ts">
import LoadContainer from "@/components/LoadContainer.vue";
import {ref} from "vue";
import {BgColors, Colors} from "@/lib/types.ts";

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

//TODO REFACTOR DISCOUNT CALCULATION TO A COMPOSABLE
const getDiscountPercentage = (): number | null => {
  if (!props?.discount_price || !props?.price) {
    return null;
  }

  const discount = ((props.price - props.discount_price) / props.price) * 100;
  return Math.round(discount);
};

</script>

<template>
  <div
      class="relative flex bg-gray-100 w-full justify-center h-[400px]"
  >
    <img
        loading="lazy"
        @load="setLoadOff"
        :style="{ opacity: isLoadingImage ? 0 : 1, transition: 'opacity 0.3s' }"
        class="object-cover" :src="props.imageSrc" alt=""
    >
    <div
        v-if="isLoadingImage"
        class="absolute w-full h-full flex items-center justify-center  "
    >
      <LoadContainer />
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
    <div
        v-if="props.discount_price && props.price"
        class="absolute top-2 right-2 bg-gray-200 w-fit rounded-sm p-1 px-2"
    >
      <span class="font-bold">{{getDiscountPercentage()}} % OFF</span>
    </div>
  </div>
</template>