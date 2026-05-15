const { Schema } = require("mongoose");

const PositionsSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
      index: true,
    },
    product: {
      type: String,
      required: true,
      enum: ["CNC", "MIS"], // restrict allowed product types
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    qty: {
      type: Number,
      required: true,
      min: 0,
    },
    avg: {
      type: Number,
      required: true,
      min: 0,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    netPercent: {
      type: Number,
      default: 0,
    },
    dayPercent: {
      type: Number,
      default: 0,
    },
    isLoss: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = { PositionsSchema };