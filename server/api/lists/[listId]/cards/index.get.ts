import CardModel from "~/server/models/Card.model";
import listModel from "~/server/models/List.model";

export default defineEventHandler(async (event) => {
  try {
    const listId = getRouterParam(event, "listId");
    const userId = event.context.userId;

    const list = await listModel
      .findOne({ _id: listId, owner: userId })
      .populate({
        path: "cards",
        model: CardModel,
      });

    if (!list) {
      throw createError({
        status: 404,
        message: "List not found",
      });
    }

    return list.cards;
  } catch (e) {
    console.log(e);
    return e;
  }
});
