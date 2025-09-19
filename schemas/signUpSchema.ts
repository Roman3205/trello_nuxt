import { z } from "zod";

export default z
  .object({
    name: z
      .string()
      .min(3, {
        message:
          "The length of the name must not be more than 50 characters long",
      })
      .max(50, {
        message:
          "The length of the name must not be more than 50 characters long",
      }),
    email: z.string().email({
      message: "Please, enter your email correctly",
    }),
    password: z.string().min(8, {
      message: "The password must be at least 8 characters long",
    }),
    passwordConfirm: z.string().min(8, {
      message: "The password must be at least 8 characters long",
    }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Password do not match",
    path: ["passwordConfirm"],
  });
