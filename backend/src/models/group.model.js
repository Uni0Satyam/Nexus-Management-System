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
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true },
);

module.export = mongoose.model("Group", groupSchema);
