<script setup lang="ts">
import LoadContainer from "@/components/LoadContainer.vue";
import {ref} from "vue";
import {BgColors, Colors} from "@/types.ts";

const props = defineProps({
  imageSrc: {
    type: String,
    required: true,
    default: ""
  },
  colors: {
    type: Array as () => string[],
    required: false,
    default: () => []
  }
})

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
        v-if="props.colors.length > 0"
        class="absolute bottom-1 right-1 flex flex-col gap-2 px-2 py-1 rounded-md"
    >
      <div
          v-for="(color, index) in props.colors"
          :key="index"
          :class="`w-6 h-6 rounded-full border-2 cursor-pointer ${BgColors[color as Colors]}`"
      ></div>
    </div>
  </div>
</template>