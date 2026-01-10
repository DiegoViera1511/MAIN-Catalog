<script setup lang="ts">
import {MessageCircle, Send, Instagram} from "lucide-vue-next";
import {useProductStore} from "@/store/productStore.ts";
import ContactCard from "@/views/contacts/ContactCard.vue";
import {copyTextToClipboard, decodeUrlText} from "@/lib/utils.ts";

const store = useProductStore();

</script>

<template>
  <div
      class="flex flex-col pb-1 transition-all dark:bg-neutral-900 dark:text-white px-2 duration-200 gap-4 justify-start w-full h-full items-start"
  >
    <div class="flex flex-col">
      <h1 class="font-bold text-2xl">Contactos</h1>
      <p class="text-gray-500">El pedido se copiará en el portapapeles de su dispositivo.</p>
    </div>
    <div class="flex flex-col gap-3 w-full">
      <ContactCard
          :href="`https://wa.me/5355394122?text=${store.getCartInvoiceText()}`"
          :social-network-icon="MessageCircle"
          text="Link a WhatsApp"
          identifier="+53 55394122"
          text-icon-color="text-green-500"
      />
      <ContactCard
          :href="`https://wa.me/5355206726?text=${store.getCartInvoiceText()}`"
          :social-network-icon="MessageCircle"
          text="Link a WhatsApp"
          identifier="+53 55394122"
          text-icon-color="text-green-500"
      />
      <ContactCard
          :href="`https://t.me/Rafas_mood?text=${store.getCartInvoiceText()}`"
          :social-network-icon="Send"
          text="Link a Telegram"
          identifier="@Rafas_mood"
          text-icon-color="text-cyan-500"
      />
    </div>
    <div class="flex flex-col gap-3 w-full">
      <h1 class="font-bold text-2xl">Redes Sociales</h1>
      <ContactCard
          :href="`https://www.instagram.com/m/main_activewear?igsh=OWc0MG41YmNxYWdl&utm_source=qr`"
          :social-network-icon="Instagram"
          text="Link a Instagram"
          identifier="main_activewear"
          text-icon-color="text-orange-500"
          @click="() => copyTextToClipboard(decodeUrlText(store.getCartInvoiceText()))"
      />
    </div>
  </div>
</template>