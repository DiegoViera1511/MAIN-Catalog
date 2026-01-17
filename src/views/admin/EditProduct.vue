<script setup lang="ts">
import {onMounted, ref} from 'vue'
import {Button} from '@/components/ui/button'
import {toast} from 'vue-sonner'
import {type ProductType} from '@/lib/types.ts'
import {LoaderCircle, X} from 'lucide-vue-next'
import {useProductStore} from "@/store/productStore.ts";
import {useRoute} from "vue-router";
import {Switch} from "@/components/ui/switch";
import LoadContainer from "@/components/LoadContainer.vue";
import {
  deleteUploadedImagesService,
  getImagePublicUrlService,
  getProductByIdService,
  updateProductService,
  uploadProductImageService
} from "@/services/product-service.ts";
import AdminInput from "@/components/admin-form-components/AdminInput.vue";
import DiscountPoster from "@/components/DiscountPoster.vue";
import CategorySelector from "@/components/admin-form-components/CategorySelector.vue";
import ColorsSelector from "@/components/admin-form-components/ColorsSelector.vue";
import SizeSelector from "@/components/admin-form-components/SizeSelector.vue";
import ProductImageViewer from "@/components/admin-form-components/ProductImageViewer.vue";
import ProductImageUploader from "@/components/admin-form-components/ProductImageUploader.vue";
import {getSupabaseFilePath} from "@/lib/utils.ts";

const productStore = useProductStore();
const route = useRoute();
const productId = parseInt(route.params.id as string, 10)

const editProduct = ref<ProductType | null>(null);
const newSelectedImages = ref<{ file: File; preview: string; id: string }[]>([])
const deleteImages = ref<string[]>([])
const loading = ref(true)
const loadingEdit = ref(false)
const openDiscountInput = ref(false)

onMounted(async () => {
  try {
    const response = productStore.getProductById(productId);
    if (!response) {
      editProduct.value = await getProductByIdService(productId)
      if (!editProduct.value) {
        toast.error('Error al cargar el producto');
        return;
      }
    } else {
      editProduct.value = response;
    }
    if (editProduct.value.discount_price) {
      openDiscountInput.value = true
    }
  } catch (error) {
    console.error('Error:', error);
    toast.error('Error al cargar el producto');
  } finally {
    loading.value = false;
  }
})

const handleSubmit = async () => {
  //Check required fields
  if (!editProduct.value) return;
  if (
      !editProduct.value.title ||
      !editProduct.value.description ||
      !editProduct.value.price ||
      editProduct.value.category.length === 0 ||
      editProduct.value.images.length === 0 &&
      newSelectedImages.value.length === 0
  ) {
    toast.error('Por favor, completa todos los campos y selecciona al menos una imagen.')
    return
  }

  if (editProduct.value.discount_price && editProduct.value.discount_price >= editProduct.value.price) {
    toast.error('El precio con descuento debe ser menor que el precio original.')
    return;
  }

  // url of images uploaded successfully
  const uploadedFilesPaths: string[] = []

  loadingEdit.value = true
  try {
    // upload all new images
    const newImagesUrls: string[] = []

    for (const imageData of newSelectedImages.value) {
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

    // Add new image urls to product images
    editProduct.value.images.push(...newImagesUrls)
    // Update product into database
    const productUpdated = await updateProductService(productId, editProduct.value)

    if (!productUpdated) {
      await deleteUploadedImagesService(uploadedFilesPaths)
      //TODO handle error and clean up uploaded images

      toast.error('Error al editar producto')
      return
    }

    // Delete removed images from storage
    await deleteUploadedImagesService(deleteImages.value)
    //TODO handle error and clean up uploaded images

    toast.success('Producto editado exitosamente.')

  } catch (err: unknown) {
    console.log('Error general:', err)
    // In case of any general error, clean up uploaded images
    await deleteUploadedImagesService(deleteImages.value)
    //TODO handle error and clean up uploaded images

    toast.error('Error al editar el producto.')
  } finally {
    loadingEdit.value = false
  }
}

const toggleAvailable = () => {
  if(!editProduct.value) return;
  editProduct.value.available = !editProduct.value.available
}

</script>

<template>
  <LoadContainer v-if="loading"/>
  <div v-else class="w-full">
    <h2 class="text-xl font-bold mb-4 dark:text-white">Editar producto</h2>
    <form v-if="editProduct" @submit.prevent="handleSubmit" class="flex flex-col gap-4">
      <div class="flex flex-row gap-2 font-medium text-black dark:text-white px-5 py-1 items-center justify-between w-full border-2 dark:bg-neutral-700 rounded-sm">
        <p>{{editProduct?.available ? 'Disponible' : 'Agotado' }}</p>
        <Switch :model-value="editProduct?.available" @update:model-value="toggleAvailable"/>
      </div>
      <hr class="w-full"/>
      <AdminInput
          v-model="editProduct!.title"
          label="Título"
          required
      />
      <hr class="w-full"/>
      <AdminInput
          v-model="editProduct!.description"
          label="Descripción"
          :multiline="true"
          required
      />
      <hr class="w-full"/>
      <AdminInput
          v-model="editProduct!.price"
          label="Precio"
          type="number"
          :min="0"
          :step="0.1"
          required
      />
      <hr class="w-full"/>
      <div class="flex flex-col" v-if="openDiscountInput">
        <div class="flex flex-row items-end justify-center w-full gap-2">
          <AdminInput
              v-model="editProduct!.discount_price"
              label="Precio con descuento"
              type="number"
              :min="0"
              :step="0.1"
          />
          <Button @click="() => {
            openDiscountInput = false;
            if (editProduct){
              editProduct.discount_price = null;
            }
          }">
            <X/>
          </Button>
        </div>
        <DiscountPoster
            v-if="editProduct.discount_price && editProduct.price"
            :large="true"
            :price="editProduct.price"
            :discount_price="editProduct.discount_price"
            cn="mt-3"
        />
      </div>
      <div v-else>
        <Button @click="() => {
            openDiscountInput = true
            if (editProduct){
              editProduct.discount_price = editProduct.price
            }
          }"
        >
          Añadir precio con descuento
        </Button>
      </div>
      <hr class="w-full"/>
      <CategorySelector v-model="editProduct!.category" />
      <hr class="w-full"/>
      <ColorsSelector v-model="editProduct!.colors"/>
      <hr class="w-full"/>
      <SizeSelector v-model="editProduct.sizes"/>
      <hr class="w-full"/>
      <ProductImageViewer
          v-model="editProduct.images"
          v-model:deleted-images="deleteImages"
      />
      <hr class="w-full"/>
      <ProductImageUploader v-model="newSelectedImages"/>
      <hr class="w-full"/>
      <Button
          type="submit"
          :disabled="loadingEdit"
          class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        <LoaderCircle v-if="loadingEdit" class="animate-spin" />
        <span v-else>Editar</span>
      </Button>
    </form>
  </div>
</template>