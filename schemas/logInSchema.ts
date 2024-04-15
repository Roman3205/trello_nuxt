import { z } from "zod";

export default z.object({
  email: z.string().email({
    message: "Please, enter your email correctly",
  }),
  password: z.string(),
});
