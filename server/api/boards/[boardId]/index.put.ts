import boardSchema from "~/schemas/boardSchema";
import Board from "~/server/models/Board.model";

export default defineEventHandler(async (event) => {
  try {
    const userId = event.context.userId;
    const boardId = getRouterParam(event, "boardId");

    const body = await readValidatedBody(event, boardSchema.parse);

    const board = await Board.findOneAndUpdate(
      {
        _id: boardId,
        owner: userId,
      },
      {
        $set: body,
      }
    );
    return board;
  } catch (e) {
    console.log(e);
    return e;
  }
});
