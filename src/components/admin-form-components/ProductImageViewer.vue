<!-- src/components/admin-form-components/ProductImageViewer.vue -->
<script setup lang="ts">
import { X } from 'lucide-vue-next';
import AdminInputLabel from "@/components/admin-form-components/AdminInputLabel.vue";

const images = defineModel<string[]>({ required: true })
const deletedImages = defineModel<string[]>('deletedImages', { default: [] })

const removeImage = (imageUrl: string) => {
  images.value = images.value.filter(img => img !== imageUrl)
  deletedImages.value.push(imageUrl)
}

</script>

<template>
  <div>
    <AdminInputLabel text="Imágenes del producto" />
    <div class="flex flex-col gap-2 mb-4 bg-gray-200 dark:bg-neutral-700 rounded-md p-3">
      <div v-if="images.length > 0" class="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-2">
        <div
            v-for="(url, i) in images"
            :key="i"
            class="relative group"
        >
          <img
              :src="url"
              alt="Vista previa"
              class="w-full h-[120px] object-cover rounded border-2 border-gray-300"
          />
          <button
              type="button"
              @click="removeImage(url)"
              class="absolute top-1 right-1 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-80 hover:opacity-100 transition-opacity"
              title="Eliminar imagen"
          >
            <X class="w-4 h-4"/>
          </button>
        </div>
      </div>
      <div v-else class="text-center text-gray-500 dark:text-gray-400 py-4">
        No hay imágenes
      </div>
    </div>
  </div>
</template>