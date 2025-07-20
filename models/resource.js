// models/Resource.js
const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: String,
  url: String,
  category: String,
  level: String,
  language: String,
  subject: String,
  chapter: String
});


module.exports = mongoose.models.Resource || mongoose.model('Resource', resourceSchema);

