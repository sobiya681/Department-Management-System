// backend/models/DocumentRequest.js
const mongoose = require('mongoose');

const documentRequestSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    
    // Request Type
    requestType: {
        type: String,
        enum: ['degree', 'dmc'],
        required: true
    },
    
    // Personal Information
    applicantName: {
        type: String,
        required: true,
        uppercase: true
    },
    fatherName: {
        type: String,
        required: true
    },
    presentAddress: {
        type: String,
        required: true
    },
    permanentAddress: {
        type: String,
        required: true
    },
    cnicNumber: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    cellNumber: {
        type: String,
        required: true
    },
    registrationNumber: {
        type: String,
        required: true
    },
    
    // Document Details
    natureOfDocument: {
        type: String,
        required: true,
        enum: ['degree', 'dmc', 'transcript', 'character_certificate', 'other']
    },
    
    // Bank Challan Details
    bankChallanNo: {
        type: String,
        required: true
    },
    bankChallanDate: {
        type: Date,
        required: true
    },
    bankName: {
        type: String,
        default: 'National Bank of Pakistan'
    },
    amountPaid: {
        type: Number,
        required: true
    },
    
    // Academic Information (for undergraduate students)
    degree: {
        type: String,
        required: true,
        enum: ['BS', 'MS', 'PhD', 'Other']
    },
    faculty: {
        type: String,
        required: true
    },
    major: {
        type: String,
        required: true
    },
    section: {
        type: String,
        enum: ['A', 'B', 'C', 'D', 'E'],
        required: true
    },
    yearOfPassing: {
        type: Number,
        required: true
    },
    marksObtained: {
        type: Number,
        required: true
    },
    totalMarks: {
        type: Number,
        required: true
    },
    percentage: {
        type: Number,
        default: 0
    },
    cgpa: {
        type: Number,
        required: true,
        min: 0,
        max: 4
    },
    
    // Additional Documents (for file uploads)
    supportingDocuments: [{
        documentName: String,
        documentUrl: String,
        uploadedAt: Date
    }],
    
    // Status Tracking
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'processing', 'ready_for_pickup', 'dispatched'],
        default: 'pending'
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
    
    // Document Pickup/Dispatched Details
    expectedPickupDate: {
        type: Date
    },
    trackingNumber: {
        type: String
    },
    
    // Submission tracking
    submittedAt: {
        type: Date,
        default: Date.now
    },
    lastModified: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Calculate percentage before saving


// Index for faster queries
documentRequestSchema.index({ student: 1, createdAt: -1 });
documentRequestSchema.index({ registrationNumber: 1 });
documentRequestSchema.index({ status: 1 });
documentRequestSchema.index({ requestType: 1 });

module.exports = mongoose.model('DocumentRequest', documentRequestSchema);