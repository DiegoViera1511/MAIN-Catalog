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
import {LoaderCircle, Trash} from "lucide-vue-next"
import { ref } from "vue";
import {toast} from "vue-sonner";
import type {ProductType} from "@/lib/types.ts";
import {deleteProductByIdService} from "@/services/product-service.ts";

const props = defineProps<{
  product: ProductType
}>()

const loading = ref(false);

const emit = defineEmits(["deleted"]);

async function handleDelete() {
  loading.value = true;
  try {
    const productDeleted = await deleteProductByIdService(props.product.id, props.product.images);
    if (!productDeleted) {
      toast.error("Error al eliminar el producto");
      return;
    }
    emit("deleted");
    toast.success("Producto eliminado");
  } catch (error) {
    console.log(error);
    toast.error("Error al eliminar el producto");
  } finally {
    loading.value = false;
  }
}

</script>

<template>
  <AlertDialog>
    <AlertDialogTrigger as-child>
      <Button class="w-20 bg-white border-2 text-red-500">
        <Trash />
      </Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>¿ Estás seguro ?</AlertDialogTitle>
        <AlertDialogDescription>
          Esta acción no se puede deshacer. Esto eliminará el producto de forma permanente.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancelar</AlertDialogCancel>
        <AlertDialogAction class="bg-red-600 hover:bg-red-700" :disabled="loading" @click="handleDelete">
          <LoaderCircle v-if="loading" class="animate-spin" />
          <span v-else>Eliminar</span>
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>