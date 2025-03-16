const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();
const port = process.env.PORT || 8080;

// Enable CORS
app.use(cors({ origin: '*', optionsSuccessStatus: 200 }));
app.use(bodyParser.json());

// ✅ Fix: Use absolute path to serve frontend files
const publicPath = path.join(__dirname, "public");
app.use(express.static(publicPath));

// ✅ Fix: Send correct index.html path
app.get("/", (req, res) => {
    res.sendFile(path.join(publicPath, "index.html"));
});

// API Endpoint
app.post("/calculate-risk", (req, res) => {
    const { age, weight, height, bloodPressure, familyHistory } = req.body;

    if (!age || !weight || !height || !bloodPressure) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const bmi = weight / (height * height);
    let riskScore = bmi * 10;

    let familyHistoryPoints = 0;
    if (familyHistory?.diabetes) familyHistoryPoints += 10;
    if (familyHistory?.cancer) familyHistoryPoints += 10;
    if (familyHistory?.alzheimers) familyHistoryPoints += 10;
    riskScore += familyHistoryPoints;

    const riskCategory = riskScore > 50 ? "High Risk" : "Low Risk";

    res.json({
        riskScore,
        riskCategory,
        bmi: bmi.toFixed(2),
        familyHistoryPoints
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
