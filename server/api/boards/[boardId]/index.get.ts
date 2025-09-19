import Board from "~/server/models/Board.model";
import listModel from "~/server/models/List.model";

export default defineEventHandler(async (event) => {
  try {
    const userId = event.context.userId;

    const boardId = getRouterParam(event, "boardId");

    const board = await Board.findOne({
      _id: boardId,
      owner: userId,
    }).populate({
      path: "lists",
      model: listModel,
    });

    return board;
  } catch (e) {
    return e;
  }
});
