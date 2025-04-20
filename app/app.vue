<script setup lang="ts">
const config = useRuntimeConfig()

console.log(config)
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
