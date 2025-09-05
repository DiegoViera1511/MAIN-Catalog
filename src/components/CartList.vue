<script setup lang="ts">
import {useProductStore} from "../store/productStore.ts";
import {Minus, Plus, Trash} from "lucide-vue-next";
import {onMounted, ref} from "vue";
import type {CartProduct} from "../types.ts";
import InvoiceDialog from "@/components/InvoiceDialog.vue";

const cartProducts = ref<CartProduct[]>([])

onMounted(() => {
  const store = useProductStore();
  cartProducts.value = store.cart;
})

function getCartTotal() {
  return cartProducts.value.reduce((sum, product) => sum + product.price * product.quantity, 0);
}

function getCartCount() {
  return cartProducts.value.reduce((sum, product) => sum + product.quantity, 0);
}

function removeProduct(id: number) {
  cartProducts.value = cartProducts.value.filter(p => p.id !== id)
}

</script>

<template>
  <div
      class="flex flex-col transition-all dark:bg-neutral-900 dark:text-white px-4 duration-200 gap-4 justify-start w-full h-full items-start"
  >
    <h1 class="font-bold text-xl">Lista de Compra</h1>
    <div class="flex flex-row gap-2 w-full items-center justify-start text-xl"
         v-if="getCartCount() > 0"
    >
      <p class="text-gray-500">{{getCartCount()}} products</p>
      <p class="text-gray-500">|</p>
      <p>{{ getCartTotal().toFixed(2) }} $</p>
    </div>
    <div class="flex flex-col gap-3 w-full">
      <div class="flex w-full items-center justify-center">
        <span v-if="getCartCount() == 0" class="font-medium text-2xl">No hay productos en tu lista de compras.</span>
      </div>
      <div
          class="flex flex-col items-center border-b-2 pb-3 border-b-gray-200 dark:border-b-gray-700 gap-4 w-full justify-between"
          v-for="(product,index) in cartProducts"
          :key="index"
      >
        <div class="flex flex-row w-full justify-between sm:justify-start sm:gap-4 items-center">
          <img :src="product.url" alt="product image" class="w-[150px] h-[150px] object-cover rounded-md"/>
          <div class="flex flex-col items-start justify-center font-medium text-lg w-[150px] h-[150px]">
            <span>{{ product.price }} $</span>
            <span>{{ product.title }}</span>
            <span>Size: {{ product.selectedSize }}</span>
          </div>
        </div>
        <div
            class="flex flex-row items-center cursor-pointer border-2 gap-4 border-gray-200 rounded-full justify-center w-fit">
          <button class="flex items-center hover:bg-gray-100 dark:hover:bg-neutral-700 justify-center rounded-full p-2"
                  @click="() => product.quantity++"
          >
            <Plus/>
          </button>
          <span class="font-bold text-lg">{{ product.quantity }}</span>
          <button class="flex items-center hover:bg-gray-100 dark:hover:bg-neutral-700 justify-center rounded-full p-2"
                  @click="() => {
                   if (product.quantity > 1){
                      product.quantity--;
                   }else if (product.quantity == 1) {
                     const store = useProductStore();
                     store.removeFromCart(product.id);
                     removeProduct(product.id);
                   }
                 }"
          >
            <Trash v-if="product.quantity == 1"/>
            <Minus v-if="product.quantity > 1"/>
          </button>
        </div>
      </div>
    </div>
  </div>
  <div
      class="flex flex-col fixed w-full z-10 dark:text-white sm:h-48 p-7 gap-8 bottom-0 items-center justify-center border-t-2 dark:border-t-gray-700 border-t-gray-200 bg-slate-50 dark:bg-neutral-900"
      v-if="cartProducts.length > 0"
  >
    <InvoiceDialog />
  </div>
</template>