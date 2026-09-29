// backend/models/Project.js
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
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
    imageUrl: {
        type: String,
        required: true
    },
    projectLink: {
        type: String,
        required: true
    },
    developedBy: {
        type: String,
        required: true,
        trim: true
    },
    developedByEmail: {
        type: String,
        required: true
    },
    technologies: [{
        type: String,
        trim: true
    }],
    category: {
        type: String,
        enum: ['Web Development', 'Mobile App', 'AI/ML', 'Game Development', 'IoT', 'Blockchain', 'Other'],
        default: 'Web Development'
    },
    year: {
        type: Number,
        default: new Date().getFullYear()
    },
    status: {
        type: String,
        enum: ['completed', 'ongoing', 'proposed'],
        default: 'completed'
    },
    featured: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    views: {
        type: Number,
        default: 0
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        comment: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
}, { timestamps: true });

// Add text index for search functionality
projectSchema.index({ title: 'text', description: 'text', technologies: 'text' });

module.exports = mongoose.model('Project', projectSchema);