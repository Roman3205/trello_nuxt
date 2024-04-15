<template>
  <div>
    <draggable
      :list="lists"
      item-key="_id"
      group="lists"
      handle=".list-handle"
      :scroll-sensitivity="500"
      :force-fallback="true"
      ghost-class="ghost-board"
      drag-class="dragging-board"
      tag="ul"
      @sort="handleSort"
      class="flex gap-6 h-[80vh] overflow-x-auto"
    >
      <template #item="{ element }">
        <div class="flex">
          <div
            class="w-72 shadow dark:bg-gray-800 rounded-lg flex flex-col bg-white flex-none"
          >
            <div
              class="p-2 border-b list-handle dark:border-gray-700 flex items-center justify-between"
            >
              <h3 class="font-medium">
                {{ element.name }}
              </h3>
              <UDropdown :items="actions">
                <UIcon name="i-heroicons-cog-6-tooth"></UIcon>
              </UDropdown>
            </div>

            <div class="list-body p-2 flex-1 overflow-y-hidden"></div>
            <div class="p-1 border-t dark:border-gray-700 flex items-center">
              <UButton block>Add card</UButton>
            </div>
          </div>
        </div>
      </template>
    </draggable>
  </div>
</template>

<script lang="ts" setup>
import draggable from "vuedraggable";
import type { ListDocument } from "~/server/models/List.model";
interface Props {
  lists: ListDocument[];
  boardId: string;
}

const props = defineProps<Props>();

const handleSort = async (e: any) => {
  await $fetch(`/api/boards/${props.boardId}`, {
    method: "PUT",
    body: {
      lists: props.lists.flatMap((item) => item._id),
    },
  });
};

const actions = ref([
  [
    {
      label: "Add card",
      icon: "i-heroicons-plus-circle",
    },
  ],
  [
    {
      label: "Delete",
      icon: "i-heroicons-trash",
    },
  ],
]);
</script>

<style>
.ghost-board div {
  @apply opacity-50;
}
.ghost-board > div > div {
  @apply invisible;
}
.dragging-board {
  @apply shadow-2xl transform rotate-2 cursor-grabbing;
}
.sortable-chosen {
  opacity: 1 !important;
}
</style>
