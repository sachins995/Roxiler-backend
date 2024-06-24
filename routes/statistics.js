const express = require('express');
const router = express.Router();
const Product = require('../models/product'); // Import the Product model

// API to get statistics for a selected month
router.get('/statistics', async (req, res) => {
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

        const statistics = await Product.aggregate([
            { $match: { $expr: { $eq: [{ $month: "$dateOfSale" }, numericMonth + 1] } } },
            {
                $facet: {
                    totalSaleAmount: [{ $match: { sold: true } }, { $group: { _id: null, total: { $sum: "$price" } } }],
                    totalSoldItems: [{ $match: { sold: true } }, { $count: "count" }],
                    totalNotSoldItems: [{ $match: { sold: false } }, { $count: "count" }],
                }
            }
        ]);

        const totalSaleAmount = statistics[0].totalSaleAmount[0]?.total || 0;
        const totalSoldItems = statistics[0].totalSoldItems[0]?.count || 0;
        const totalNotSoldItems = statistics[0].totalNotSoldItems[0]?.count || 0;

        res.json({ selectedMonth, totalSaleAmount, totalSoldItems, totalNotSoldItems });
    } catch (e) {
        console.error(e.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
