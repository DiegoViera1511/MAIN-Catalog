<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import {useProductStore} from "@/store/productStore.ts";
import {onMounted, ref} from "vue";
import type {CartProduct} from "@/types.ts";
import {Check} from "lucide-vue-next";

const cartProducts = ref<CartProduct[]>([])
const copied = ref(false)

onMounted(() => {
  const store = useProductStore();
  cartProducts.value = store.cart;
})

function getCartTotal() {
  return cartProducts.value.reduce((sum, product) => sum + product.price * product.quantity, 0).toFixed(2);
}

function getInvoiceText() {
  const store = useProductStore();
  const products = store.cart;
  const lines = products.map(product => {
    const lineTotal = (product.price * product.quantity).toFixed(2);
    return `${product.title} \nTalla: ${product.selectedSize} \nCantidad: ${product.quantity} \nPrecio: ${lineTotal} $\n--------------------------------`;
  });
  lines.push(`Total: ${getCartTotal()} $`);
  return lines.join('\n');
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function onCopy() {
  copied.value = true;
  sleep(3000).then(() => {
    copied.value = false;
  });
}

function copyInvoiceToClipboard() {
  const invoiceText = getInvoiceText();
  navigator.clipboard.writeText(invoiceText)
      .then(() => {
        // Optionally show a success message
      })
      .catch(() => {
        // Optionally handle errors
      });
  onCopy()
}

</script>

<template>
  <Dialog>
    <DialogTrigger
        class="flex bg-neutral-900 items-center justify-center dark:bg-slate-50 text-white dark:text-black p-4 rounded-full w-[80%] sm:w-[40%] md:w-[30%]">
      Contactar administrador
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle> Pedido</DialogTitle>
        <DialogDescription>
          El pedido se copiará en el portapapeles de tu dispositivo. Por favor, compártelo con el vendedor en un
          mensaje.
        </DialogDescription>
      </DialogHeader>
      <div class="p-3 bg-gray-200 rounded-md max-h-96 overflow-scroll">
        <div
            class="flex flex-col"
            v-for="(product, index) in cartProducts"
            :key="index"
        >
          <p>Nombre: {{ product.title }}.</p>
          <p>Talla: {{ product.selectedSize }}</p>
          <p>Cantidad: {{ product.quantity }}</p>
          <p>Costo: {{ product.price }} $</p>
          <p>----------------------</p>
        </div>
        <p>Total: {{ getCartTotal() }} $</p>
      </div>
      <DialogFooter>
        <div class="flex flex-col gap-2 w-full">
          <button
              class="bg-black gap-2 text-white w-full transition-all p-2 rounded flex items-center justify-center"
              @click="copyInvoiceToClipboard"
          >
            <span v-show="!copied">Copiar Pedido</span>
            <Check v-show="copied"/>
          </button>
          <hr class="border-b border-gray-200"/>
          <a href="https://wa.me/5355394122" target="_blank" class="w-full">
            <button
                class="bg-green-500 text-white w-full p-2 rounded"
                @click=""
            >
              Contactar Administrador
            </button>
          </a>
        </div>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>