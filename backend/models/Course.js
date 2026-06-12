// backend/models/Course.js
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    courseCode: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },
    courseName: {
        type: String,
        required: true,
        trim: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    creditHours: {
        type: Number,
        required: true,
        min: 1,
        max: 4
    },
    department: {
        type: String,
        required: true,
        enum: ['Computer Science', 'Software Engineering', 'Information Technology', 'Data Science', 'Artificial Intelligence']
    },
    semester: {
        type: Number,
        required: true,
        min: 1,
        max: 8
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    enrolledStudents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }
}, { timestamps: true });

// Index for search
courseSchema.index({ courseCode: 1, courseName: 'text', title: 'text' });

module.exports = mongoose.model('Course', courseSchema);