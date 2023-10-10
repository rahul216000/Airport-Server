const mongoose = require('mongoose');

const Flight = mongoose.model('Flights', {
    contact: { type: Object },
    flight: { type: Array }
});

module.exports = Flight