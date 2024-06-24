const express = require('express');
const router = express.Router();
const Transaction = require('../models/transactions');

// GET /api/transactions
router.get('/transactions', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const perPage = parseInt(req.query.perPage) || 10;
        const search = req.query.search ? req.query.search.toLowerCase() : '';
        // const selectedMonth = req.query.month ? req.query.month.toLowerCase() : 'march';
        const selectedMonth = req.query.month.toLowerCase() || 'march';
        const monthMap = {
            'january': '01',
            'february': '02',
            'march': '03',
            'april': '04',
            'may': '05',
            'june': '06',
            'july': '07',
            'august': '08',
            'september': '09',
            'october': '10',
            'november': '11',
            'december': '12',
        };

        const numericMonth = monthMap[selectedMonth.toLowerCase()];

        // Construct MongoDB query with search and pagination
        const query = {
            dateOfSale: { $regex: `^\\d{4}-${numericMonth}` },
            $or: [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ],
        };

        // If search is a valid number, add price condition
        if (!isNaN(search) && search.trim() !== '') {
            query.$or.push({ price: parseFloat(search) });
        }

        const transactions = await Transaction.find(query)
            .skip((page - 1) * perPage)
            .limit(perPage);

        res.json({
            page,
            perPage,
            transactions
           
        });
    } catch (error) {
        console.error('Error fetching transactions:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;


// const express = require('express');
// const router = express.Router();
// const Product = require('../models/product'); // Import the Product model
// const Transaction = require('../models/transactions')
// // API to list all transactions with search and pagination
// router.get('/transactions', async (req, res) => {
//     try {
//         const page = parseInt(req.query.page) || 1;
//         const perPage = parseInt(req.query.perPage) || 10;
//         const search = req.query.search ? req.query.search.toLowerCase() : '';
//         const selectedMonth = req.query.month ? req.query.month.toLowerCase() : 'march';

//         const monthMap = {
//             'january': 0,
//             'february': 1,
//             'march': 2,
//             'april': 3,
//             'may': 4,
//             'june': 5,
//             'july': 6,
//             'august': 7,
//             'september': 8,
//             'october': 9,
//             'november': 10,
//             'december': 11,
//         };

//         const numericMonth = monthMap[selectedMonth.toLowerCase()];

//         const query = {
//             $expr: {
//                 $eq: [{ $month: "$dateOfSale" }, numericMonth + 1]
//             },
//             $or: [
//                 { title: { $regex: search, $options: 'i' } },
//                 { description: { $regex: search, $options: 'i' } },
//                 { price: { $regex: search, $options: 'i' } }
//             ]
//         };

//         const transactions = await Product.find(query)
//             .skip((page - 1) * perPage)
//             .limit(perPage);

//         res.json({ page, perPage, transactions });
//     } catch (e) {
//         console.error(e.message);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

// module.exports = router;
