<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-vue-next'

interface ImageData {
  file: File
  preview: string
  id: string
}

const images = defineModel<ImageData[]>({ required: true })

const fileInput = ref<HTMLInputElement | null>(null)

const handleFileChange = (e: Event) => {
  const files = (e.target as HTMLInputElement).files
  if (files && files.length > 0) {
    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const preview = e.target?.result as string
        const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
        images.value.push({
          file,
          preview,
          id
        })
      }
      reader.readAsDataURL(file)
    })

    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }
}

const triggerFileInput = () => {
  if (fileInput.value) fileInput.value.click()
}

const removeImage = (imageId: string) => {
  images.value = images.value.filter(img => img.id !== imageId)
}

</script>

<template>
  <div class="flex flex-col gap-2 mb-4 bg-gray-200 dark:bg-neutral-700 rounded-md p-3">
    <div v-if="images.length > 0" class="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-2">
      <div
          v-for="image in images"
          :key="image.id"
          class="relative group"
      >
        <img
            :src="image.preview"
            alt="Vista previa"
            class="w-full h-[120px] object-cover rounded border-2 border-gray-300"
        />
        <button
            type="button"
            @click="removeImage(image.id)"
            class="absolute top-1 right-1 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-80 hover:opacity-100 transition-opacity"
            title="Eliminar imagen"
        >
          <X class="w-4 h-4"/>
        </button>
      </div>
    </div>
    <div v-else class="text-center text-gray-500 dark:text-gray-400 py-4">
      No hay imágenes seleccionadas
    </div>
    <input
        id="image-input"
        ref="fileInput"
        type="file"
        accept="image/*"
        multiple
        class="hidden"
        @change="handleFileChange"
    />
    <Button type="button" @click.prevent="triggerFileInput" class="w-full">
      Añadir más imágenes
    </Button>
    <div v-if="images.length > 0" class="text-sm text-gray-600 dark:text-gray-300 text-center">
      {{ images.length }} imagen{{ images.length !== 1 ? 'es' : '' }}
      seleccionada{{ images.length !== 1 ? 's' : '' }}
    </div>
  </div>
</template>