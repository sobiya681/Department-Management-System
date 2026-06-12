// backend/routes/courses.js
const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const User = require('../models/user');
const UGForm = require('../models/UGForm');
const Notification = require('../models/Notification');
const jwt = require('jsonwebtoken');

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

// Middleware to verify teacher
const verifyTeacher = async (req, res, next) => {
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Access denied. Teachers only.' });
    }
    next();
};

// ==================== NOTIFICATION ROUTES (MUST COME BEFORE PARAMETERIZED ROUTES) ====================

// Get student notifications
router.get('/notifications', verifyToken, async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.userId })
            .sort({ createdAt: -1 })
            .limit(50);
        
        const unreadCount = await Notification.countDocuments({ user: req.userId, isRead: false });
        
        res.json({
            success: true,
            notifications,
            unreadCount
        });
    } catch (error) {
        console.error('Get notifications error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Mark notification as read
router.put('/notifications/:id/read', verifyToken, async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, user: req.userId },
            { isRead: true },
            { new: true }
        );
        
        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notification not found' });
        }
        
        res.json({
            success: true,
            notification
        });
    } catch (error) {
        console.error('Mark notification read error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==================== STUDENT ROUTES ====================

// Get student's enrolled courses
router.get('/student/my-courses', verifyToken, async (req, res) => {
    try {
        if (req.user.role !== 'student') {
            return res.status(403).json({ success: false, message: 'Access denied. Students only.' });
        }
        
        const courses = await Course.find({
            enrolledStudents: req.userId,
            isActive: true
        }).populate('teacher', 'name email username');
        
        res.json({
            success: true,
            courses
        });
    } catch (error) {
        console.error('Get student courses error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get all students (Admin & Teachers)
router.get('/students/all', verifyToken, verifyTeacher, async (req, res) => {
    try {
        const { program, search } = req.query;
        let query = { role: 'student' };
        
        if (program && program !== 'all') {
            query.program = program;
        }
        
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { agNumber: { $regex: search, $options: 'i' } }
            ];
        }
        
        const students = await User.find(query)
            .select('-password')
            .sort({ createdAt: -1 });
        
        // Get UG form data for each student
        const studentsWithForms = await Promise.all(students.map(async (student) => {
            const ugForm = await UGForm.findOne({ student: student._id });
            return {
                ...student.toObject(),
                ugForm: ugForm || null
            };
        }));
        
        res.json({
            success: true,
            students: studentsWithForms,
            total: studentsWithForms.length
        });
    } catch (error) {
        console.error('Get students error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==================== COURSE CRUD OPERATIONS ====================

// Get all courses (Admin & Teachers)
router.get('/all', verifyToken, verifyTeacher, async (req, res) => {
    try {
        let query = {};
        
        // If teacher, show only their courses
        if (req.user.role === 'teacher') {
            query.teacher = req.userId;
        }
        
        const courses = await Course.find(query)
            .populate('teacher', 'name email username')
            .populate('enrolledStudents', 'name email username program')
            .populate('createdBy', 'name username')
            .sort({ createdAt: -1 });
        
        res.json({
            success: true,
            courses
        });
    } catch (error) {
        console.error('Get courses error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Create course (Admin only)
router.post('/create', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const { courseCode, courseName, title, description, creditHours, department, semester } = req.body;

        // Check if course code already exists
        const existingCourse = await Course.findOne({ courseCode });
        if (existingCourse) {
            return res.status(400).json({
                success: false,
                message: 'Course code already exists'
            });
        }

        const course = new Course({
            courseCode: courseCode.toUpperCase(),
            courseName,
            title,
            description,
            creditHours,
            department,
            semester,
            teacher: req.body.teacherId || req.userId,
            createdBy: req.userId
        });

        await course.save();

        res.status(201).json({
            success: true,
            message: 'Course created successfully',
            course
        });
    } catch (error) {
        console.error('Create course error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get enrolled students for a course (must come before /:id routes)
router.get('/:courseId/students', verifyToken, verifyTeacher, async (req, res) => {
    try {
        console.log('Fetching students for course:', req.params.courseId);
        
        const course = await Course.findById(req.params.courseId)
            .populate('enrolledStudents', '-password')
            .populate('teacher', 'name email');
        
        if (!course) {
            console.log('Course not found:', req.params.courseId);
            return res.status(404).json({ success: false, message: 'Course not found' });
        }
        
        console.log('Course found:', course.courseName);
        console.log('Enrolled students count:', course.enrolledStudents?.length || 0);
        
        res.json({
            success: true,
            students: course.enrolledStudents || [],
            course: {
                id: course._id,
                name: course.courseName,
                code: course.courseCode
            }
        });
    } catch (error) {
        console.error('Get enrolled students error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Add students to course (Teacher/Admin)
router.post('/:courseId/add-students', verifyToken, verifyTeacher, async (req, res) => {
    try {
        const { studentIds } = req.body;
        const course = await Course.findById(req.params.courseId);
        
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }
        
        // Check if teacher owns this course
        if (req.user.role === 'teacher' && course.teacher.toString() !== req.userId) {
            return res.status(403).json({ success: false, message: 'You can only add students to your own courses' });
        }
        
        const addedStudents = [];
        const alreadyEnrolled = [];
        
        for (const studentId of studentIds) {
            const student = await User.findById(studentId);
            if (!student || student.role !== 'student') {
                continue;
            }
            
            if (!course.enrolledStudents.includes(studentId)) {
                course.enrolledStudents.push(studentId);
                addedStudents.push(student);
                
                // Create notification for student
                const notification = new Notification({
                    user: studentId,
                    type: 'course_enrollment',
                    title: 'Course Enrollment',
                    message: `You have been enrolled in ${course.courseName} (${course.courseCode})`,
                    data: {
                        courseId: course._id,
                        courseName: course.courseName,
                        courseCode: course.courseCode,
                        teacherName: req.user.name
                    }
                });
                await notification.save();
            } else {
                alreadyEnrolled.push(student);
            }
        }
        
        await course.save();
        
        res.json({
            success: true,
            message: `${addedStudents.length} students added to course`,
            addedStudents: addedStudents.map(s => ({ id: s._id, name: s.name, email: s.email })),
            alreadyEnrolled: alreadyEnrolled.map(s => ({ id: s._id, name: s.name, email: s.email }))
        });
    } catch (error) {
        console.error('Add students error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Remove student from course
router.delete('/:courseId/students/:studentId', verifyToken, verifyTeacher, async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId);
        
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }
        
        if (req.user.role === 'teacher' && course.teacher.toString() !== req.userId) {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }
        
        course.enrolledStudents = course.enrolledStudents.filter(
            id => id.toString() !== req.params.studentId
        );
        
        await course.save();
        
        res.json({
            success: true,
            message: 'Student removed from course'
        });
    } catch (error) {
        console.error('Remove student error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get single course (must come after specific routes)
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
            .populate('teacher', 'name email username')
            .populate('enrolledStudents', 'name email username program agNumber enrollmentNumber')
            .populate('createdBy', 'name username');
        
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }
        
        res.json({
            success: true,
            course
        });
    } catch (error) {
        console.error('Get course error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Update course (Admin only)
router.put('/update/:id', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const { courseCode, courseName, title, description, creditHours, department, semester, teacherId, isActive } = req.body;
        
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }
        
        // Check if new course code conflicts
        if (courseCode && courseCode !== course.courseCode) {
            const existingCourse = await Course.findOne({ courseCode: courseCode.toUpperCase() });
            if (existingCourse) {
                return res.status(400).json({ success: false, message: 'Course code already exists' });
            }
            course.courseCode = courseCode.toUpperCase();
        }
        
        course.courseName = courseName || course.courseName;
        course.title = title || course.title;
        course.description = description || course.description;
        course.creditHours = creditHours || course.creditHours;
        course.department = department || course.department;
        course.semester = semester || course.semester;
        if (teacherId) course.teacher = teacherId;
        if (typeof isActive === 'boolean') course.isActive = isActive;
        
        await course.save();
        
        res.json({
            success: true,
            message: 'Course updated successfully',
            course
        });
    } catch (error) {
        console.error('Update course error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Delete course (Admin only)
router.delete('/delete/:id', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }
        
        await course.deleteOne();
        
        res.json({
            success: true,
            message: 'Course deleted successfully'
        });
    } catch (error) {
        console.error('Delete course error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;