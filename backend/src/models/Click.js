import mongoose from "mongoose";

// Define the schema
const ClickSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    ipAddress: {
      type: String,
      required: true,
    },
    userAgent: {
      type: String,
      required: true,
    },
    coordinates: {
      x: {
        type: Number,
        required: true,
      },
      y: {
        type: Number,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better query performance
ClickSchema.index({ userId: 1, timestamp: -1 });
ClickSchema.index({ timestamp: -1 });

// Make sure to delete any existing model before creating a new one
// This prevents the "Cannot overwrite model once compiled" error
if (mongoose.models.Click) {
  delete mongoose.models.Click;
}

// Create and export the model
const Click = mongoose.model("Click", ClickSchema);

export default Click;
