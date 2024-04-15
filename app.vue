<template>
  <div>
    <NuxtLayout>
      <NuxtLoadingIndicator :height="5" style="opacity: 100" />
      <NuxtPage />
      <UNotifications />
    </NuxtLayout>
  </div>
</template>

<script lang="ts" setup></script>

<style>
body {
  @apply bg-gray-100 dark:bg-gray-900;
}
</style>
