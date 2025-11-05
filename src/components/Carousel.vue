<script setup lang="ts">
import {ref, computed, onMounted, onBeforeUnmount} from 'vue';
import {ChevronLeft, ChevronRight} from "lucide-vue-next";
import ProductImage from "@/components/ProductImage.vue";

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

// Variables para gestos táctiles
const touchStartX = ref(0);
const touchEndX = ref(0);
const minSwipeDistance = 50; // Distancia mínima para considerar un swipe

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

// Funciones para gestos táctiles
const handleTouchStart = (e: TouchEvent) => {
  touchStartX.value = e.touches[0].clientX;
  pauseAutoPlay(); // Pausar autoplay durante el gesto
};

const handleTouchMove = (e: TouchEvent) => {
  // Prevenir el scroll por defecto durante el swipe
  e.preventDefault();
};

const handleTouchEnd = (e: TouchEvent) => {
  touchEndX.value = e.changedTouches[0].clientX;
  handleSwipe();
  startAutoPlay(); // Reanudar autoplay después del gesto
};

const handleSwipe = () => {
  const swipeDistance = touchStartX.value - touchEndX.value;

  if (Math.abs(swipeDistance) > minSwipeDistance) {
    if (swipeDistance > 0) {
      // Swipe hacia la izquierda - siguiente imagen
      nextSlide();
    } else {
      // Swipe hacia la derecha - imagen anterior
      previousSlide();
    }
  }
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
  <div
      class="relative flex w-full sm:w-[400px] overflow-hidden select-none"
      @mouseenter="pauseAutoPlay"
      @mouseleave="startAutoPlay"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
  >
    <div class="flex bg-gray-100 w-full transition-transform duration-500 ease-in-out" :style="carouselStyle">
      <div v-for="(image, index) in images" :key="index" class="w-full flex-shrink-0">
        <ProductImage :image-src="image" :key="index"/>
      </div>
    </div>

    <button
        @click="previousSlide"
        class="hidden sm:block text-black absolute left-0 bottom-4 -translate-y-1/2 bg-white/30 hover:bg-white/50 p-2 rounded-full ml-4 transition-colors"
    >
      <ChevronLeft/>
    </button>

    <button
        @click="nextSlide"
        class="hidden sm:block text-black absolute right-0 bottom-4 -translate-y-1/2 bg-white/30 hover:bg-white/50 p-2 rounded-full mr-4 transition-colors"
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
