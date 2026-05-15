const { Schema } = require("mongoose");

const OrdersSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    qty: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    mode: {
      type: String,
      required: true,
      enum: ["BUY", "SELL"], // prevents invalid values
    },
    status: {
      type: String,
      enum: ["OPEN", "COMPLETED", "CANCELLED"],
      default: "OPEN",
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

module.exports = { OrdersSchema };