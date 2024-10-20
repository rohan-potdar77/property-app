const mongoose = require("mongoose");
mongoose.pluralize(null);

const propertySchema = new mongoose.Schema({
  propertyName: {
    type: String,
    required: true,
    index: true,
  },
  propertyType: {
    type: String,
    required: true,
    enum: ["Residential", "Commercial", "Industrial", "Land"],
    index: true,
  },
  propertyLocation: {
    type: String,
    required: true,
    index: true,
  },
  propertyPrice: {
    type: Number,
    required: true,
    index: true,
  },
  propertyDescription: {
    type: String,
    required: true,
  },
  propertyImage: {
    type: String,
    default: null,
    required: false,
  },
});

module.exports = mongoose.model("Property", propertySchema);
