const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();
const port = process.env.PORT || 8080;

// CORS Options
app.use(cors({ origin: '*', optionsSuccessStatus: 200 }));

// Middleware
app.use(bodyParser.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));

// Default route (Serve index.html)
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Your existing API route
app.post("/calculate-risk", (req, res) => {
    const { age, weight, height, bloodPressure, familyHistory } = req.body;

    if (!age || !weight || !height || !bloodPressure) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const bmi = weight / (height * height);

    let riskScore = 0;
    const breakdown = [];

    if (age < 30) riskScore += 0;
    else if (age < 45) riskScore += 10;
    else if (age < 60) riskScore += 20;
    else riskScore += 30;
    breakdown.push({ factor: "Age", points: riskScore });

    let riskCategory;
    if (riskScore <= 50) riskCategory = "Moderate risk";
    else if (riskScore <= 75) riskCategory = "High risk";
    else riskCategory = "Uninsurable";

    res.json({ riskScore, riskCategory });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
