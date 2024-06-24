const express = require('express');
const router = express.Router();
const Product = require('../models/product'); // Import the Product model

// API to get pie chart data for a selected month
router.get('/pie-chart', async (req, res) => {
    try {
        const selectedMonth = req.query.month || 'march';

        if (!selectedMonth) {
            return res.status(400).json({ error: 'Month parameter is required.' });
        }
        const monthMap = {
            'january': 0,
            'february': 1,
            'march': 2,
            'april': 3,
            'may': 4,
            'june': 5,
            'july': 6,
            'august': 7,
            'september': 8,
            'october': 9,
            'november': 10,
            'december': 11,
        };

        const numericMonth = monthMap[selectedMonth.toLowerCase()];

        const pieChartData = await Product.aggregate([
            { $match: { $expr: { $eq: [{ $month: "$dateOfSale" }, numericMonth + 1] } } },
            { $group: { _id: "$category", itemCount: { $sum: 1 } } },
            { $project: { _id: 0, category: "$_id", itemCount: 1 } }
        ]);

        res.json(pieChartData);
    } catch (e) {
        console.error(e.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
