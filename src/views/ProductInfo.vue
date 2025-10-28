<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import {BgColors, type CartProduct, Colors, type ProductType} from "../types.ts";
import {useProductStore} from "../store/productStore.ts";
import {useRoute} from "vue-router";
import {Plus, Minus, Check, LoaderCircle} from "lucide-vue-next"
import {Button} from "@/components/ui/button";
import {toast} from "vue-sonner";
import Carousel from "@/components/Carousel.vue";
import {supabase} from "@/lib/supabase.ts";

const product = ref<ProductType | undefined>(undefined)
const productStore = useProductStore()
const selectedSize = ref<number>(0)
const selectedColor = ref<string>("")
const checkColor = computed(() => selectedColor.value)
const quantity = ref<number>(1)
const loading = ref<boolean>(true)
const route = useRoute()

async function fetchProduct(id: number) {
  try {
    const response = productStore.getProductById(id);
    if (!response) {
      loading.value = true;
      const {data, error} = await supabase
          .from('product')
          .select('*')
          .eq('id', id)
          .single();
      if (error) {
        console.error('Error fetching product:', error);
        toast.error('Error al cargar el producto');
        return;
      }
      product.value = data as ProductType
    } else {
      product.value = response ;
    }
    selectedColor.value = product.value?.colors[0] || "";
  } catch (error) {
    console.error('Error:', error);
    toast.error('Error al cargar el producto');
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  const productId = parseInt(route.params.id as string, 10);
  await fetchProduct(productId);
})

function addProductToCart() {
  const store = useProductStore()
  if (!product.value) return;
  const cartProduct: CartProduct = {
    id: product.value.id,
    url: product.value.url,
    title: product.value.title,
    price: product.value.price,
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
  <div class="flex justify-center dark:text-white p-4 items-start w-full">
    <div v-if="loading" class="flex justify-center w-full items-center h-52">
      <div class="flex dark:text-white items-center justify-center  w-full">
        <LoaderCircle class="animate-spin" :size="50"/>
      </div>
    </div>
    <!-- Product content -->
    <div v-else-if="product" class="flex flex-col gap-4">
      <div
          v-if="product.images.length === 1"
          class="flex items-center justify-center w-full"
      >
        <div
            class="flex bg-gray-100 w-full sm:w-[400px]"
        >
          <img loading="lazy" class="object-cover" :src="product.url" alt="product image"/>
        </div>
      </div>
      <div v-else class="flex items-center justify-center w-full">
        <div class="bg-gray-100 w-fit">
          <Carousel :images="product.images"/>
        </div>
      </div>
      <h1 class="font-bold text-xl">{{ product.title }}</h1>
      <p class="text-xl font-medium">Precio: {{ product.price }} $</p>
      <p class="text-xl font-medium sm:w-[600px]">{{ product.description }}</p>
      <hr class="w-full">
      <p class="text-xl font-medium">Color: {{ checkColor }}</p>
      <div
          class="grid grid-cols-5 place-items-center w-full gap-5 p-2"
      >
        <div
            v-for="(color , index) in product.colors"
            :key="index"
            :class="`flex items-center justify-center w-10 h-10 border-2  rounded-full ${BgColors[color as Colors]} cursor-pointer`"
            @click="handleColorChange(color)"
        >
          <Check v-if="checkColor === color" :color="color === 'white' ? 'black' : 'white'"/>
        </div>
      </div>
      <div class="flex flex-col w-full sm:items-center sm:justify-between sm:flex-row gap-4">
        <div v-if="product.sizes.length > 0" class="grid grid-cols-5 sm:w-1/2">
          <div
              v-for="(size, index) in product.sizes"
              :key="index"
              class="flex border-3 font-medium items-center justify-center p-3"
              :class="selectedSize === index ? 'border-sky-500 text-sky-500 dark:text-sky-700 dark:border-sky-700' : 'border-gray-300'"
              @click="() => selectedSize = index"
          >
            {{ size }}
          </div>
        </div>
        <div
            class="flex flex-row items-center cursor-pointer border-2 gap-4 border-gray-200 rounded-full justify-center w-fit">
          <button class="flex items-center dark:hover:text-black hover:bg-gray-100 justify-center rounded-full p-4"
                  @click="() => quantity++"
          >
            <Plus/>
          </button>
          <span class="font-bold text-lg">{{ quantity }}</span>
          <button class="flex items-center dark:hover:text-black hover:bg-gray-100 justify-center rounded-full p-4"
                  @click="() => {
                   if( quantity > 1 ) quantity--
                  }"
          >
            <Minus :class="quantity == 1 ? 'text-gray-300' : ''"/>
          </button>
        </div>
      </div>
      <div class="flex items-center justify-center w-full">
        <Button
            class="bg-black w-full sm:w-[40%] dark:bg-white text-white dark:text-black hover:bg-gray-200 flex items-center justify-center font-medium p-5 mt-4 rounded-full"
            @click="addProductToCart"
            :disabled="!product.available"
        >
          <p>{{product.available ? 'Añadir al Pedido' : 'Agotado'}}</p>
        </Button>
      </div>
    </div>

    <!-- Product not found -->
    <div v-else>
      <p class="font-medium">Producto no encontrado.</p>
    </div>
  </div>
</template>
