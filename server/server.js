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

const getLeadCategory = (score) => {
  if (score >= 80) return "Hot";
  if (score >= 60 && score < 80) return "Warm";
  return "Cold";
};

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
    const prompt = `As an AI lead scoring model, generate a lead score from the provided CSV file based on customer demographics, membership level, engagement metrics, and sentiment analysis, ensuring a total score of 100.

Customer demographics contribute up to 15 points. Gender plays a minor role, with male and female customers receiving 2 points, while other genders receive 1 point. Age is an important factor, where customers aged 12-30 receive the highest score of 6, those aged 30-60 get 5 points, and older customers above 60 get 3 points, while young users below 12 receive only 1 point. The city tier also influences the score, with customers from Tier 1 cities receiving 7 points, Tier 2 cities getting 5 points, Tier 3 cities getting 4 points, and Tier 4 cities getting 3 points.

Membership level determines up to 15 points, as premium members are more likely to be high-value leads. Customers with a Basic membership receive 5 points, Bronze members get 8 points, Silver members receive 12 points, and Gold members earn the highest score of 15 points.

Engagement metrics have the highest influence, contributing up to 50 points. Customers visiting daily score 15 points, weekly visitors get 10 points, those visiting monthly receive 5 points, and rarely active users score only 2 points. The number of items in the cart also matters, with those having 6 or more items getting 6 points, while those with 3-5 items receive 4 points, and users with 0-2 items get 2 points. The number of orders placed further refines the score—customers with 6 or more orders earn 10 points, those with 3-5 orders get 7 points, and those with 0-2 orders receive 4 points. Higher spending contributes to the lead score, where customers spending over $200 receive 8 points, those spending between $50 and $200 get 6 points, and those spending less than $50 receive only 3 points. Product rating also affects the score, with customers who frequently rate their purchases 4-5 stars earning 7 points, those rating between 3-4 stars receiving 5 points, and those rating below 3 stars getting only 3 points.

Email engagement and discount usage are additional engagement indicators, where customers who engage with emails get an extra 3 points, and those who use discount codes also receive 3 points. The recency of purchase is important—customers who made a purchase within the last 15 days score 5 points, those purchasing within 15-30 days receive 2 points, while customers inactive for over 30 days get 0 points.
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

    const leadCategory = getLeadCategory(leadScore); // Determine lead category

    // Check if email exists in the database
    const existingLead = await Lead.findOne({ email });

    if (existingLead) {
      // Update existing lead
      await Lead.updateOne(
        { email },
        { ...req.body, leadScore, leadCategory } // Include leadCategory
      );
      res
        .status(200)
        .json({ message: "Lead score updated", leadScore, leadCategory });
    } else {
      // Save new lead to MongoDB
      const newLead = new Lead({ ...req.body, leadScore, leadCategory }); // Include leadCategory
      await newLead.save();
      res
        .status(200)
        .json({
          message: "Lead score generated and saved",
          leadScore,
          leadCategory,
        });
    }
  } catch (error) {
    console.error("Error generating lead score:", error);
    res.status(500).json({ error: "Failed to generate lead score" });
  }
});

app.get("/api/leads", async (req, res) => {
  try {
    const leads = await Lead.find({});
    res.status(200).json(leads);
  } catch (error) {
    console.error("Error fetching leads:", error);
    res.status(500).json({ error: "Failed to fetch leads" });
  }
});

app.delete("/api/leads/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Lead.findByIdAndDelete(id);
    res.status(200).json({ message: "Lead deleted successfully" });
  } catch (error) {
    console.error("Error deleting lead:", error);
    res.status(500).json({ error: "Failed to delete lead" });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
