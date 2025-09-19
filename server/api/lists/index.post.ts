import listSchema from "~/schemas/listSchema";
import Board from "~/server/models/Board.model";
import List from "~/server/models/List.model";

export default defineEventHandler(async (event) => {
  try {
    const body = await readValidatedBody(event, listSchema.parse)

    const userId = event.context.userId;

    const list = await List.create({
      ...body,
      owner: userId,
    });

    if (!list) {
      throw createError({
        statusCode: 400,
        message: "Something went wrong",
      });
    }

    await Board.findByIdAndUpdate(
      {
        _id: body.board,
        owner: userId,
      },
      {
        $push: {
          lists: list._id,
        },
      }
    );

    return list;
  } catch (e) {
    return e;
  }
});
