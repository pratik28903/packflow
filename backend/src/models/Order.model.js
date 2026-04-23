import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    mockup: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mockup",
      required: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Editing", "Completed", "Rejected"],
      default: "Pending",
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    price: Number,
    status: {
      type: String,
      enum: ["Pending", "Approved", "Editing", "Completed", "Rejected"],
      default: "Pending",
    }
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);