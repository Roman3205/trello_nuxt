import cardSchema from "~/schemas/cardSchema";
import CardModel from "~/server/models/Card.model";

export default defineEventHandler(async (event) => {
  try {
    const cardId = getRouterParam(event, "cardId");
    const listId = getRouterParam(event, "listId");
    const userId = event.context.userId;

    const body = await readValidatedBody(event, cardSchema.partial().parse);


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

    // const list = await listModel
    //   .findOne({
    //     _id: listId,
    //   })
    //   .populate({
    //     path: "cards",
    //     model: CardModel,
    //   });

    // if (!list?.cards.includes(card._id)) {
    //   console.log(true);

    //   list?.cards.push(card._id);
    //   await list?.save();
    // }

    return card;
  } catch (e) {
    return e;
  }
});
