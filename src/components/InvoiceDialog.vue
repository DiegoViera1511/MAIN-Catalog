<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useProductStore } from "@/store/productStore.ts";
import { ref } from "vue";
import { Check, Copy } from "lucide-vue-next";
import { useRouter } from "vue-router";
import { Button } from "@/components/ui/button";
import { copyTextToClipboard, decodeUrlText, sleep } from "@/lib/utils.ts";
import { Routes } from "@/lib/routes.ts";

const store = useProductStore();
const copied = ref(false);
const router = useRouter();

function onCopy() {
  copied.value = true;
  sleep(3000).then(() => {
    copied.value = false;
  });
}

function copyInvoiceToClipboard() {
  const invoiceText = store.getCartInvoiceText();
  copyTextToClipboard(invoiceText);
  onCopy();
}

function goToContacts() {
  router.push(Routes.CONTACT);
}
</script>

<template>
  <Dialog>
    <DialogTrigger>
      <Button
        class="flex items-center justify-center bg-black w-full dark:bg-white text-white dark:text-black hover:bg-gray-200 font-medium p-5 rounded-full"
      >
        Contactar Administrador
      </Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle> Pedido</DialogTitle>
        <DialogDescription>
          El pedido se copiará en el portapapeles de tu dispositivo. Por favor,
          compártelo con el vendedor en un mensaje.
        </DialogDescription>
      </DialogHeader>
      <div class="flex w-full items-center justify-end">
        <button
          class="bg-gray-100 rounded-full p-2 hover:bg-gray-200"
          @click="copyInvoiceToClipboard"
        >
          <Copy v-if="!copied" :size="15" />
          <Check v-else :size="15" />
        </button>
      </div>
      <div class="p-3 bg-gray-200 rounded-md max-h-96 overflow-scroll">
        <p class="whitespace-pre-line">
          {{ decodeUrlText(store.getCartInvoiceText()) }}
        </p>
      </div>
      <DialogFooter>
        <div class="flex flex-col gap-2 w-full">
          <button
            class="bg-green-500 text-white w-full p-2 rounded-full"
            @click="goToContacts"
          >
            Contactar Administrador
          </button>
        </div>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
