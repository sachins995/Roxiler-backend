const express = require('express');
const router = express.Router();
const Product = require('../models/product'); // Import the Product model

// API to get bar chart data for a selected month
router.get('/bar-chart', async (req, res) => {
    try {
        const selectedMonth = req.query.month || 'march';
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

        const priceRanges = [
            { range: '0 - 100', min: 0, max: 100 },
            { range: '101 - 200', min: 101, max: 200 },
            { range: '201 - 300', min: 201, max: 300 },
            { range: '301 - 400', min: 301, max: 400 },
            { range: '401 - 500', min: 401, max: 500 },
            { range: '501 - 600', min: 501, max: 600 },
            { range: '601 - 700', min: 601, max: 700 },
            { range: '701 - 800', min: 701, max: 800 },
            { range: '801 - 900', min: 801, max: 900 },
            { range: '901-above', min: 901, max: Infinity }
        ];

        const barChartData = await Promise.all(priceRanges.map(async (range) => {
            const count = await Product.countDocuments({
                $expr: {
                    $and: [
                        { $eq: [{ $month: "$dateOfSale" }, numericMonth + 1] },
                        { $gte: ["$price", range.min] },
                        { $lte: ["$price", range.max] }
                    ]
                }
            });
            return { priceRange: range.range, itemCount: count };
        }));

        res.json(barChartData);
    } catch (e) {
        console.error(e.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
