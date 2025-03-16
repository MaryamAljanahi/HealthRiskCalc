const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();
const port = process.env.PORT || 8080;

// Enable CORS
app.use(cors({ origin: '*', optionsSuccessStatus: 200 }));
app.use(bodyParser.json());

// **Serve static files from the current directory (Azure uses this)**
app.use(express.static(__dirname));

// **Serve the index.html file when visiting the root ("/")**
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// API Endpoint
app.post("/calculate-risk", (req, res) => {
    const { age, weight, height, bloodPressure, familyHistory } = req.body;

    if (!age || !weight || !height || !bloodPressure) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const bmi = calculateBMI(weight, height);
    const { riskScore, breakdown, bmiCategory, bpCategory } = calculateRisk(age, bmi, bloodPressure, familyHistory);

    let riskCategory;
    if (riskScore <= 50) riskCategory = "Moderate risk";
    else if (riskScore <= 75) riskCategory = "High risk";
    else riskCategory = "Uninsurable";

    res.json({
        riskScore,
        riskCategory,
        bmi: bmi.toFixed(2),
        bmiCategory,
        bpCategory,
        breakdown
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
