const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();
const port = process.env.PORT || 8080;

// Enable CORS
app.use(cors({ origin: '*', optionsSuccessStatus: 200 }));
app.use(bodyParser.json());

// Serve frontend files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, "public")));

// Serve index.html when visiting "/"
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// API Endpoint: Calculate Risk
app.post("/calculate-risk", (req, res) => {
    const { age, weight, height, bloodPressure, familyHistory } = req.body;

    if (!age || !weight || !height || !bloodPressure) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const bmi = weight / (height * height);
    let riskScore = bmi * 10; // Example calculation

    // Add family history points
    let familyHistoryPoints = 0;
    if (familyHistory?.diabetes) familyHistoryPoints += 10;
    if (familyHistory?.cancer) familyHistoryPoints += 10;
    if (familyHistory?.alzheimers) familyHistoryPoints += 10;
    riskScore += familyHistoryPoints;  // Include in final risk score

    const riskCategory = riskScore > 50 ? "High Risk" : "Low Risk";

    res.json({
        riskScore,
        riskCategory,
        bmi: bmi.toFixed(2),
        familyHistoryPoints
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
