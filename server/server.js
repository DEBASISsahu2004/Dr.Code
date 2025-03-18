require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Lead = require("./models/leads");

const app = express();
app.use(bodyParser.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/api/getLeadScore", async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      gender,
      age,
      city,
      membership,
      frequencyOfVisit,
      itemsInCart,
      numberOfOrders,
      totalSpend,
      averageRating,
      engagedWithEmails,
      usedDiscountCodes,
      daysSinceLastPurchase,
    } = req.body;

    // Define a cleaner prompt
    const prompt = `Based on the following customer details, generate a lead score between 1-100.
      Name: ${name}, Email: ${email}, Phone: ${phone}, Gender: ${gender}, Age: ${age}, City: ${city}, Membership: ${membership}, 
      Frequency of Visit: ${frequencyOfVisit}, Items in Cart: ${itemsInCart}, Number of Orders: ${numberOfOrders}, 
      Total Spend: ${totalSpend}, Average Rating: ${averageRating}, Engaged with Emails: ${engagedWithEmails}, 
      Used Discount Codes: ${usedDiscountCodes}, Days Since Last Purchase: ${daysSinceLastPurchase}.
      Only return a number, no extra text.`; // Ensures a clean response

    // Correct Model Usage
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" }); // Updated Model
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const responseText = result.response.candidates[0].content.parts[0].text;

    // Extract lead score
    const leadScore = parseInt(responseText.match(/\d+/)[0], 10) || 0;

    // Save lead to MongoDB
    const newLead = new Lead({ ...req.body, leadScore });
    await newLead.save();

    res
      .status(200)
      .json({ message: "Lead score generated and saved", leadScore });
  } catch (error) {
    console.error("Error generating lead score:", error);
    res.status(500).json({ error: "Failed to generate lead score" });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
