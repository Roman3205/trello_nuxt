<template>
  <UForm
    :state="form"
    :schema="boardSchema"
    @submit="handleForm"
    class="flex flex-col gap-4"
  >
    <UFormGroup name="name" label="Name">
      <UInput v-model="form.name" />
    </UFormGroup>
    <UFormGroup name="coverImage" label="Cover Image">
      <ImagePicker v-model="form.coverImage" />
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
import boardSchema from "~/schemas/boardSchema";
import type { BoardDocument } from "~/server/models/Board.model";

interface Props {
  type?: "create" | "update";
  initialData?: BoardDocument;
  onCreate?: () => void;
  onUpdate?: () => void;
}

const props = withDefaults(defineProps<Props>(), {
  type: "create",
});

const submitText = computed(() =>
  props.type === "create" ? "Create Board" : "Update Board"
);

const form = reactive<Partial<BoardDocument>>({
  name: undefined,
  coverImage: undefined,
});

const blockButton = ref<boolean>(false);

watchEffect(() => {
  if (props.type === "update" && props.initialData) {
    form.name = props.initialData.name;
    form.coverImage = props.initialData.coverImage;
  }
});

const handleForm = async (
  event: FormSubmitEvent<z.output<typeof boardSchema>>
) => {
  try {
    blockButton.value = true;

    if (props.type === "update") {
      await $fetch(`/api/boards/${props.initialData?._id}`, {
        method: "PUT",
        body: event.data,
      });

      props.onUpdate?.();
      useToast().add({
        title: "Boards updated",
      });
      return;
    }

    await $fetch("/api/boards", {
      method: "post",
      body: event.data,
    });

    props.onCreate?.();

    useToast().add({
      title: "Boards created",
    });
  } catch (e) {
  } finally {
    blockButton.value = false;
  }
};
</script>

<style></style>
