import mongoose, { Schema } from "mongoose";

const contentSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    body: {
      type: String,
      required: [true, "Body is required"],
    },
    type: {
      type: String,
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      default: null,
    },
  },
  { timestamps: true },
);

export const Content = mongoose.model("Content", contentSchema);
