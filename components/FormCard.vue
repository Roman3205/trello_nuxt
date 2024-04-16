<template>
  <UForm
    class="flex flex-col gap-4"
    @submit="handleSubmit"
    :state="form"
    :schema="cardSchema"
  >
    <UFormGroup name="title" label="Title">
      <UInput v-model="form.title" />
    </UFormGroup>
    <UFormGroup name="description" label="Description">
      <ClientOnly placeholder="...loading quill">
        <QuillEditor content-type="html" v-model:content="form.description" />
      </ClientOnly>
    </UFormGroup>
    <UButton :disabled="blockButton" :loading="blockButton" block type="submit">
      {{ submitText }}
    </UButton>
  </UForm>
</template>

<script lang="ts" setup>
import type { CardDocument } from "~/server/models/Card.model";
import cardSchema from "~/schemas/cardSchema";
import type { FormSubmitEvent } from "@nuxt/ui/dist/runtime/types";
import { z } from "zod";

interface Props {
  type?: "create" | "update";
  initialData?: CardDocument;
  listId: string;
  onCreate?: () => void;
  onUpdate?: () => void;
}

const props = withDefaults(defineProps<Props>(), {
  type: "create",
});

const submitText = computed(() =>
  props.type === "create" ? "Create card" : "Update card"
);

const form = reactive<Partial<CardDocument>>({
  title: undefined,
  description: undefined,
});

watchEffect(() => {
  if (props.type === "update" && props.initialData) {
    form.title = props.initialData.title;
    form.description = props.initialData.description;
  }
});

const blockButton = ref<boolean>(false);

const handleSubmit = async (
  event: FormSubmitEvent<z.output<typeof cardSchema>>
) => {
  try {
    blockButton.value = true;
    if (props.type === "update" && props.initialData) {
      await $fetch(
        `/api/lists/${props.listId}/cards/${props.initialData._id}`,
        {
          method: "PUT",
          body: JSON.stringify(event.data),
        }
      );

      props.onUpdate?.();
      useToast().add({
        title: "Card updated",
      });
      return;
    }
    await $fetch(`/api/lists/${props.listId}/cards`, {
      method: "POST",
      body: JSON.stringify(event.data),
    });

    props.onCreate?.();

    useToast().add({
      title: "Card created",
    });
  } catch (e) {
    return e;
  } finally {
    blockButton.value = false;
  }
};
</script>

<style></style>
