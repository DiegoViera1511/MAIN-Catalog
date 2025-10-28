<script setup lang="ts">
import {onMounted, ref} from 'vue'
import {supabase} from '@/lib/supabase.ts'
import {Button} from '@/components/ui/button'
import {toast} from 'vue-sonner'
import {BgColors, Colors, type ProductType} from '@/types.ts'
import {Check, LoaderCircle, X} from 'lucide-vue-next'
import {useProductStore} from "@/store/productStore.ts";
import {useRoute} from "vue-router";
import {Switch} from "@/components/ui/switch";

const title = ref('')
const description = ref('')
const price = ref<number | null>(null)
const category = ref<string[]>([])
const availableSizes = ['XS', 'S', 'M', 'L', 'XL']
const selectedSizes = ref<string[]>([])
const selectedColors = ref<string[]>([])
const productStore = useProductStore();
const route = useRoute();
const productId = parseInt(route.params.id as string, 10)
const newSelectedImages = ref<{ file: File; preview: string; id: string }[]>([])
const selectedImages = ref<string[]>([])
const deleteImages = ref<string[]>([])
const loading = ref(false)
const loadingProductInfo = ref(false)
const message = ref('')
const fileInput = ref<HTMLInputElement | null>(null)
const productAvailable = ref<boolean>(false)

onMounted(async () => {
  try {
    const response = productStore.getProductById(productId);
    loadingProductInfo.value = true
    if (!response) {
      loading.value = true;
      const {data, error} = await supabase
          .from('product')
          .select('*')
          .eq('id', productId)
          .single();
      if (error) {
        console.error('Error fetching product:', error);
        toast.error('Error al cargar el producto');
        return;
      }
      const product = data as ProductType
      title.value = product.title
      description.value = product.description
      price.value = product.price
      category.value = product.category
      selectedSizes.value = product.sizes
      selectedColors.value = product.colors
      selectedImages.value = product.images || []
      productAvailable.value = product.available
    } else {
      title.value = response.title
      description.value = response.description
      price.value = response.price
      category.value = response.category
      selectedSizes.value = response.sizes
      selectedColors.value = response.colors
      selectedImages.value = response.images || []
      productAvailable.value = response.available
    }
  } catch (error) {
    console.error('Error:', error);
    toast.error('Error al cargar el producto');
  } finally {
    loading.value = false;
    loadingProductInfo.value = false;
  }
})

const handleFileChange = (e: Event) => {
  const files = (e.target as HTMLInputElement).files
  if (files && files.length > 0) {
    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const preview = e.target?.result as string
        const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
        newSelectedImages.value.push({
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

const removeNewImage = (imageId: string) => {
  newSelectedImages.value = newSelectedImages.value.filter(img => img.id !== imageId)
}

const removeImage = (imageUrl: string) => {
  selectedImages.value = selectedImages.value.filter(img => img !== imageUrl)
  deleteImages.value.push(imageUrl)
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
  //Check required fields
  if (
      !title.value ||
      !description.value ||
      !price.value ||
      category.value.length === 0 ||
      selectedColors.value.length === 0 ||
      selectedImages.value.length === 0 && newSelectedImages.value.length === 0
  ) {
    message.value = 'Por favor, completa todos los campos y selecciona al menos una imagen.'
    return
  }

  loading.value = true
  message.value = ''

  // url of images uploaded successfully
  const uploadedFilePaths: string[] = []

  try {
    // upload all new images
    const imageUrls: string[] = selectedImages.value

    for (const imageData of newSelectedImages.value) {
      const fileExt = imageData.file.name.split('.').pop()
      const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`
      const filePath = `public/images/${fileName}`

      const {error: uploadError} = await supabase.storage
          .from('Products')
          .upload(filePath, imageData.file)

      if (uploadError) {
        console.log('Error al subir imagen:', uploadError)

        // If there was an error uploading, clean up previously uploaded images
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

        toast.error(`Error al subir imagen`)
        loading.value = false
        return
      }

      // if upload successful, store the file path
      uploadedFilePaths.push(filePath)

      // Obtain public URL
      const {data} = supabase.storage.from('Products').getPublicUrl(filePath)
      imageUrls.push(data.publicUrl)
    }

    // Update product into database
    const {error: insertError} = await supabase.from('product').update([
      {
        title: title.value,
        description: description.value,
        images: imageUrls, // All images
        url: imageUrls[0], // Primary image
        price: price.value,
        category: category.value,
        sizes: selectedSizes.value,
        stock: 0,
        colors: selectedColors.value,
        available: productAvailable.value
      },
    ]).eq('id', productId)

    if (insertError) {
      console.log('Error al editar producto:', insertError)
      // In case of insertion error, clean up uploaded images
      if (uploadedFilePaths.length > 0) {
        try {
          await supabase.storage
              .from('Products')
              .remove(uploadedFilePaths)
          console.log('Imágenes limpiadas después de error en edición')
        } catch (deleteError) {
          console.log('Error al limpiar imágenes después de fallo en editar:', deleteError)
        }
      }

      toast.error('Error al editar producto')
      loading.value = false
      return
    }

    // Delete removed images from storage
    if (deleteImages.value.length > 0) {
      try {
        await supabase.storage
            .from('Products')
            .remove(deleteImages.value)
      } catch (deleteError) {
        console.log('Error al eliminar imágenes del storage:', deleteError)
      }
    }

    toast.success('Producto editado exitosamente.')

  } catch (err: unknown) {
    console.log('Error general:', err)
    // In case of any general error, clean up uploaded images
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

    const errorMessage = err instanceof Error ? err.message : 'No se pudo editar el producto.'
    message.value = 'Error: ' + errorMessage
    toast.error('Error al editar el producto: ' + errorMessage)
  } finally {
    loading.value = false
  }
}

const toggleAvailable = () => {
  productAvailable.value = !productAvailable.value
}

const labelClass = 'block mb-1 font-medium dark:text-white'
const inputClass = 'w-full bg-gray-200 dark:text-white dark:bg-neutral-700 rounded px-2 py-1'
</script>

<template>
  <div v-if="loadingProductInfo" class="flex justify-center w-full items-center h-52">
    <div class="flex dark:text-white items-center justify-center w-full">
      <LoaderCircle class="animate-spin" :size="50"/>
    </div>
  </div>
  <div v-else class="max-w-md mx-auto sm:w-[50%]">
    <h2 class="text-xl font-bold mb-4 dark:text-white">Editar producto</h2>
    <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
      <div class="flex flex-row gap-2 text-black dark:text-white px-2 py-1 items-center justify-between w-full bg-neutral-700 rounded-sm">
        <Switch :model-value="productAvailable" @update:model-value="toggleAvailable"/>
        <p>{{productAvailable ? 'Disponible' : 'Agotado' }}</p>
      </div>
      <hr class="w-full"/>
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
        <div v-if="selectedImages.length > 0" class="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-2">
          <div
              v-for="(url,i) in selectedImages"
              :key="i"
              class="relative group"
          >
            <img
                :src="url"
                alt="Vista previa"
                class="w-full h-[120px] object-cover rounded border-2 border-gray-300"
            />
            <!-- Botón para eliminar imagen -->
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
      </div>
      <hr class="w-full"/>
      <label :class="labelClass">Añadir Imágenes</label>
      <div class="flex flex-col gap-2 mb-4 bg-gray-200 dark:bg-neutral-700 rounded-md p-3">
        <!-- Vista previa de imágenes seleccionadas -->
        <div v-if="newSelectedImages.length > 0" class="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-2">
          <div
              v-for="image in newSelectedImages"
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
                @click="removeNewImage(image.id)"
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
          Añadir más imágenes
        </Button>

        <!-- Contador de imágenes -->
        <div v-if="newSelectedImages.length > 0" class="text-sm text-gray-600 dark:text-gray-300 text-center">
          {{ newSelectedImages.length }} imagen{{ newSelectedImages.length !== 1 ? 'es' : '' }}
          seleccionada{{ newSelectedImages.length !== 1 ? 's' : '' }}
        </div>
      </div>
      <hr class="w-full"/>
      <button
          type="submit"
          :disabled="loading"
          class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        {{ loading ? 'Editando...' : 'Editar producto' }}
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
