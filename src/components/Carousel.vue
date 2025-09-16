<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import {ChevronLeft,ChevronRight} from "lucide-vue-next";

const props = defineProps({
  images: {
    type: Array as () => string[],
    required: true
  },
  autoPlay: {
    type: Boolean,
    default: true
  },
  interval: {
    type: Number,
    default: 5000
  }
});

const currentSlide = ref(0);
let autoPlayInterval: ReturnType<typeof setInterval> | null = null;

const carouselStyle = computed(() => ({
  transform: `translateX(-${currentSlide.value * 100}%)`
}));

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % props.images.length;
};

const previousSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + props.images.length) % props.images.length;
};

const goToSlide = (index: number) => {
  currentSlide.value = index;
};

const startAutoPlay = () => {
  if (props.autoPlay && !autoPlayInterval) {
    autoPlayInterval = setInterval(nextSlide, props.interval);
  }
};

const pauseAutoPlay = () => {
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval);
    autoPlayInterval = null;
  }
};

onMounted(() => {
  startAutoPlay();
});

onBeforeUnmount(() => {
  pauseAutoPlay();
});
</script>

<template>
  <div class="relative w-[400px] overflow-hidden" @mouseenter="pauseAutoPlay" @mouseleave="startAutoPlay">
    <div class="flex transition-transform duration-500 ease-in-out" :style="carouselStyle">
      <div v-for="(image, index) in images" :key="index" class="w-full flex-shrink-0">
        <img :src="image" :alt="`Slide ${index + 1}`" class="w-full" />
      </div>
    </div>
    
    <button
        @click="previousSlide"
        class="absolute left-0 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 p-2 rounded-full m-4 transition-colors"
    >
      <ChevronLeft/>
    </button>

    <button
        @click="nextSlide"
        class="absolute right-0 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 p-2 rounded-full m-4 transition-colors"
    >
      <ChevronRight/>
    </button>
    
    <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
      <button
          v-for="(_, index) in images"
          :key="index"
          @click="goToSlide(index)"
          class="w-3 h-3 rounded-full transition-colors"
          :class="currentSlide === index ? 'bg-white' : 'bg-gray-200'"
      ></button>
    </div>
  </div>
</template>
