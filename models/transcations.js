const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  title: String,
  price: String,
  description: String,
  category: String,
  image: String,
  sold: Boolean,
  dateOfSale: Date,
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
