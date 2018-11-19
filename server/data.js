const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// this will be our data structure
const DataSchema = new Schema(
  {
  	id: Number,
  	firstName: String,
  	lastName: String,
  	winnings: Number,
  	country: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Data", DataSchema);
