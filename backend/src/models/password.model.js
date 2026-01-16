import mongoose, { Schema } from "mongoose";

const passwordSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    userName: {
      type: String,
      trim: true,
    },
    encryptedPassword: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    website: {
      type: String,
    },
    iv: {
      type: String,
      required: true,
    },
    authTag: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Password = mongoose.model("Password", passwordSchema);
