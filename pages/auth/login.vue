<template>
  <Auth title="Log in to your account">
    <template #subheading>
      <p class="mt-2">
        Dont have an account?
        <NuxtLink class="text-primary-500" to="/auth/signup"
          >Signup Now</NuxtLink
        >
      </p>
    </template>
    <UForm
      @submit="logInHandler"
      :state="form"
      :schema="logInSchema"
      class="flex flex-col gap-5"
    >
      <UFormGroup name="email" label="Email">
        <UInput v-model.trim="form.email" type="email" />
      </UFormGroup>
      <UFormGroup name="password" label="Password">
        <UInput v-model.trim="form.password" type="password" />
      </UFormGroup>
      <UButton
        block
        :loading="blockButton"
        :disabled="blockButton"
        type="submit"
        >Sign In</UButton
      >

    </UForm>
  </Auth>
</template>

<script lang="ts" setup>
import logInSchema from "~/schemas/logInSchema.ts";
import { z } from "zod";
import type { FormSubmitEvent } from "@nuxt/ui/dist/runtime/types";

definePageMeta({
  middleware: "auth",
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: "/",
  },
});

const form = reactive<{
  email: string | undefined;
  password: string | undefined;
}>({
  email: undefined,
  password: undefined,
});
const blockButton = ref<boolean>(false);
const { signIn } = useAuth();

const logInHandler = async (
  event: FormSubmitEvent<z.output<typeof logInSchema>>
) => {
  try {
    blockButton.value = true;
    const { error } = await signIn("credentials", {
      email: event.data.email,
      password: event.data.password,
      redirect: false,
    });
    if (error) {
      return useToast().add({
        title: "Error!",
        description: "Bad auth",
        timeout: 2000,
      });
    }

    useToast().add({
      title: "You have been logged in!",
      description: "You have entered in your account",
      timeout: 2000,
    });

    // await navigateTo('/')
    return navigateTo('/')
  } catch (e) {
    return useToast().add({
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
