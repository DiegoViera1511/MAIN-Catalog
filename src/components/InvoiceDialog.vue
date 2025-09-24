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
import {computed, ref} from "vue";
import {Check,Copy} from "lucide-vue-next";
import {useRouter} from "vue-router";

const copied = ref(false)
const router = useRouter();

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
    return `${product.title} ${ product.selectedSize ? '\nTalla: ' + product.selectedSize : '' } \nCantidad: ${product.quantity} \nPrecio: ${lineTotal} $\n--------------------------------`;
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
  onCopy()
}

function goToContacts(){
  router.push('/contact')
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
      <div class="flex w-full items-center justify-end">
        <button
            class="bg-gray-100 rounded-full p-2 hover:bg-gray-200"
            @click="copyInvoiceToClipboard"
        >
          <Copy v-if="!copied" :size="15"/>
          <Check v-else :size="15"/>
        </button>
      </div>
      <div class="p-3 bg-gray-200 rounded-md max-h-96 overflow-scroll">
        <div
            class="flex flex-col"
            v-for="(product, index) in cartProducts"
            :key="index"
        >
          <p>Nombre: {{ product.title }}.</p>
          <p v-if="product.selectedSize">Talla: {{ product.selectedSize }}</p>
          <p>Cantidad: {{ product.quantity }}</p>
          <p>Costo: {{ product.price }} $</p>
          <p>----------------------</p>
        </div>
        <p>Total: {{ getCartTotal() }} $</p>
      </div>
      <DialogFooter>
        <div class="flex flex-col gap-2 w-full">
          <button
              class="bg-green-500 text-white w-full p-2 rounded"
              @click="goToContacts"
          >
            Contactar Administrador
          </button>
        </div>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>