import mongoose, { Document, Schema } from "mongoose";

export interface IClick extends Document {
  userId: mongoose.Types.ObjectId;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
  coordinates: {
    x: number;
    y: number;
  };
}

const ClickSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
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

export default mongoose.model<IClick>("Click", ClickSchema);
