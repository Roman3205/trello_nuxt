import cardSchema from "~/schemas/cardSchema";
import CardModel from "~/server/models/Card.model";
import listModel from "~/server/models/List.model";

export default defineEventHandler(async (event) => {
  try {
    const cardId = getRouterParam(event, "cardId");
    const listId = getRouterParam(event, "listId");
    const userId = event.context.userId;

    const card = await CardModel.findOneAndDelete({
      _id: cardId,
      list: listId,
      owner: userId,
    });

    if (!card) {
      throw createError({
        status: 404,
        message: "Card not found",
      });
    }

    await listModel.findByIdAndUpdate(
      {
        _id: listId,
        owner: userId,
      },
      {
        $pull: {
          cards: card._id,
        },
      }
    );

    event.node.res.statusCode = 204;
    return true;
  } catch (e) {
    return e;
  }
});
