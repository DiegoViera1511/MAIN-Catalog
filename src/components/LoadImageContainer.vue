<template>
  <div
    class="relative flex items-center justify-center bg-gray-200 w-full h-full overflow-hidden"
  >
    <!-- Logo Centrado -->
    <img
      src="/public/logo%201.png"
      alt="Cargando..."
      class="relative opacity-50 h-10"
    />

    <!-- Efecto de Destello -->
    <div
      class="absolute inset-0 bg-shine animate-slide-shine bg-[length:200%_100%]"
    ></div>
  </div>
</template>

<style>
/* Definición de la animación y el gradiente */
@keyframes slide-shine {
  0% {
    background-position: -100% 0;
  }
  100% {
    background-position: 500% 0;
  }
}
.animate-slide-shine {
  animation: slide-shine 3s ease-in-out infinite;
}
.bg-shine {
  background-image: linear-gradient(
    115deg,
    transparent 30%,
    rgba(255, 255, 255, 0.5) 50%,
    transparent 50%
  );
}
</style>
