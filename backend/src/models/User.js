import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    displayName: {
      type: String,
      required: true,
      trim: true,
    },
    totalClicks: {
      type: Number,
      default: 0,
    },
    dailyClicks: {
      type: Number,
      default: 0,
    },
    weeklyClicks: {
      type: Number,
      default: 0,
    },
    monthlyClicks: {
      type: Number,
      default: 0,
    },
    lastClickedAt: {
      type: Date,
      default: null,
    },
    streak: {
      type: Number,
      default: 0,
    },
    lastLoginAt: {
      type: Date,
      default: Date.now,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    referralCode: {
      type: String,
      required: true,
      unique: true,
    },
    referredBy: {
      type: String,
      default: null,
    },
    referralCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
UserSchema.pre("save", async function (next) {
  // Use a double type assertion to avoid the type error
  const user = this;

  // Only hash the password if it's modified or new
  if (!user.isModified("password")) return next();

  try {
    // Generate salt
    const salt = await bcrypt.genSalt(10);
    // Hash password
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Create indexes for better query performance
UserSchema.index({ totalClicks: -1 });
UserSchema.index({ weeklyClicks: -1 });
UserSchema.index({ monthlyClicks: -1 });

export default ("User", UserSchema);
