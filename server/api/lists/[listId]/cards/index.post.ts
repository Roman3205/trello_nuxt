import cardSchema from "~/schemas/cardSchema";
import CardModel from "~/server/models/Card.model";
import listModel from "~/server/models/List.model";

export default defineEventHandler(async (event) => {
  try {
    const { userId } = event.context;

    const listId = getRouterParam(event, "listId");

    const body = await readValidatedBody(event, cardSchema.parse);

    const card = await CardModel.create({
      ...body,
      list: listId,
      owner: userId,
    });

    await listModel.findOneAndUpdate(
      {
        _id: listId,
        owner: userId,
      },
      {
        $push: {
          cards: card._id,
        },
      }
    );

    return card;
  } catch (e) {
    return e;
  }
});
