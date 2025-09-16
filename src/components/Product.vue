<script setup lang="ts">
import { Category } from '../types';

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
  }
});

const images = import.meta.glob('../assets/images/*', { eager: true });
const image: string = (images[props.imageSrc] as string) || props.imageSrc;
</script>

<template>
  <div class="flex flex-col w-full hover:shadow-sm items-center justify-center gap-2 p-3 rounded-md">
    <div class="flex bg-gray-100 w-full justify-center h-[400px]">
      <img :src="image" alt="">
    </div>
    <div class="flex flex-col w-full justify-start items-start dark:text-white">
      <p>{{props.title}}</p>
      <p class="font-bold">{{props.price}}$</p>
    </div>
  </div>
</template>