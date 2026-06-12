// backend/routes/projects.js
const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'uploads/projects/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'project-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only image files are allowed'));
    }
};

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: fileFilter
});

// Middleware to verify token and get user
const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ success: false, message: 'No token provided' });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
        const user = await User.findById(decoded.id);
        
        if (!user) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }
        
        req.user = user;
        req.userId = decoded.id;
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(401).json({ success: false, message: 'Invalid token' });
    }
};

// Middleware to verify admin
const verifyAdmin = async (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Access denied. Admin only.' });
    }
    next();
};

// Get all projects (Public - but with auth for likes/comments)
router.get('/', verifyToken, async (req, res) => {
    try {
        const { category, year, status, search, featured } = req.query;
        let query = {};
        
        if (category && category !== 'all') query.category = category;
        if (year) query.year = parseInt(year);
        if (status && status !== 'all') query.status = status;
        if (featured === 'true') query.featured = true;
        if (search) {
            query.$text = { $search: search };
        }
        
        const projects = await Project.find(query)
            .populate('createdBy', 'username name email')
            .populate('likes', 'username name')
            .populate('comments.user', 'username name email')
            .sort({ featured: -1, createdAt: -1 });
        
        res.json({
            success: true,
            projects
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get single project by ID
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate('createdBy', 'username name email')
            .populate('likes', 'username name')
            .populate('comments.user', 'username name email');
        
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        
        // Increment views
        project.views += 1;
        await project.save();
        
        res.json({
            success: true,
            project
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create new project (Admin only)
router.post('/', verifyToken, verifyAdmin, upload.single('image'), async (req, res) => {
    try {
        const { 
            title, 
            description, 
            projectLink, 
            developedBy, 
            developedByEmail,
            technologies, 
            category, 
            year, 
            status,
            featured 
        } = req.body;
        
        // Handle image URL
        let imageUrl = req.body.imageUrl;
        if (req.file) {
            imageUrl = `${req.protocol}://${req.get('host')}/uploads/projects/${req.file.filename}`;
        }
        
        if (!imageUrl) {
            return res.status(400).json({ message: 'Project image is required' });
        }
        
        // Parse technologies if it's a string
        let parsedTechnologies = technologies;
        if (typeof technologies === 'string') {
            parsedTechnologies = technologies.split(',').map(t => t.trim());
        }
        
        const project = new Project({
            title,
            description,
            imageUrl,
            projectLink,
            developedBy,
            developedByEmail,
            technologies: parsedTechnologies || [],
            category: category || 'Web Development',
            year: year || new Date().getFullYear(),
            status: status || 'completed',
            featured: featured === 'true' || featured === true,
            createdBy: req.userId
        });
        
        await project.save();
        
        res.status(201).json({
            success: true,
            message: 'Project created successfully',
            project
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update project (Admin only)
router.put('/:id', verifyToken, verifyAdmin, upload.single('image'), async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        
        const { 
            title, 
            description, 
            projectLink, 
            developedBy, 
            developedByEmail,
            technologies, 
            category, 
            year, 
            status,
            featured 
        } = req.body;
        
        // Handle image update
        let imageUrl = project.imageUrl;
        if (req.file) {
            imageUrl = `${req.protocol}://${req.get('host')}/uploads/projects/${req.file.filename}`;
            // Delete old image if it exists and is not a default/placeholder
            if (project.imageUrl && !project.imageUrl.includes('placeholder')) {
                const oldImagePath = path.join(__dirname, '..', project.imageUrl.replace(`${req.protocol}://${req.get('host')}/`, ''));
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
        } else if (req.body.imageUrl) {
            imageUrl = req.body.imageUrl;
        }
        
        // Parse technologies
        let parsedTechnologies = technologies;
        if (typeof technologies === 'string') {
            parsedTechnologies = technologies.split(',').map(t => t.trim());
        }
        
        project.title = title || project.title;
        project.description = description || project.description;
        project.imageUrl = imageUrl;
        project.projectLink = projectLink || project.projectLink;
        project.developedBy = developedBy || project.developedBy;
        project.developedByEmail = developedByEmail || project.developedByEmail;
        project.technologies = parsedTechnologies || project.technologies;
        project.category = category || project.category;
        project.year = year || project.year;
        project.status = status || project.status;
        project.featured = featured === 'true' || featured === true;
        
        await project.save();
        
        res.json({
            success: true,
            message: 'Project updated successfully',
            project
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete project (Admin only)
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        
        // Delete image file
        if (project.imageUrl && !project.imageUrl.includes('placeholder')) {
            const imagePath = path.join(__dirname, '..', project.imageUrl.replace(`${req.protocol}://${req.get('host')}/`, ''));
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }
        
        await project.deleteOne();
        
        res.json({
            success: true,
            message: 'Project deleted successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Like/Unlike project
router.post('/:id/like', verifyToken, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        
        const likeIndex = project.likes.indexOf(req.userId);
        
        if (likeIndex === -1) {
            project.likes.push(req.userId);
        } else {
            project.likes.splice(likeIndex, 1);
        }
        
        await project.save();
        
        res.json({
            success: true,
            likes: project.likes.length,
            isLiked: likeIndex === -1
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add comment to project
router.post('/:id/comment', verifyToken, async (req, res) => {
    try {
        const { comment } = req.body;
        
        if (!comment || comment.trim() === '') {
            return res.status(400).json({ message: 'Comment cannot be empty' });
        }
        
        const project = await Project.findById(req.params.id);
        
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        
        project.comments.push({
            user: req.userId,
            comment: comment.trim()
        });
        
        await project.save();
        
        const updatedProject = await Project.findById(req.params.id)
            .populate('comments.user', 'username name email');
        
        res.json({
            success: true,
            comments: updatedProject.comments
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get project statistics (Admin only)
router.get('/stats/overview', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const totalProjects = await Project.countDocuments();
        const completedProjects = await Project.countDocuments({ status: 'completed' });
        const ongoingProjects = await Project.countDocuments({ status: 'ongoing' });
        const proposedProjects = await Project.countDocuments({ status: 'proposed' });
        const featuredProjects = await Project.countDocuments({ featured: true });
        
        const categoryStats = await Project.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } }
        ]);
        
        const yearStats = await Project.aggregate([
            { $group: { _id: '$year', count: { $sum: 1 } } }
        ]);
        
        const totalViews = await Project.aggregate([
            { $group: { _id: null, total: { $sum: '$views' } } }
        ]);
        
        res.json({
            success: true,
            stats: {
                totalProjects,
                completedProjects,
                ongoingProjects,
                proposedProjects,
                featuredProjects,
                categoryStats,
                yearStats,
                totalViews: totalViews[0]?.total || 0
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;