<script setup lang="ts">
import LoadContainer from "@/components/LoadContainer.vue";
import {ref} from "vue";

const props = defineProps({
  imageSrc: {
    type: String,
    required: true,
    default: ""
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
  </div>
</template>