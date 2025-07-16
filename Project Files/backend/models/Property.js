const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  type: {
    type: String,
    required: true
  },
  adType: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  contact: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  info: {
    type: String
  },
  specificDate: {
    type: String
  },
  image: {
    type: String
  },
 owner: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
}

});

module.exports = mongoose.model('Property', propertySchema);
