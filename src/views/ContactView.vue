<script setup lang="ts">
import {MessageCircle, Send, Instagram, Link} from "lucide-vue-next";
import {useProductStore} from "@/store/productStore.ts";
import {computed} from "vue";
import {Colors, SpanishColors} from "@/types.ts";

const cartProducts = computed(() => {
  const store = useProductStore();
  return store.cart
})

function getCartTotal() {
  return cartProducts.value.reduce((sum, product) => sum + product.price * product.quantity, 0).toFixed(2);
}

function getInvoiceText() {
  const store = useProductStore();
  const products = store.cart;
  const lines = products.map(product => {
    const lineTotal = (product.price * product.quantity).toFixed(2);
    return `${product.title}%20${product.selectedSize ? '%0ATalla:%20' + product.selectedSize : ''}%20%0AColor:%20${SpanishColors[product.selectedColor as Colors]}%20%20%0ACantidad:%20${product.quantity}%20%0APrecio:%20$${lineTotal}%20%20%0A------------------------------`;
  });
  if (products.length > 0) {
    lines.push(`Total: ${getCartTotal()}%20$`);
  }
  return lines.join('%0A');
}

</script>

<template>
  <div
      class="flex flex-col transition-all dark:bg-neutral-900 dark:text-white px-4 duration-200 gap-4 justify-start w-full h-full items-start"
  >
    <h1 class="font-bold text-2xl">Contactos</h1>
    <div class="flex flex-col gap-3 w-full">
      <a
          :href="`https://wa.me/5355394122?text=${getInvoiceText()}`"
          target="_blank"
          rel="noopener noreferrer"
      >
        <div
            class="flex flex-row gap-4 shadow items-center justify-between text-lg border-2 dark:border-gray-600 p-4 rounded-lg hover:shadow-md w-full"
        >
          <div class="flex flex-row gap-4 items-center justify-start">
            <MessageCircle class="text-green-500"/>
            <div class="flex flex-col">
              <p class="font-medium text-xl">Link a WhatsApp</p>
              <p class="font-medium text-sm text-gray-500">+53 55394122</p>
            </div>
          </div>
          <div class="flex items-center justify-end">
            <Link/>
          </div>
        </div>
      </a>
      <a
          :href="`https://wa.me/5355206726?text=${getInvoiceText()}`"
          target="_blank"
          rel="noopener noreferrer"
      >
        <div
            class="flex flex-row gap-4 shadow items-center justify-between text-lg border-2 dark:border-gray-600 p-4 rounded-lg hover:shadow-md w-full"
        >
          <div class="flex flex-row gap-4 items-center justify-start">
            <MessageCircle class="text-green-500"/>
            <div class="flex flex-col">
              <p class="font-medium text-xl">Link a WhatsApp</p>
              <p class="font-medium text-sm text-gray-500">+53 55206726</p>
            </div>
          </div>
          <div class="flex items-center justify-end">
            <Link/>
          </div>
        </div>
      </a>
      <a
          :href="`https://t.me/Rafas_mood?text=${getInvoiceText()}`"
          target="_blank"
          rel="noopener noreferrer"
      >
        <div
            class="flex flex-row gap-4 shadow items-center justify-between  text-lg border-2 dark:border-gray-600 p-4 rounded-lg hover:shadow-md w-full"
        >
          <div class="flex flex-row gap-4 items-center justify-start">
            <Send class="text-cyan-500"/>
            <div class="flex flex-col">
              <p class="font-medium text-xl">Link a Telegram</p>
              <p class="font-medium text-sm text-gray-500">@Rafas_mood</p>
            </div>
          </div>
          <div class="flex items-center justify-end">
            <Link/>
          </div>
        </div>
      </a>
    </div>
    <div class="flex flex-col gap-3 w-full">
      <h1 class="font-bold text-2xl">Redes Sociales</h1>
      <a
          href="https://www.instagram.com/main_activewear?igsh=OWc0MG41YmNxYWdl&utm_source=qr"
          target="_blank"
          rel="noopener noreferrer"
      >
        <div
            class="flex flex-row gap-4 shadow items-center justify-between  text-lg border-2 dark:border-gray-600 p-4 rounded-lg hover:shadow-md w-full"
        >
          <div class="flex flex-row gap-4 items-center justify-start">
            <Instagram class="text-orange-500"/>
            <div class="flex flex-col">
              <p class="font-medium text-xl">Link a Instagram</p>
              <p class="font-medium text-sm text-gray-500">main_activewear</p>
            </div>
          </div>
          <div class="flex items-center justify-end">
            <Link/>
          </div>
        </div>
      </a>
    </div>
  </div>
</template>

<style scoped>

</style>