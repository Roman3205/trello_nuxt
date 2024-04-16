import Board from "~/server/models/Board.model";
import listModel from "~/server/models/List.model";

export default defineEventHandler(async (event) => {
  try {
    const userId = event.context.userId;
    const boardId = getRouterParam(event, "boardId");

    const board = await Board.findOneAndDelete({
      _id: boardId,
      owner: userId,
    });

    if (!board) {
      throw createError({
        status: 404,
        message: "Board not found",
      });
    }

    await listModel.deleteMany({
      board: board._id,
      owner: userId,
    });

    event.node.res.statusCode = 204;

    return true;
  } catch (e) {
    console.log(e);
    return e;
  }
});
