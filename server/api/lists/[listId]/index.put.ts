import { Validator } from "#nuxt-server-utils";
import listSchema from "~/schemas/listSchema";
import List from "~/server/models/List.model";

export default defineEventHandler(async (event) => {
  try {
    const listId = getRouterParam(event, "listId");
    const userId = event.context.userId;

    const body = await readBody(event);

    Validator.validateSchema(listSchema.partial(), body);

    const updatedList = await List.findOneAndUpdate(
      {
        _id: listId,
        owner: userId,
      },
      { $set: body },
      {
        new: true,
      }
    );

    if (!updatedList) {
      throw createError({
        statusCode: 400,
        message: "Something went wrong",
      });
    }

    return updatedList;
  } catch (e) {
    return e;
  }
});
