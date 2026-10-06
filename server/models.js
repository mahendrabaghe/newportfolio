// Re-export from the single root models file to avoid Mongoose
// "OverwriteModelError" caused by registering the same models twice.
module.exports = require('../models');
