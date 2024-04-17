<template>
  <Auth title="Create an account">
    <template #subheading>
      <p class="mt-2">
        Already have an account?
        <NuxtLink class="text-primary-500" to="login">Login Now</NuxtLink>
      </p>
    </template>
    <UForm
      @submit="signUpHandler"
      :state="form"
      :schema="signUpSchema"
      class="flex flex-col gap-5"
    >
      <UFormGroup name="name" label="Name">
        <UInput v-model.trim="form.name" type="text" />
      </UFormGroup>
      <UFormGroup name="email" label="Email">
        <UInput v-model.trim="form.email" type="email" />
      </UFormGroup>
      <UFormGroup name="password" label="Password">
        <UInput v-model.trim="form.password" type="password" />
      </UFormGroup>
      <UFormGroup name="passwordConfirm" label="Confirm password">
        <UInput v-model.trim="form.passwordConfirm" type="password" />
      </UFormGroup>
      <UButton
        block
        :loading="blockButton"
        :disabled="blockButton"
        type="submit"
        >Sign up</UButton
      >
    </UForm>
  </Auth>
</template>

<script lang="ts" setup>
import signUpSchema from "~/schemas/signUpSchema";
import { z } from "zod";
import type { FormSubmitEvent } from "@nuxt/ui/dist/runtime/types";

const form = reactive<{
  name: string | undefined;
  email: string | undefined;
  password: string | undefined;
  passwordConfirm: string | undefined;
}>({
  name: undefined,
  email: undefined,
  password: undefined,
  passwordConfirm: undefined,
});
const blockButton = ref<boolean>(false);

definePageMeta({
  middleware: "auth",
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: "/",
  },
});

const signUpHandler = async (
  event: FormSubmitEvent<z.output<typeof signUpSchema>>
) => {
  try {
    blockButton.value = true;
    await $fetch("/api/auth/register", {
      method: "POST",
      body: event.data,
    });
    useToast().add({
      title: "Account created!",
      description: "Account has been successfully created",
      timeout: 2000,
    });

    useRouter().push({
      name: "auth-login",
    });
  } catch (e: any) {
    useToast().add({
      title: "Error!",
      description: e.message || "Something went wrong",
      timeout: 2000,
    });
  } finally {
    blockButton.value = false;
  }
};
</script>

<style></style>
