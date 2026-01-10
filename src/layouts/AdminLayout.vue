<script setup lang="ts">
import AdminNavbar from "@/components/AdminNavbar.vue";
import {onMounted, onUnmounted, ref} from "vue";
import {supabase} from "@/lib/supabase.ts";
import {useRouter} from "vue-router";
import {useUserAuthStore} from "@/store/authStore.ts";
import type {Subscription} from "@supabase/supabase-js";

const router = useRouter();
const authStore = useUserAuthStore();
const authListener = ref<{ subscription: Subscription } | null>(null);
const isAuth = ref(false);

onMounted(async () => {
  await checkSession();
  const {data: subscription} = supabase.auth.onAuthStateChange(async (_, session) => {
    authStore.session = session;
    if (subscription) {
      authListener.value = subscription
    }
    if (authStore.session) {
      await router.push("/admin/dashboard");
      isAuth.value = true;
    } else {
      await router.push("/admin/login");
    }
  })
})

onUnmounted(() => {
  authListener.value?.subscription.unsubscribe()
})

const checkSession = async () => {
  const {error, data} = await supabase.auth.getSession();
  if (error) throw error;
  if (data.session) {
    authStore.session = data.session;
  } else {
    await router.push("/admin/login");
  }
}

</script>

<template v-if="isAuth">
  <AdminNavbar/>
  <div class="flex flex-1 my-20 px-3 ">
    <slot/>
  </div>
</template>