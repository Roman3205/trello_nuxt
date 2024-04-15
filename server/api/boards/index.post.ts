import { Validator } from "#nuxt-server-utils";
import boardSchema from "~/schemas/boardSchema";
import Board from "~/server/models/Board.model";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    const userId = event.context.userId;

    Validator.validateSchema(boardSchema, body);

    const board = await Board.create({
      ...body,
      owner: userId,
    });
    return board;
  } catch (e) {
    return e;
  }
});
