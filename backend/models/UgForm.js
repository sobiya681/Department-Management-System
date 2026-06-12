// backend/models/UGForm.js
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    courseName: {
        type: String,
        required: true
    },
    creditHours: {
        type: Number,
        required: true,
        min: 1,
        max: 4
    },
    courseCode: {
        type: String,
        required: true
    },
    semester: {
        type: Number,
        required: true
    }
});

const ugFormSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
        unique: true // One form per student
    },
    
    // Personal Information
    studentName: {
        type: String,
        required: true
    },
    fatherName: {
        type: String,
        required: true
    },
    registrationNumber: {
        type: String,
        required: true,
        unique: true
    },
    dateOfFirstEnrollment: {
        type: Date,
        required: true
    },
    section: {
        type: String,
        required: true,
        enum: ['A', 'B', 'C', 'D']
    },
    
    // Contact Information
    permanentAddress: {
        type: String,
        required: true
    },
    contactNumber: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    
    // Courses (6 courses)
    courses: [courseSchema],
    
    // Total Credit Hours
    totalCreditHours: {
        type: Number,
        default: 0
    },
    
    // Submission Status
    status: {
        type: String,
        enum: ['draft', 'submitted', 'approved', 'rejected'],
        default: 'draft'
    },
    
    // Admin Review
    adminComments: {
        type: String,
        default: ''
    },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    reviewedAt: {
        type: Date
    },
    
    // Submission tracking
    submittedAt: {
        type: Date
    },
    lastModified: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Calculate total credit hours before saving


module.exports = mongoose.model('UGForm', ugFormSchema);