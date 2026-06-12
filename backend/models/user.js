// backend/models/user.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: "https://imgs.search.brave.com/XshzAnxNoCWxaXHgqihXHMy15k2h4o9l061WGw2xeRA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wNTkv/NDQwLzY1Ni9zbWFs/bC9iZWF1dGlmdWwt/Y29udGVtcG9yYXJ5/LW1ldGF2ZXJzZS1h/dmF0YXItd2l0aC1j/dXN0b21pemFibGUt/ZmVhdHVyZXMtb3Jp/Z2luYWwtZnJlZS1w/bmcucG5n",
    },
    role: {
        type: String,
        default: "student",
        enum: ["student", "teacher", "admin"]
    },
    // Profile fields
    name: {
        type: String,
        default: null
    },
    phone: {
        type: String,
        default: null
    },
    address: {
        type: String,
        default: null
    },
    // Student specific fields
    department: {
        type: String,
        default: 'Computer Science'
    },
    program: {
        type: String,
        default: 'BS Computer Science'
    },
    agNumber: {
        type: String,
        unique: true,
        sparse: true
    },
    semester: {
        type: Number,
        default: 1
    },
    cgpa: {
        type: Number,
        default: 0
    },
    enrollmentNumber: {
        type: String,
        unique: true,
        sparse: true
    },
    
    // Teacher specific fields - MAKE SURE THESE ARE ADDED
    designation: {
        type: String,
        default: null
    },
    qualification: {
        type: String,
        default: null
    },
    employeeId: {
        type: String,
        unique: true,
        sparse: true
    },
    
    // Verification fields
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationDocuments: {
        type: Object,
        default: {}
    },
    verificationStatus: {
        type: String,
        default: 'not_submitted'
    },
    verificationSubmittedAt: {
        type: Date,
        default: null
    },
    lastLogin: {
        type: Date,
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model('user', userSchema);