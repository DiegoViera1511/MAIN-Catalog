<script setup lang="ts">
import { ref } from 'vue';
import AdminLayout from "@/layouts/AdminLayout.vue";
import { supabase } from '@/lib/supabase';
import {Button} from "@/components/ui/button";
import {toast} from "vue-sonner";

const title = ref('');
const description = ref('');
const price = ref<number | null>(null);
const category = ref<string[]>([]);
const availableSizes = ['XS', 'S', 'M', 'L', 'XL'];
const selectedSizes = ref<string[]>([]);
const imageFile = ref<File | null>(null);
const loading = ref(false);
const message = ref('');
const fileInput = ref<HTMLInputElement | null>(null);
const imagePreview = ref<string | null>(null);

const handleFileChange = (e: Event) => {
  const files = (e.target as HTMLInputElement).files;
  if (files && files.length > 0) {
    imageFile.value = files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(files[0]);
  }
};

const triggerFileInput = () => {
  if (fileInput.value) fileInput.value.click();
};

const handleSubmit = async () => {
  if (!title.value || !description.value || !price.value || category.value.length === 0 || !imageFile.value) {
    message.value = 'Por favor, completa todos los campos.';
    return;
  }
  loading.value = true;
  message.value = '';
  try {
    // Upload image to the bucket
    const fileExt = imageFile.value.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `public/images/${fileName}`;
    const { error: uploadError } = await supabase.storage.from('Products').upload(filePath, imageFile.value);
    if (uploadError){
      console.log(uploadError);
    }
    // Get public url
    const { data } = supabase.storage.from('Products').getPublicUrl(filePath);
    const imageUrl = data.publicUrl;

    // Insert product on database
    const { error: insertError } = await supabase.from('product').insert([
      {
        url: imageUrl,
        title: title.value,
        description: description.value,
        price: price.value,
        category: category.value,
        sizes: selectedSizes.value,
        stock: 0
      }
    ]);
    if (insertError) {
      console.log(insertError);
    }
    toast.success("Producto agregado exitosamente.")
    // Clear
    title.value = '';
    description.value = '';
    price.value = null;
    category.value = [];
    selectedSizes.value = [];
    imageFile.value = null;
    imagePreview.value = null;
    if (fileInput.value) fileInput.value.value = '';
  } catch (err: any) {
    message.value = 'Error: ' + (err.message || err.error_description || 'No se pudo crear el producto.');
  } finally {
    loading.value = false;
  }
};

const labelClass = "block mb-1 font-medium dark:text-white"
const inputClass = "w-full bg-gray-200 dark:text-white dark:bg-neutral-700 rounded px-2 py-1"

</script>

<template>
<AdminLayout>
  <div class="max-w-md mx-auto">
    <h2 class="text-xl font-bold mb-4 dark:text-white">Nuevo producto</h2>
    <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
      <div>
        <label :class="labelClass">Título</label>
        <input v-model="title" :class="inputClass" required />
      </div>
      <hr class="w-full"/>
      <div>
        <label :class="labelClass">Descripción</label>
        <textarea v-model="description" :class="inputClass" required></textarea>
      </div>
      <hr class="w-full"/>
      <div>
        <label :class="labelClass">Precio</label>
        <input v-model.number="price" type="number" min="0" step="0.01" :class="inputClass" required />
      </div>
      <hr class="w-full"/>
      <div>
        <label :class="labelClass">Categoría</label>
        <div class="flex gap-4 dark:text-white">
          <label class="flex items-center gap-1">
            <input type="checkbox" value="MEN" v-model="category" class="w-6 h-6 accent-black" />
            Hombre
          </label>
          <label class="flex items-center gap-1">
            <input type="checkbox" value="WOMEN" v-model="category" class="w-6 h-6 accent-black" />
            Mujer
          </label>
          <label class="flex items-center gap-1">
            <input type="checkbox" value="ACCESSORIES" v-model="category" class="w-6 h-6 accent-black" />
            Accesorio
          </label>
        </div>
      </div>
      <hr class="w-full"/>
      <div>
        <label :class="labelClass">Tallas disponibles</label>
        <div class="flex gap-3 dark:text-white">
          <label v-for="size in availableSizes" :key="size" class="flex items-center gap-1">
            <input type="checkbox" :value="size" v-model="selectedSizes" class="w-6 h-6 accent-black" /> {{ size }}
          </label>
        </div>
      </div>
      <hr class="w-full"/>
      <label :class="labelClass">Imagen</label>
      <div class="flex flex-col gap-2 mb-4 bg-gray-200 dark:bg-neutral-700 rounded-md p-3">
        <div v-if="imagePreview" class="flex justify-center mb-2">
            <img :src="imagePreview" alt="Vista previa" class="w-[150px] h-[150px] object-cover rounded" />
        </div>
        <input
            id="image-input"
            ref="fileInput"
            type="file"
            accept="image/*"
            class="dark:text-white"
            @change="handleFileChange"
        />
        <Button type="button" @click.prevent="triggerFileInput">
          Seleccionar
        </Button>
      </div>
      <hr class="w-full"/>
      <button type="submit" :disabled="loading" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
        {{ loading ? 'Creando...' : 'Crear producto' }}
      </button>
    </form>
    <div v-if="message" class="mt-4 text-center" :class="{'text-green-600': message.includes('exitosamente'), 'text-red-600': message.includes('Error')}">
      {{ message }}
    </div>
  </div>
</AdminLayout>
</template>

<style scoped>
.max-w-md { max-width: 32rem; }
</style>