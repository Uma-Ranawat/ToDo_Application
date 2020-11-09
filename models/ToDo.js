const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    user_id: {
        // model: 'User'
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    },
    description:{
        type: String,
        required: true,
        min: 3,
        max: 100
    },
    due_date:{
        type: Date,
        required: true,
        default: Date.now
    },
    reminder_date:{
        type: Date,
        required: true,
        default: Date.now
    },
    status: {
        type: String,
        default: 'incomplete'
    }
});

module.exports = mongoose.model('ToDo', todoSchema);