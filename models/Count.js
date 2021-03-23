const mongoose = require('mongoose');

const CountSchema = new mongoose.Schema({
    carType: {
        type: String,
        required: false
    },
    clickCount: {
        type: Number,
        required: false
    }
});

const Count = mongoose.model('Count', CountSchema);
module.exports = Count;