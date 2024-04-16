import Board from "~/server/models/Board.model";
import CardModel from "~/server/models/Card.model";
import List from "~/server/models/List.model";

export default defineEventHandler(async (event) => {
  try {
    const listId = getRouterParam(event, "listId");
    const userId = event.context.userId;

    const list = await List.findOneAndDelete({
      _id: listId,
      owner: userId,
    });

    if (!list) {
      throw createError({
        statusCode: 400,
        message: "Something went wrong",
      });
    }

    await Board.findOneAndUpdate(
      {
        _id: list.board,
        owner: userId,
      },
      {
        $pull: {
          lists: list._id,
        },
      }
    );

    await CardModel.deleteMany({ list: list._id, owner: userId });

    event.node.res.statusCode = 204;

    return true;
  } catch (e) {
    return e;
  }
});
