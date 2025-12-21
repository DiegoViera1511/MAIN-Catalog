<script setup lang="ts">
import ProductImage from "@/components/ProductImage.vue";

const props = defineProps({
  imageSrc:{
    type: String, 
    required: false,
    default:""
  },
  title:{
    type: String,
    required: true,
    default:""
  },
  description:{
    type: String, 
    required: true,
    default:""
  },
  price:{
    type: Number,
    required: true,
    default: 0.0
  },
  category:{
    type: Array,
    required: true,
    default: () => []
  },
  available:{
    type: Boolean,
    required: true,
    default: true
  },
  colors:{
    type: Array as () => string[],
    required: false,
    default: () => []
  }
});


const images = import.meta.glob('../assets/images/*', { eager: true });
const image: string = (images[props.imageSrc] as string) || props.imageSrc;

</script>

<template>
  <div class="flex flex-col w-full hover:shadow-sm items-center justify-center gap-2 py-3 rounded-md">
    <ProductImage :imageSrc="image" :colors="props.colors" />
    <div class="flex flex-col w-full justify-start items-start dark:text-white">
      <div class="flex flex-row items-center w-full justify-between">
        <p>{{props.title}}</p>
        <div v-show="!props.available" class= "flex items-center justify-center border-2 border-red-800 rounded-full px-3 text-red-800 font-medium">
          Agotado
        </div>
      </div>
      <p class="font-bold">${{props.price}}</p>
    </div>
  </div>
</template>