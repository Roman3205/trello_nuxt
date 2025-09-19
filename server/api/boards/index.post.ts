import boardSchema from "~/schemas/boardSchema";
import Board from "~/server/models/Board.model";

export default defineEventHandler(async (event) => {
  try {
    const userId = event.context.userId;
    const body = await readValidatedBody(event, boardSchema.parse)

    const board = await Board.create({
      ...body,
      owner: userId,
    });
    return board;
  } catch (e) {
    return e;
  }
});
