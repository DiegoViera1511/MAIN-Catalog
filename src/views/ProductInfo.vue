<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import {BgColors, SpanishColors, type CartProduct, Colors, type ProductType} from "../lib/types.ts";
import {useProductStore} from "../store/productStore.ts";
import {useRoute} from "vue-router";
import {Check, Share} from "lucide-vue-next"
import {Button} from "@/components/ui/button";
import {toast} from "vue-sonner";
import Carousel from "@/components/Carousel.vue";
import ProductImage from "@/components/ProductImage.vue";
import {getProductByIdService} from "@/services/product-service.ts";
import {sleep} from "@/lib/utils.ts";
import DiscountPoster from "@/components/DiscountPoster.vue";
import LoadContainer from "@/components/LoadContainer.vue";

const product = ref<ProductType | null>(null)
const productStore = useProductStore()
const selectedSize = ref<number>(0)
const selectedColor = ref<string>("")
const checkColor = computed(() => selectedColor.value)
const quantity = ref<number>(1)
const loading = ref<boolean>(true)
const copied = ref<boolean>(false)
const route = useRoute()

onMounted(async () => {
  const productId = parseInt(route.params.id as string, 10);
  await fetchProduct(productId);
})

async function fetchProduct(id: number) {
  try {
    const response = productStore.getProductById(id);
    if (!response) {
      loading.value = true;
      product.value = await getProductByIdService(id)
    } else {
      product.value = response;
    }
    selectedColor.value = product.value?.colors[0] || "";
  } catch (error) {
    console.error('Error:', error);
    toast.error('Error al cargar el producto');
  } finally {
    loading.value = false;
  }
}

function onCopy() {
  copied.value = true;
  sleep(3000).then(() => {
    copied.value = false;
  });
}

function copyPathToClipboard() {
  const url = window.location.href
  navigator.clipboard.writeText(url)
  toast.success(`Link copiado al portapapeles`, {
    duration: 2000,
  });
  onCopy()
}

function addProductToCart() {
  const store = useProductStore()
  if (!product.value) return;
  const cartProduct: CartProduct = {
    id: product.value.id,
    url: product.value.url,
    title: product.value.title,
    price: product.value.price,
    discount_price: product.value.discount_price,
    selectedSize: product.value.sizes[selectedSize.value],
    quantity: quantity.value,
    selectedColor: selectedColor.value || "",
  };
  store.addToCart(cartProduct);
  toast.success(`Añadido al pedido`, {
    duration: 2000,
  });
}

function handleColorChange(color: string) {
  selectedColor.value = color;
}

</script>

<template>
  <LoadContainer v-if="loading" />
  <!-- Product content -->
  <div v-else-if="product" class="flex flex-1 flex-col items-center justify-center gap-4 min-w-full sm:w-fit">
    <div
        v-if="product.images.length === 1"
        class="flex items-center justify-center w-full"
    >
      <div class="flex items-center justify-center w-full sm:w-[400px]">
        <ProductImage :image-src="product.url" />
      </div>
    </div>
    <div v-else class="flex items-center justify-center w-full">
      <Carousel :images="product.images"/>
    </div>
    <div class="flex flex-col gap-4 w-full px-4 sm:w-fit">
      <div class="flex flex-col gap-2">
        <div class="flex flex-row justify-between items-center gap-2">
          <h1 class="font-bold text-xl flex-1  max-w-[80%] overflow-ellipsis  break-words">
            {{ product.title }}
          </h1>
          <button
              class="flex items-center cursor-pointer dark:bg-white dark:text-black justify-center flex-shrink-0 bg-gray-200 p-2 rounded-full"
              @click="copyPathToClipboard"
          >
            <Share :size="20" />
          </button>
        </div>
        <span class="text-md text-gray-500 font-medium sm:w-[600px]">{{ product.description }}</span>
        <div>
          <span
              v-if="product.discount_price"
              class="text-md font-bold"
          >
            ${{ product.discount_price }}
          </span>
          <span
              class="text-md font-bold"
              :class="product.discount_price ? 'line-through text-red-700 ml-2' : ''"
          >
            ${{ product.price }}
          </span>
        </div>
        <DiscountPoster
            v-if="product.discount_price"
            :price="product.price"
            :discount_price="product.discount_price"
            :large="true"
        />
      </div>
      <hr class="w-full">
      <div
          v-if="product.colors.length > 0"
          class="grid grid-cols-5 sm:w-1/2"
      >
        <div
            v-for="(color , index) in product.colors"
            :key="index"
            :class="`flex items-center justify-center p-3 border-3 border-gray-400 cursor-pointer ${checkColor === color ? 'border-5 border-gray-700 dark:border-white' : ''}  ${BgColors[color as Colors]}`"
            @click="handleColorChange(color)"
        >
          <Check v-if="checkColor === color" :color="color === 'white' ? 'black' : 'white'"/>
        </div>
      </div>
      <p v-if="product.colors.length > 0" class="text-md text-gray-500 font-medium">{{ SpanishColors[checkColor as Colors]}}</p>
      <hr v-if="product.colors.length > 0" class="w-full">
      <p v-if="product.sizes.length > 0" class="text-md text-gray-500 font-medium">Seleccione una talla</p>
      <div v-if="product.sizes.length > 0" class="grid grid-cols-5 sm:w-1/2">
        <div
            v-for="(size, index) in product.sizes"
            :key="index"
            class="flex border-3 font-medium items-center justify-center p-3 cursor-pointer"
            :class="selectedSize === index ? 'border-gray-700 text-black dark:text-white border-5 dark:border-white' : 'border-gray-400 text-gray-400'"
            @click="() => selectedSize = index"
        >
          {{ size }}
        </div>
      </div>
      <div class="flex sticky bottom-5 top-auto items-center justify-center w-full">
        <Button
            class="bg-black w-full sm:w-[40%] dark:bg-white text-white dark:text-black hover:bg-gray-200 flex items-center justify-center font-medium p-5 mt-4 rounded-full"
            @click="addProductToCart"
            :disabled="!product.available"
        >
          <p>{{ product.available ? 'Añadir al Pedido' : 'Agotado' }}</p>
        </Button>
      </div>
    </div>
  </div>
  <!-- Product not found -->
  <div v-else>
    <p class="font-medium text-gray-500">Producto no encontrado.</p>
  </div>
</template>
