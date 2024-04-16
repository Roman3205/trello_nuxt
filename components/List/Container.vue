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
      @sort="handleSort($event, lists)"
      class="flex gap-6 h-[80vh] overflow-x-auto"
    >
      <template #item="{ element }">
        <div class="flex">
          <ListItem :list="element" :board-id="boardId" />
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

const { handleSort } = useList(props.boardId);
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
