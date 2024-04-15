import { Validator } from "#nuxt-server-utils";
import cardSchema from "~/schemas/cardSchema";
import CardModel from "~/server/models/Card.model";

export default defineEventHandler(async (event) => {
  try {
    const cardId = getRouterParam(event, "cardId");
    const listId = getRouterParam(event, "listId");
    const userId = event.context.userId;

    const body = await readBody(event);

    Validator.validateSchema(cardSchema, body);

    const card = await CardModel.findOneAndUpdate(
      {
        _id: cardId,
        list: listId,
        owner: userId,
      },
      {
        ...body,
      }
    );

    if (!card) {
      throw createError({
        status: 404,
        message: "Card not found",
      });
    }

    return card;
  } catch (e) {
    return e;
  }
});
