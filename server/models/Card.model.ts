import { Document, Schema, model } from "mongoose";

export interface CardDocument extends Document {
  title: string;
  description: string;
  owner: string;
  list: string;
  createdAt: Date;
  updatedAt: Date;
}

const cardSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    list: {
      type: Schema.Types.ObjectId,
      ref: "List",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model<CardDocument>("card", cardSchema);
