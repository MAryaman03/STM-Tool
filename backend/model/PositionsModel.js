const { model } = require("mongoose");
const { PositionsSchema } = require("../schemas/PositionsSchemas");

const PositionsModel = model("Position", PositionsSchema);

module.exports = { PositionsModel };