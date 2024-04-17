<template>
  <NuxtLayout
    name="main"
    v-if="data"
    class="h-screen"
    :style="{
      backgroundImage: `url(${data.coverImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }"
  >
    <template #actions>
      <UButton size="xs" @click="showListCreate = true">Create list</UButton>
    </template>
    <h1 class="text-3xl font-semibold mb-4 inline-block">{{ data.name }}</h1>

    <ListContainer :lists="data.lists" :board-id="boardId.toString()" />
    <USlideover v-model="showListCreate">
      <OverlayHeader
        :on-click="() => (showListCreate = false)"
        :title="selectedList ? 'Update list' : 'Create list'"
      ></OverlayHeader>
      <div class="p-4">
        <ListForm
          :type="selectedList ? 'update' : 'create'"
          :initial-data="selectedList"
          :board-id="boardId.toString()"
          :on-create="actionBoard"
        ></ListForm>
      </div>
    </USlideover>
  </NuxtLayout>
</template>

<script lang="ts" setup>
import type { BoardDocument } from "~/server/models/Board.model";
import type { ListDocument } from "~/server/models/List.model";

const { boardId } = useRoute().params;
// setPageLayout("main");

const { data, refresh } = await useFetch<BoardDocument>(
  `/api/boards/${boardId}`,
  {
    method: "get",
  }
);

if (!data.value) {
  throw createError({
    statusCode: 404,
    message: "Board not found",
  });
}

useHead({
  title: data.value.name,
  titleTemplate: "%s - Boards",
});

const actionBoard = () => {
  refresh();
  showListCreate.value = false;
};

provide("refresh-board", refresh);

const selectedList = ref<ListDocument | undefined>();
const showListCreate = ref<boolean>(false);
</script>

<style></style>
