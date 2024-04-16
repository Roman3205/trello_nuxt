<template>
  <NuxtLayout name="main">
    <template #actions>
      <UButton size="xs" @click="showCreateBoard = true">Create board</UButton>
    </template>
    <div class="grid grid-cols-3 lg:grid-cols-4 gap-4">
      <BoardCard
        v-for="board in data"
        :key="board._id"
        :board="board"
        :on-edit="chooseBoard"
      />
    </div>
    <USlideover v-model="showCreateBoard">
      <OverlayHeader
        :title="overlayTitle"
        :on-click="() => (showCreateBoard = false)"
      />
      <div class="p-4">
        <FormBoard
          :type="formType"
          :initial-data="selectedBoard"
          :on-create="actionBoard"
          :on-update="
            () => {
              actionBoard();
            }
          "
        />
      </div>
    </USlideover>
  </NuxtLayout>
</template>

<script lang="ts" setup>
import type { BoardDocument } from "~/server/models/Board.model";

definePageMeta({
  middleware: "auth",
});

const overlayTitle = computed(() =>
  selectedBoard.value ? "Update board" : "Create a board"
);

const actionBoard = () => {
  refresh();
  showCreateBoard.value = false;
};

const formType = computed(() => (selectedBoard.value ? "update" : "create"));

const { data, refresh } = useFetch<BoardDocument[]>("/api/boards");

const showCreateBoard = ref<boolean>(false);

const selectedBoard = ref<BoardDocument | undefined>();

const chooseBoard = async (board: BoardDocument) => {
  selectedBoard.value = board;
  showCreateBoard.value = true;
};

watchEffect(() => {
  if (!showCreateBoard.value) {
    selectedBoard.value = undefined;
  }
});
</script>

<style></style>
