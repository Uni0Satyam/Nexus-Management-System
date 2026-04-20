import mongoose, { Schema } from "mongoose";

const groupSchema = new Schema(
  {
    groupName: {
      type: String,
      required: [true, "Group name is required"],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
    },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  },
);

groupSchema.virtual("members", {
    ref: "User",
    localField: "_id",
    foreignField: "group",
});

groupSchema.virtual("contents", {
    ref: "Content",
    localField: "_id",
    foreignField: "group",
});

export const Group = mongoose.model("Group", groupSchema);
