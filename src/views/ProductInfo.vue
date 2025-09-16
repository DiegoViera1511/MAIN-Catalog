<script setup lang="ts">
import {onMounted, ref} from "vue";
import type {CartProduct, ProductType} from "../types.ts";
import {useProductStore} from "../store/productStore.ts";
import {useRoute} from "vue-router";
import {Plus, Minus} from "lucide-vue-next"
import StoreLayout from "@/layouts/StoreLayout.vue";
import {Button} from "@/components/ui/button";
import {toast} from "vue-sonner";

const product = ref<ProductType | undefined>(undefined)
const selectedSize = ref<number>(0)
const quantity = ref<number>(1)
const route = useRoute()

onMounted(() => {
  const store = useProductStore()
  const productId = parseInt(route.params.id as string, 10);
  product.value = store.getProductById(productId);
})

function addProductToCart(){
  const store = useProductStore()
  if (!product.value) return
  const cartProduct: CartProduct = {
    id: product.value.id,
    url: product.value.url,
    title: product.value.title,
    price: product.value.price,
    selectedSize: product.value.sizes[selectedSize.value],
    quantity: quantity.value
  };
  store.addToCart(cartProduct);
  toast.success(`Añadido al pedido`, {
    duration: 2000,
  });
}

</script>

<template>
  <StoreLayout>
    <div class="flex justify-center dark:text-white p-4 items-start w-full">
      <div v-if="product" class="flex flex-col gap-2">
        <div class="flex bg-gray-100 w-full justify-center h-[400px]">
          <img :src="product.url" alt="product image"/>
        </div>
        <h1 class="font-medium text-xl">{{ product.title }}</h1>
        <p class="text-xl font-bold">Precio: {{ product.price }} $</p>
        <p>{{ product.description }}</p>
        <div class="grid grid-cols-5">
          <div
              v-for="(size, index) in product.sizes"
              :key="index"
              class="flex border-3 font-medium items-center justify-center p-3"
              :class="selectedSize === index ? 'border-sky-500 text-sky-500 dark:text-sky-700 dark:border-sky-700' : 'border-gray-300'"
              @click="() => selectedSize = index"
          >
            {{size}}
          </div>
        </div>
        <div class="flex flex-row items-center mt-3 cursor-pointer border-2 gap-4 border-gray-200 rounded-full justify-center w-fit">
          <button class="flex items-center hover:bg-gray-100 justify-center rounded-full p-4"
                  @click="() => quantity++"
          >
            <Plus/>
          </button>
          <span class="font-bold text-lg">{{ quantity }}</span>
          <button class="flex items-center hover:bg-gray-100 justify-center rounded-full p-4"
                  @click="() => {
                 if( quantity > 1 ) quantity--
                }"
          >
            <Minus :class="quantity == 1 ? 'text-gray-300' : ''"/>
          </button>
        </div>
        <Button class="bg-black text-white dark:text-black dark:bg-white hover:bg-gray-200 flex items-center justify-center font-medium p-5 mt-4 rounded-md"
             @click="addProductToCart"
        >
          Añadir al Pedido
        </Button>
      </div>
      <div v-else>
        <p class="font-medium">Product not found.</p>
      </div>
    </div>
  </StoreLayout>
</template>
