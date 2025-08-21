const mongoose = require('mongoose');

const SettingSchema = new mongoose.Schema({
  siteTitle: {
    type: String,
    default: 'Ecomom CMS'
  },
  adminEmail: {
    type: String,
    default: 'admin@example.com'
  },
  itemsPerPage: {
    type: Number,
    default: 10
  }
});

module.exports = mongoose.model('Setting', SettingSchema);