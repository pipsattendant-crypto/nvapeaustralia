const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  ref: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  total: { type: Number, required: true },
  items: [{ 
    name: String, 
    qty: Number, 
    price: Number 
  }],
  status: { type: String, default: 'Processing' },
  shipping: {
    firstName: String,
    lastName: String,
    address: String,
    suburb: String,
    state: String,
    postcode: String,
    phone: String
  },
  method: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
