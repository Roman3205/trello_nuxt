<template>
  <div
    class="p-1 border bg-white dark:bg-gray-700 text-sm cursor-grab shadow rounded-lg dark:border-gray-700"
  >
    {{ card.title }}
  </div>
</template>

<script lang="ts" setup>
import type { CardDocument } from "~/server/models/Card.model";

defineProps<{
  card: CardDocument;
}>();
</script>

<style></style>
