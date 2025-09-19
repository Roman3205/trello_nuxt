<template>
  <div
    class="w-72 shadow dark:bg-gray-800 rounded-lg flex flex-col bg-white flex-none"
  >
    <div
      class="p-2 border-b list-handle dark:border-gray-700 flex items-center justify-between"
    >
      <h3 class="font-medium">
        {{ list.name }}
      </h3>
      <UDropdown :items="actions">
        <UIcon name="i-heroicons-cog-6-tooth"></UIcon>
      </UDropdown>
    </div>

    <div class="list-body p-2 flex-1 overflow-y-hidden">
      <draggable
        v-if="data"
        :list="data"
        item-key="_id"
        group="cards"
        ghost-class="ghost-card"
        :scroll-sensitivity="500"
        :force-fallback="true"
        @change="handleCardChange"
        class="p-2 space-y-2 flex-1 overflow-y-hidden"
      >
        <template #item="{ element }">
          <div>
            <ListCard @click="handleCardUpdate(element)" :card="element" />
          </div>
        </template>
      </draggable>
    </div>
    <div class="p-1 border-t dark:border-gray-700 flex items-center">
      <UButton block @click="showCardCreate = true">Add card</UButton>
    </div>
    <Teleport to="body">
      <UModal v-model="showCardCreate">
        <UCard>
          <OverlayHeader
            :on-click="
              () => {
                showCardCreate = false;
              }
            "
            :title="overlayTitle"
          ></OverlayHeader>
          <div class="p-2">
            <FormCard
              :type="selectedCard ? 'update' : 'create'"
              :list-id="props.list._id"
              :initial-data="selectedCard"
              :on-create="
                () => {
                  actionCard();
                }
              "
              :on-update="
                () => {
                  actionCard();
                }
              "
            />
          </div>
        </UCard>
      </UModal>
    </Teleport>
  </div>
</template>

<script lang="ts" setup>
import type { CardDocument } from "~/server/models/Card.model";
import type { ListDocument } from "~/server/models/List.model";

import draggable from "vuedraggable";

interface Props {
  list: ListDocument;
  boardId: string;
}

const props = defineProps<Props>();

const showCardCreate = ref<boolean>(false);
const selectedCard = ref<CardDocument | undefined>();

const overlayTitle = computed(() =>
  selectedCard.value ? "Update card" : "Create a card"
);

const { destroy, update: updateList } = useList(props.boardId);

const refreshBoard = inject("refresh-board") as () => void;

const actions = ref([
  [
    {
      label: "Add card",
      icon: "i-heroicons-plus-circle",
      click: () => {
        showCardCreate.value = true;
      },
    },
  ],
  [
    {
      label: "Delete",
      icon: "i-heroicons-trash",
      click: () => {
        destroy(props.list._id);
        refreshBoard();
      },
    },
  ],
]);

const actionCard = () => {
  refresh();
  showCardCreate.value = false;
};

const handleCardUpdate = (card: CardDocument) => {
  showCardCreate.value = true;
  selectedCard.value = card;
};

watchEffect(() => {
  if (!showCardCreate.value) {
    selectedCard.value = undefined;
  }
});

const { update: updateCard } = useCard();
const handleCardChange = async (e: any) => {
  try {
    if (e.added) {
      const { element: card } = e.added;
      await updateCard(card.list, card._id, {
        list: props.list._id,
      });
    }

    await updateList(props.list._id, {
      cards: data.value?.flatMap((item) => item._id),
    });
  } catch (e) {
    return e;
  }
};

const { data, refresh } = useFetch<CardDocument[]>(
  `/api/lists/${props.list._id}/cards`
);
</script>

<style scoped>
.ghost-card {
  @apply bg-gray-100 dark:bg-gray-700 rounded-lg;
}

.ghost-card > div {
  @apply invisible;
}
</style>
