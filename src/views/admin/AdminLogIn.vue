<script setup lang="ts">
import {ref} from 'vue'
import BaseInput from "@/components/BaseInput.vue";
import {toast} from "vue-sonner";
import {useRouter} from "vue-router";
import {Button} from "@/components/ui/button";
import {supabase} from "@/lib/supabase.ts";
import {Routes} from "@/lib/routes.ts";
import {LoaderCircle} from "lucide-vue-next";

const email = ref('')
const password = ref('')
const router = useRouter();
const loading = ref(false);

async function login() {
  try {
    loading.value = true;
    let { error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    })
    if (error) {
      console.log(error)
      toast.error("Error al iniciar sesión")
    } else {
      router.push(Routes.ADMIN_DASHBOARD).then(() => {
        toast.success("Inicio de sesión exitoso")
      });
    }
  } catch (error) {
    loading.value = false;
    console.log(error)
  }
}

</script>

<template>
  <div class="flex flex-col items-center justify-center w-full">
    <div class="flex flex-col gap-2 w-[90%] sm:w-[50%] md:w-[40%] lg:w-[30%] py-2 px-5 rounded-lg">
      <form @submit.prevent="login">
        <div class="mb-4">
          <BaseInput
              label="Correo"
              v-model="email"
              type="email"
              placeholder="Ingresa tu correo"
          />
        </div>
        <div class="mb-6">
          <BaseInput
              label="Contraseña"
              v-model="password"
              type="password"
              placeholder="Ingresa tu contraseña"
          />
        </div>
        <div class="flex items-center justify-center w-full">
          <Button class="bg-black hover:bg-gray-900 text-white w-full sm:w-[40%] dark:text-black dark:bg-white dark:hover:bg-gray-200 flex items-center justify-center font-medium p-5 mt-4 rounded-full"
                  type="submit"
          >
            <LoaderCircle v-if="loading" class="animate-spin" />
            <span v-else>Iniciar Sesión</span>
          </Button>
        </div>
      </form>
    </div>
  </div>
</template>