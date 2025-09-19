import { Schema, model } from "mongoose";
import type { Document } from "mongoose";
import { ListDocument } from "./List.model";

export interface BoardDocument extends Document {
  name: string;
  lists: ListDocument[];
  owner: string;
  coverImage: string;
}

const boardSchema = new Schema(
  {
    name: {
      type: String,
      default: "Untitled Board",
    },
    lists: [
      {
        type: Schema.Types.ObjectId,
        ref: "List",
      },
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    coverImage: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Board = model<BoardDocument>("board", boardSchema);

export default Board;
