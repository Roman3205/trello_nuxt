<template>
  <ol v-if="data?.hits" class="grid grid-cols-4 gap-2 overflow-auto h-64 p-2">
    <li
      v-for="image in data.hits"
      :key="image.id"
      @click="$emit('update:modelValue', image.largeImageURL)"
      class="h-12 relative rounded overflow-hidden cursor-pointer outline outline-transparent focus:outline-blue-500 hover:outline-blue-500"
      :class="{
        'ring-2 ring-blue-500 shadow': modelValue === image.largeImageURL,
      }"
    >
      <NuxtImg
        :src="image.previewURL"
        class="w-full h-full absolute object-cover"
      ></NuxtImg>
    </li>
  </ol>
</template>

<script lang="ts" setup>
const {
  public: { pixabayApiKey },
} = useRuntimeConfig();

defineProps<{
  modelValue?: String;
}>();

const { data } = await useFetch<any>(
  `https://pixabay.com/api/?key=${pixabayApiKey}&image_type=photo&orientation=horizontal&per_page=32`
);

defineEmits<{
  "update:modelValue": [value: string];
}>();
</script>

<style></style>
