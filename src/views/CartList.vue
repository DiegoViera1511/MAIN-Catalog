<script setup lang="ts">
import {useProductStore} from "../store/productStore.ts";
import {Minus, Plus, Trash} from "lucide-vue-next";
import {computed, onMounted, ref} from "vue";
import {type CartProduct, SpanishColors} from "../types.ts";
import InvoiceDialog from "@/components/InvoiceDialog.vue";
import {Colors} from "../types.ts";

const cartProducts = ref<CartProduct[]>([])
const cartTotalCount = computed(() => getCartCount())
const cartTotalPrice = computed(() => getCartTotal())

onMounted(() => {
  const store = useProductStore();
  cartProducts.value = store.cart;
})

function getCartTotal() {
  return cartProducts.value.reduce((sum, product) => sum + (product.discount_price ?? product.price) * product.quantity, 0);
}

function getCartCount() {
  return cartProducts.value.reduce((sum, product) => sum + product.quantity, 0);
}

function removeProduct(id: number, selectedSize: string, selectedColor: string) {
  cartProducts.value = cartProducts.value.filter(p => !(p.id === id && p.selectedSize === selectedSize && p.selectedColor === selectedColor));
}

</script>

<template>
  <div
      class="flex flex-col transition-all dark:bg-neutral-900 dark:text-white px-2 duration-200 gap-4 justify-start w-full h-full items-start"
  >
    <h1 class="font-bold text-2xl">Lista de Compra</h1>
    <div class="flex flex-row gap-2 w-full items-center justify-start text-xl"
         v-if="getCartCount() > 0"
    >
      <p class="text-gray-500">{{ cartTotalCount }} {{ cartTotalCount === 1 ? 'producto' : 'productos' }}</p>
      <p class="text-gray-500">|</p>
      <p>${{ cartTotalPrice.toFixed(2) }}</p>
    </div>
    <div class="flex flex-col gap-3 w-full">
      <div class="flex w-full items-center justify-center">
        <span v-if="cartTotalPrice == 0" class="font-medium text-2xl">No hay productos en tu lista de compras.</span>
      </div>
      <div
          class="flex flex-col items-center border-b-2 pb-3 border-b-gray-200 dark:border-b-gray-700 gap-4 w-full justify-between"
          v-for="(product,index) in cartProducts"
          :key="index"
      >
        <div class="flex flex-row w-full items-center justify-start gap-2 ">
          <img :src="product.url" alt="product image" class="w-[150px] bg-gray-200 h-[150px] object-cover rounded-md"/>
          <div class="flex flex-col flex-1 items-start justify-start font-medium text-lg w-[150px] h-[150px]">
            <span>{{ product.title }}</span>
            <span class="text-neutral-500" v-if="product.selectedSize">Talla: {{ product.selectedSize }}</span>
            <span class="text-neutral-500">Color: {{ SpanishColors[product.selectedColor as Colors] }}</span>
            <div>
              <span
                  v-if="product.discount_price"
              >
                ${{ product.discount_price }}
              </span>
                <span
                    :class="product.discount_price ? 'line-through text-red-700 ml-2' : ''"
                >
                ${{ product.price }}
              </span>
            </div>
          </div>
        </div>
        <div
            class="flex flex-row items-center cursor-pointer border-2 gap-4 border-gray-200 rounded-full justify-center w-fit">
          <button
              class="flex items-center hover:bg-gray-100 dark:hover:bg-neutral-700 justify-center rounded-full p-2"
              @click="() => product.quantity++"
          >
            <Plus/>
          </button>
          <span class="font-bold text-lg">{{ product.quantity }}</span>
          <button
              class="flex items-center hover:bg-gray-100 dark:hover:bg-neutral-700 justify-center rounded-full p-2"
              @click="() => {
                   if (product.quantity > 1){
                      product.quantity--;
                   } else if (product.quantity == 1) {
                     const store = useProductStore();
                     store.removeFromCart(product.id, product.selectedSize, product.selectedColor);
                     removeProduct(product.id, product.selectedSize, product.selectedColor);
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
      class="flex fixed w-full z-10 bottom-5 items-center justify-center"
      v-if="cartProducts.length > 0"
  >
    <InvoiceDialog/>
  </div>
</template>