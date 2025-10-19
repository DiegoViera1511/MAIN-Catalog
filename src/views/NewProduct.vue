<script setup lang="ts">
import {ref} from 'vue'
import AdminLayout from '@/layouts/AdminLayout.vue'
import {supabase} from '@/lib/supabase'
import {Button} from '@/components/ui/button'
import {toast} from 'vue-sonner'
import {BgColors, Colors} from '@/types.ts'
import {Check, X} from 'lucide-vue-next'

const title = ref('')
const description = ref('')
const price = ref<number | null>(null)
const category = ref<string[]>([])
const availableSizes = ['XS', 'S', 'M', 'L', 'XL']
const selectedSizes = ref<string[]>([])
const selectedColors = ref<string[]>([])

// Cambiar para manejar múltiples imágenes
const selectedImages = ref<{ file: File; preview: string; id: string }[]>([])
const loading = ref(false)
const message = ref('')
const fileInput = ref<HTMLInputElement | null>(null)

const handleFileChange = (e: Event) => {
  const files = (e.target as HTMLInputElement).files
  if (files && files.length > 0) {
    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const preview = e.target?.result as string
        const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
        selectedImages.value.push({
          file,
          preview,
          id
        })
      }
      reader.readAsDataURL(file)
    })

    // Limpiar el input para permitir seleccionar los mismos archivos de nuevo
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }
}

const removeImage = (imageId: string) => {
  selectedImages.value = selectedImages.value.filter(img => img.id !== imageId)
}

const handleColorSelect = (color: string) => {
  if (selectedColors.value.includes(color)) {
    selectedColors.value = selectedColors.value.filter((c) => c !== color)
  } else {
    selectedColors.value.push(color)
  }
  console.log(selectedColors.value)
}

const triggerFileInput = () => {
  if (fileInput.value) fileInput.value.click()
}

const handleSubmit = async () => {
  if (
      !title.value ||
      !description.value ||
      !price.value ||
      category.value.length === 0 ||
      selectedColors.value.length === 0 ||
      selectedImages.value.length === 0
  ) {
    message.value = 'Por favor, completa todos los campos y selecciona al menos una imagen.'
    return
  }
  loading.value = true
  message.value = ''

  // Array para mantener las rutas de archivos subidos exitosamente
  const uploadedFilePaths: string[] = []

  try {
    // Subir todas las imágenes
    const imageUrls: string[] = []

    for (const imageData of selectedImages.value) {
      const fileExt = imageData.file.name.split('.').pop()
      const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`
      const filePath = `public/images/${fileName}`

      const {error: uploadError} = await supabase.storage
          .from('Products')
          .upload(filePath, imageData.file)

      if (uploadError) {
        console.log('Error al subir imagen:', uploadError)

        // Si hay error, eliminar todas las imágenes ya subidas
        if (uploadedFilePaths.length > 0) {
          console.log('Limpiando imágenes ya subidas...')
          try {
            await supabase.storage
                .from('Products')
                .remove(uploadedFilePaths)
          } catch (deleteError) {
            console.log('Error al limpiar imágenes:', deleteError)
          }
        }

        // Mostrar toast de error y salir de la función
        toast.error(`Error al subir imagen`)
        loading.value = false
        return
      }

      // Si la subida fue exitosa, agregar la ruta al array de control
      uploadedFilePaths.push(filePath)

      // Obtener URL pública
      const {data} = supabase.storage.from('Products').getPublicUrl(filePath)
      imageUrls.push(data.publicUrl)
    }

    // Insertar producto en la base de datos con múltiples URLs de imágenes
    const {error: insertError} = await supabase.from('product').insert([
      {
        title: title.value,
        description: description.value,
        images: imageUrls, // Todas las imágenes
        url: imageUrls[0], // Imagen principal (primera)
        price: price.value,
        category: category.value,
        sizes: selectedSizes.value,
        stock: 0,
        colors: selectedColors.value,
      },
    ])

    if (insertError) {
      console.log('Error al insertar producto:', insertError)

      // Si hay error al insertar el producto, también limpiar las imágenes subidas
      if (uploadedFilePaths.length > 0) {
        try {
          await supabase.storage
              .from('Products')
              .remove(uploadedFilePaths)
          console.log('Imágenes limpiadas después de error en inserción')
        } catch (deleteError) {
          console.log('Error al limpiar imágenes después de fallo en inserción:', deleteError)
        }
      }

      toast.error('Error al agregar producto')
      loading.value = false
      return
    }

    toast.success('Producto agregado exitosamente.')

    // Limpiar formulario
    title.value = ''
    description.value = ''
    price.value = null
    category.value = []
    selectedSizes.value = []
    selectedColors.value = []
    selectedImages.value = []
    if (fileInput.value) fileInput.value.value = ''
  } catch (err: unknown) {
    console.log('Error general:', err)

    // En caso de error general, también limpiar las imágenes subidas
    if (uploadedFilePaths.length > 0) {
      try {
        await supabase.storage
            .from('Products')
            .remove(uploadedFilePaths)
        console.log('Imágenes limpiadas después de error general')
      } catch (deleteError) {
        console.log('Error al limpiar imágenes después de error general:', deleteError)
      }
    }

    const errorMessage = err instanceof Error ? err.message : 'No se pudo crear el producto.'
    message.value = 'Error: ' + errorMessage
    toast.error('Error al crear el producto: ' + errorMessage)
  } finally {
    loading.value = false
  }
}

const labelClass = 'block mb-1 font-medium dark:text-white'
const inputClass = 'w-full bg-gray-200 dark:text-white dark:bg-neutral-700 rounded px-2 py-1'
</script>

<template>
  <div class="max-w-md mx-auto sm:w-[50%]">
    <h2 class="text-xl font-bold mb-4 dark:text-white">Nuevo producto</h2>
    <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
      <div>
        <label :class="labelClass">Título</label>
        <input v-model="title" :class="inputClass" required/>
      </div>
      <hr class="w-full"/>
      <div>
        <label :class="labelClass">Descripción</label>
        <textarea v-model="description" :class="inputClass" required></textarea>
      </div>
      <hr class="w-full"/>
      <div>
        <label :class="labelClass">Precio</label>
        <input
            v-model.number="price"
            type="number"
            min="0"
            step="0.01"
            :class="inputClass"
            required
        />
      </div>
      <hr class="w-full"/>
      <div>
        <label :class="labelClass">Categoría</label>
        <div class="flex gap-4 dark:text-white">
          <label class="flex items-center gap-1">
            <input type="checkbox" value="MEN" v-model="category" class="w-6 h-6 accent-black"/>
            Hombre
          </label>
          <label class="flex items-center gap-1">
            <input
                type="checkbox"
                value="WOMEN"
                v-model="category"
                class="w-6 h-6 accent-black"
            />
            Mujer
          </label>
          <label class="flex items-center gap-1">
            <input
                type="checkbox"
                value="ACCESSORIES"
                v-model="category"
                class="w-6 h-6 accent-black"
            />
            Accesorio
          </label>
        </div>
      </div>
      <hr class="w-full"/>
      <div>
        <label :class="labelClass">Colores</label>
        <div
            class="grid grid-cols-5 place-items-center w-full gap-5 p-2 border-2 rounded-xl"
        >
          <div
              v-for="(color, index) in Object.values(Colors)"
              :key="index"
              :class="`flex items-center justify-center w-10 h-10 border-2  rounded-full ${BgColors[color]} cursor-pointer`"
              @click="handleColorSelect(color)"
          >
            <input
                type="checkbox"
                :value="color"
                v-model="selectedColors"
                class="sr-only"
            />
            <template v-if="selectedColors.includes(color)">
              <Check :color="color ==='white' ? 'black' : 'white'"/>
            </template>
          </div>
        </div>
      </div>
      <hr class="w-full"/>
      <div>
        <label :class="labelClass">Tallas disponibles</label>
        <div class="flex gap-3 dark:text-white">
          <label v-for="size in availableSizes" :key="size" class="flex items-center gap-1">
            <input
                type="checkbox"
                :value="size"
                v-model="selectedSizes"
                class="w-6 h-6 accent-black"
            />
            {{ size }}
          </label>
        </div>
      </div>
      <hr class="w-full"/>
      <label :class="labelClass">Imágenes</label>
      <div class="flex flex-col gap-2 mb-4 bg-gray-200 dark:bg-neutral-700 rounded-md p-3">
        <!-- Vista previa de imágenes seleccionadas -->
        <div v-if="selectedImages.length > 0" class="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-2">
          <div
              v-for="image in selectedImages"
              :key="image.id"
              class="relative group"
          >
            <img
                :src="image.preview"
                alt="Vista previa"
                class="w-full h-[120px] object-cover rounded border-2 border-gray-300"
            />
            <!-- Botón para eliminar imagen -->
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

        <!-- Mensaje cuando no hay imágenes -->
        <div v-else class="text-center text-gray-500 dark:text-gray-400 py-4">
          No hay imágenes seleccionadas
        </div>

        <!-- Input oculto para seleccionar archivos -->
        <input
            id="image-input"
            ref="fileInput"
            type="file"
            accept="image/*"
            multiple
            class="hidden"
            @change="handleFileChange"
        />

        <!-- Botón para abrir selector de archivos -->
        <Button type="button" @click.prevent="triggerFileInput" class="w-full">
          {{ selectedImages.length > 0 ? 'Añadir más imágenes' : 'Seleccionar imágenes' }}
        </Button>

        <!-- Contador de imágenes -->
        <div v-if="selectedImages.length > 0" class="text-sm text-gray-600 dark:text-gray-300 text-center">
          {{ selectedImages.length }} imagen{{ selectedImages.length !== 1 ? 'es' : '' }}
          seleccionada{{ selectedImages.length !== 1 ? 's' : '' }}
        </div>
      </div>
      <hr class="w-full"/>
      <button
          type="submit"
          :disabled="loading"
          class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        {{ loading ? 'Creando...' : 'Crear producto' }}
      </button>
    </form>
    <div
        v-if="message"
        class="mt-4 text-center"
        :class="{
          'text-green-600': message.includes('exitosamente'),
          'text-red-600': message.includes('Error'),
        }"
    >
      {{ message }}
    </div>
  </div>
</template>

<style scoped>
.max-w-md {
  max-width: 32rem;
}
</style>
