<template>
  <UForm
    :state="form"
    :schema="listSchema"
    @submit="handleForm"
    class="flex flex-col gap-4"
  >
    <UFormGroup name="name" label="Name">
      <UInput v-model="form.name" />
    </UFormGroup>
    <UButton
      block
      type="submit"
      :loading="blockButton"
      :disabled="blockButton"
      >{{ submitText }}</UButton
    >
  </UForm>
</template>

<script lang="ts" setup>
import type { FormSubmitEvent } from "@nuxt/ui/dist/runtime/types";

import type { z } from "zod";
import listSchema from "~/schemas/listSchema";
import type { ListDocument } from "~/server/models/List.model";

interface Props {
  type?: "create" | "update";
  initialData?: ListDocument;
  boardId: string;
  onCreate?: () => void;
  onUpdate?: () => void;
}

const props = withDefaults(defineProps<Props>(), {
  type: "create",
});

const submitText = computed(() =>
  props.type === "create" ? "Create list" : "Update list"
);

const form = reactive<Partial<ListDocument>>({
  name: undefined,
  board: props.boardId,
});

const blockButton = ref<boolean>(false);

watchEffect(() => {
  if (props.type === "update" && props.initialData) {
    form.name = props.initialData.name;
    form.board = props.initialData.board;
  }
});

const handleForm = async (
  event: FormSubmitEvent<z.output<typeof listSchema>>
) => {
  try {
    blockButton.value = true;

    if (props.type === "update") {
      await $fetch(`/api/lists/${props.initialData?._id}`, {
        method: "PUT",
        body: event.data,
      });

      props.onUpdate?.();
      useToast().add({
        title: "Boards updated",
      });
      return;
    }

    await $fetch("/api/lists", {
      method: "post",
      body: event.data,
    });

    props.onCreate?.();

    useToast().add({
      title: "Boards updated",
    });
  } catch (e) {
  } finally {
    blockButton.value = false;
  }
};
</script>

<style></style>
