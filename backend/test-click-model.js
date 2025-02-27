import mongoose from "mongoose";
import Click from "./src/models/Click.js";

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/test")
  .then(() => {
    console.log("Connected to MongoDB");

    // Test creating a Click instance
    try {
      const clickData = {
        userId: new mongoose.Types.ObjectId(),
        coordinates: { x: 100, y: 100 },
        ipAddress: "127.0.0.1",
        userAgent: "Test Agent",
      };

      console.log("Creating Click with data:", clickData);

      // Test if Click is a constructor
      console.log("Click constructor type:", typeof Click);
      console.log(
        "Click is constructor?",
        Click.prototype.constructor === Click
      );

      // Create a Click instance
      const click = new Click(clickData);
      console.log("Click instance created successfully:", click);

      // Disconnect from MongoDB
      mongoose.disconnect();
    } catch (error) {
      console.error("Error testing Click model:", error);
      mongoose.disconnect();
    }
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
