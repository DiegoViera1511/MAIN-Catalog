<script setup lang="ts">
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Trash } from "lucide-vue-next"
import { supabase } from "@/lib/supabase";
import { ref } from "vue";
import {toast} from "vue-sonner";

const props = defineProps({
  productId: {
    type: Number,
    required: true
  },
  productUrl: {
    type: String,
    required: true
  }
})

const loading = ref(false);
const error = ref("");

const emit = defineEmits(["deleted"]);

async function handleDelete() {
  loading.value = true;
  error.value = "";
  try {
    // Delete product from DB
    const { error: dbError } = await supabase
      .from("product")
      .delete()
      .eq("id", props.productId);
    if (dbError) {

    }

    let imagePath = null;
    const urlMatch = props.productUrl.match(/\/Products\/(.*)/);
    if (urlMatch && urlMatch[1]) {
      // Remove any query params
      imagePath = urlMatch[1].split("?")[0];
    }
    if (imagePath) {
      const { error: imgError } = await supabase.storage.from("Products").remove([imagePath]);
      if (imgError) {
        console.error(imgError);
      }
    }
    emit("deleted");
    toast.success("Producto eliminado");
  } catch (e: any) {
    error.value = e.message || "Error deleting product";
  } finally {
    loading.value = false;
  }
}

</script>

<template>
  <AlertDialog>
    <AlertDialogTrigger as-child>
      <Button variant="outline" class="w-[20%]">
        <Trash />
      </Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Estás seguro ?</AlertDialogTitle>
        <AlertDialogDescription>
          Esta acción no se puede deshacer. Esto eliminará el producto de forma permanente.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction class="bg-red-600 hover:bg-red-700" :disabled="loading" @click="handleDelete">
          <span v-if="loading">Eliminando...</span>
          <span v-else>Delete</span>
        </AlertDialogAction>
      </AlertDialogFooter>
      <div v-if="error" class="text-red-600 mt-2">{{ error }}</div>
    </AlertDialogContent>
  </AlertDialog>
</template>