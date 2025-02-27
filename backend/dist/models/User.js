"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const UserSchema = new mongoose_1.Schema({
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
}, {
    timestamps: true,
});
// Hash password before saving
UserSchema.pre("save", async function (next) {
    // Use a double type assertion to avoid the type error
    const user = this;
    // Only hash the password if it's modified or new
    if (!user.isModified("password"))
        return next();
    try {
        // Generate salt
        const salt = await bcryptjs_1.default.genSalt(10);
        // Hash password
        user.password = await bcryptjs_1.default.hash(user.password, salt);
        next();
    }
    catch (error) {
        next(error);
    }
});
// Method to compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword) {
    return bcryptjs_1.default.compare(candidatePassword, this.password);
};
// Create indexes for better query performance
UserSchema.index({ totalClicks: -1 });
UserSchema.index({ weeklyClicks: -1 });
UserSchema.index({ monthlyClicks: -1 });
exports.default = mongoose_1.default.model("User", UserSchema);
