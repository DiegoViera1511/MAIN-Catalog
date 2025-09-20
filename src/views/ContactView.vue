<script setup lang="ts">
import StoreLayout from "@/layouts/StoreLayout.vue";
import {MessageCircle,Send,Instagram} from "lucide-vue-next";
</script>

<template>
  <StoreLayout :show-footer="false">
    <div
        class="flex flex-col transition-all dark:bg-neutral-900 dark:text-white px-4 duration-200 gap-4 justify-start w-full h-full items-start"
    >
      <h1 class="font-bold text-2xl">Contactos</h1>
      <div class="flex flex-col gap-3 w-full">
        <a
            href="https://wa.me/5355394122"
            target="_blank"
            rel="noopener noreferrer"
        >
          <div class="flex flex-row gap-2 shadow items-center justify-start text-lg border-2 dark:border-gray-600 p-4 rounded-lg hover:shadow-md w-full">
            <MessageCircle class="text-green-500"/>
            <p class="font-medium text-xl">+53 5539 4122</p>
          </div>
        </a>
        <a
            href="https://t.me/Rafas_mood"
            target="_blank"
            rel="noopener noreferrer"
        >
          <div class="flex flex-row gap-2 shadow items-center justify-start text-lg border-2 dark:border-gray-600 p-4 rounded-lg hover:shadow-md w-full">
            <Send class="text-cyan-500"/>
            <p class="font-medium text-xl">@Rafas_mood</p>
          </div>
        </a>
        <a
            href="https://www.instagram.com/main_activewear?igsh=OWc0MG41YmNxYWdl&utm_source=qr"
            target="_blank"
            rel="noopener noreferrer"
        >
          <div class="flex flex-row gap-2 shadow items-center justify-start text-lg border-2 dark:border-gray-600 p-4 rounded-lg hover:shadow-md w-full">
            <Instagram class="text-orange-500"/>
            <p class="font-medium text-xl">main_activewear</p>
          </div>
        </a>

      </div>
    </div>
  </StoreLayout>
</template>

<style scoped>

</style>