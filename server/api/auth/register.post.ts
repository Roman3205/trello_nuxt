import { Validator } from "#nuxt-server-utils";
import signUpSchema from "~/schemas/signUpSchema";
import UserModel from "~/server/models/User.model";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    Validator.validateSchema(signUpSchema, body);

    const user = await UserModel.create(body);

    return { ...user.toObject(), password: undefined };
  } catch (e) {
    console.log(e);
    return e;
  }
});
