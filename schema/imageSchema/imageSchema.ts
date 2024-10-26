import mongoose from "mongoose";

const Schema = mongoose.Schema;
const imageSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    images: [{ type: String, required: false }],
    effect: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Image || mongoose.model("Image", imageSchema);
