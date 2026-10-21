const mongoose = require('mongoose');

const subGoalSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true, maxlength: 100 },
    completed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

const goalSchema= new mongoose.Schema({
    title: { type: String, required: true, trim: true, maxlength: 100 },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date, default: null },
    subGoals: {type: [subGoalSchema], default: []},
    archived: { type: Boolean, default: false }
}, {timestamps:true})


module.exports = mongoose.model('Goal',goalSchema);