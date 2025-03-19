const mongoose = require("mongoose");

// Define schema and model
const leadSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    age: { type: Number, min: 0 },
    city: { type: String },
    membership: { type: String, enum: ["Basic", "Bronze", "Silver", "Gold"] },
    frequencyOfVisit: { type: Number, default: 0 },
    itemsInCart: { type: Number, default: 0 },
    numberOfOrders: { type: Number, default: 0 },
    totalSpend: { type: Number, default: 0 },
    averageRating: { type: Number, min: 0, max: 5 },
    engagedWithEmails: { type: String, enum: ["Yes", "No"], default: "No" },
    usedDiscountCodes: { type: String, enum: ["Yes", "No"], default: "No" },
    daysSinceLastPurchase: { type: Number, default: 0 },
    leadScore: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Lead = mongoose.model("Lead", leadSchema);

module.exports = Lead;