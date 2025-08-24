<script setup lang="ts">
import {onMounted, ref} from "vue";
import type {ProductType} from "../types.ts";
import {useProductStore} from "../store/productStore.ts";
import {useRoute} from "vue-router";

const product = ref<ProductType | undefined>(undefined)
const selectedSize = ref<number>(0)
const route = useRoute()

onMounted(() => {
  const store = useProductStore()
  const productId = parseInt(route.params.id as string, 10); // Asegúrate de convertir el id a número
  product.value = store.getProductById(productId);
})
</script>

<template>
  <div class="flex justify-center items-center my-5 w-full">
    <div v-if="product" class="flex flex-col gap-2">
      <div class="flex bg-gray-100 w-full justify-center h-[400px]">
        <img :src="product.url" alt="product image"/>
      </div>
      <h1 class="font-medium text-xl">{{ product.title }}</h1>
      <p class="text-xl font-bold">Price: {{ product.price }} $</p>
      <p>{{ product.description }}</p>
      <div class="grid grid-cols-5">
        <div 
            v-for="(size, index) in product.sizes"
            :key="index"
            class="flex border-3 items-center justify-center p-3"
            :class="selectedSize === index ? 'border-blue-500 text-blue-500' : 'border-gray-300'"
            @click="() => selectedSize = index"
        >
          {{size}}
        </div>
      </div>
      <button class="bg-blue-500 font-medium text-white px-4 py-3 mt-4 hover:bg-blue-600">
        Add to Cart
      </button>
    </div>
    <div v-else>
      <p class="font-medium">Product not found.</p>
    </div>
  </div>
</template>
