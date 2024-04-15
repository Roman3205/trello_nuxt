import Board from "~/server/models/Board.model";

export default defineEventHandler(async (event) => {
  try {
    const userId = event.context.userId;

    const boards = await Board.find();
    return boards;
  } catch (e) {
    console.log(e);
    return e;
  }
});
