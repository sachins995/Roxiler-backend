const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const axios = require('axios');
// const path = require('path');
const connectDB = require('./db');
// const Product = require('./models/product'); // Import the Product model
// const Transaction = require('./models/transaction'); // Import the Transaction model
const Transaction = require("./models/transcations")
const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

// Connect to the database
connectDB();

// Function to initialize the database with data from the URL
const initializeDB = async () => {
  const url = 'https://s3.amazonaws.com/roxiler.com/product_transaction.json';
  try {
    const response = await axios.get(url);
    const jsonData = response.data;

    // Insert the data into MongoDB
    await Transaction.insertMany(jsonData);
    console.log('Database initialized with seed data.');
  } catch (error) {
    console.error('Error fetching data from the URL:', error.message);
  }
};

// Initialize the database
initializeDB();

// API endpoints
app.get('/', (req, res) => {
  res.send('Welcome, this is Roxiler company assignment backend domain. Please access any path to get the data.');
});

// Import routes
const transactionRoutes = require('./routes/transactions');
const statisticsRoutes = require('./routes/statistics');
const barChartRoutes = require('./routes/barChart');
const pieChartRoutes = require('./routes/pieChart');

// Use routes
app.use('/api', transactionRoutes);
app.use('/api', statisticsRoutes);
app.use('/api', barChartRoutes);
app.use('/api', pieChartRoutes);

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}/`);
});

module.exports = app;



// const express = require('express');
// const cors = require('cors');
// const mongoose = require('mongoose');
// const axios = require('axios');
// const path = require('path');
// const Product = require('./models/product'); // Import the Product model
// const Transaction = require('./models/transaction');
// // Transaction
// const connectDB = require('./db');

// const app = express();
// app.use(cors());
// app.use(express.json());
// const PORT = 3000;

// // Connect to the database
// connectDB();


// const dbUrl = 'mongodb://localhost:27017/roxiler';

// mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => console.log('MongoDB connected...'))
//     .catch(err => console.log(err));

// app.listen(3000, () => {
//     console.log("Server started at http://localhost:3000/");
//     initializeDB();
// });

// const initializeDB = async () => {
//     const url = 'https://s3.amazonaws.com/roxiler.com/product_transaction.json';
//     try {
//         const response = await axios.get(url);
//         const jsonData = response.data;

//         // Insert the data into MongoDB
//         await Product.insertMany(jsonData);
//         console.log('Database initialized with seed data.');
//     } catch (error) {
//         console.error('Error fetching data from the URL:', error.message);
//     }
// };



// const transactionRoutes = require('./routes/transactions');
// const statisticsRoutes = require('./routes/statistics');
// const barChartRoutes = require('./routes/barChart');
// const pieChartRoutes = require('./routes/pieChart');
// const Transaction = require('./models/transcations');

// app.use('/api', transactionRoutes);
// app.use('/api', statisticsRoutes);
// app.use('/api', barChartRoutes);
// app.use('/api', pieChartRoutes);


// module.exports = app;