<script setup lang="ts">
  import {Instagram,MessageCircle} from "lucide-vue-next";
</script>

<template>
  <div class="flex flex-col items-center justify-center dark:bg-neutral-900 dark:border-b-gray-950 dark:text-white p-2 py-6 px-4 w-full gap-4 bg-gray-100">
    <p>Contáctanos para más información</p>
    <div class="flex flex-row items-center justify-center gap-4">
      <a
          href="https://www.instagram.com/main_activewear?igsh=OWc0MG41YmNxYWdl&utm_source=qr"
          target="_blank"
          rel="noopener noreferrer"
      >
        <Instagram class="cursor-pointer hover:text-orange-400"/>
      </a>
      <a
          href="https://wa.me/5355394122"
          target="_blank"
          rel="noopener noreferrer"
      >
        <MessageCircle class="cursor-pointer hover:text-green-600"/>
      </a>
    </div>
  </div>
</template>