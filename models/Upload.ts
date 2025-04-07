import mongoose, { Schema, model, models } from "mongoose";

const UploadSchema = new Schema(
  {
    fileName: { type: String, required: true },
    filePath: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Upload = models.Upload || model("Upload", UploadSchema);
export default Upload;
