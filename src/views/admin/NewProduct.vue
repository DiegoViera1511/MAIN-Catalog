<script setup lang="ts">
import {ref} from 'vue'
import {toast} from 'vue-sonner'
import {getSupabaseFilePath} from "@/lib/utils.ts";
import AdminInput from "@/components/admin-form-components/AdminInput.vue";
import CategorySelector from "@/components/admin-form-components/CategorySelector.vue";
import ColorsSelector from "@/components/admin-form-components/ColorsSelector.vue";
import SizeSelector from "@/components/admin-form-components/SizeSelector.vue";
import ProductImageUploader from "@/components/admin-form-components/ProductImageUploader.vue";
import {LoaderCircle} from "lucide-vue-next";
import {
  createProductService,
  deleteUploadedImagesService,
  getImagePublicUrlService,
  uploadProductImageService
} from "@/services/product-service.ts";

const title = ref('')
const description = ref('')
const price = ref<number | null>(null)
const category = ref<string[]>([])
const selectedSizes = ref<string[]>([])
const selectedColors = ref<string[]>([])
const selectedImages = ref<{ file: File; preview: string; id: string }[]>([])
const loading = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

const handleSubmit = async () => {
  if (
      !title.value ||
      !description.value ||
      !price.value ||
      category.value.length === 0 ||
      selectedImages.value.length === 0
  ) {
    toast.error('Por favor, completa todos los campos y selecciona al menos una imagen.')
    return
  }
  loading.value = true

  // Keep track of uploaded file paths for cleanup in case of error
  const uploadedFilesPaths: string[] = []

  try {
    const newImagesUrls: string[] = []

    for (const imageData of selectedImages.value) {
      const filePath = getSupabaseFilePath(imageData.file.name)
      const imageUploaded = await uploadProductImageService(filePath,imageData.file)
      uploadedFilesPaths.push(filePath)
      const imagePublicUrl = await getImagePublicUrlService(filePath)
      if (!imageUploaded || !imagePublicUrl) {
        toast.error('Error al subir imagen, compruebe su conexión a internet')
        // If there was an error uploading, clean up previously uploaded images
        await deleteUploadedImagesService(uploadedFilesPaths)
        //TODO handle error and clean up uploaded images

        toast.error(`Error al guardar imagen`)
        return
      }

      newImagesUrls.push(imagePublicUrl)
    }


    const productCreated = await createProductService(
        title.value,
        description.value,
        newImagesUrls,
        newImagesUrls[0],
        price.value,
        category.value,
        selectedSizes.value,
        0,
        selectedColors.value,
        true
    )

    if (!productCreated) {
      await deleteUploadedImagesService(uploadedFilesPaths)
      //TODO handle error and clean up uploaded images

      toast.error('Error al crear producto.')
      return
    }

    toast.success('Producto agregado exitosamente.')

    //Clean Form
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

    await deleteUploadedImagesService(uploadedFilesPaths)
    //TODO handle error and clean up uploaded images

    toast.error('Error al crear el producto.')
  } finally {
    loading.value = false
  }
}

</script>

<template>
  <div class="w-full">
    <h2 class="text-xl font-bold mb-4 dark:text-white">Nuevo producto</h2>
    <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
      <AdminInput
          v-model="title"
          label="Título"
          required
      />
      <hr class="w-full"/>
      <AdminInput
          v-model="description"
          label="Descripción"
          :multiline="true"
          required
      />
      <hr class="w-full"/>
      <AdminInput
          v-model="price"
          label="Precio"
          type="number"
          :min="0"
          :step="0.1"
          required
      />
      <hr class="w-full"/>
      <CategorySelector v-model="category" />
      <hr class="w-full"/>
      <ColorsSelector v-model="selectedColors"/>
      <hr class="w-full"/>
      <SizeSelector v-model="selectedSizes"/>
      <hr class="w-full"/>
      <ProductImageUploader v-model="selectedImages"/>
      <hr class="w-full"/>
      <button
          type="submit"
          :disabled="loading"
          class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        <LoaderCircle v-if="loading" class="animate-spin" />
        <span v-else>Crear producto</span>
      </button>
    </form>
  </div>
</template>
