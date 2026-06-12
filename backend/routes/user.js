const { Router } = require('express');
const user = require('../models/user.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = Router();

// Sign up API with role support
router.post('/sign-up', async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        if (username.length <= 3) {
            return res.status(400).json({
                success: false,
                message: 'Username should be greater than 3 characters'
            });
        }

        const existingUser = await user.findOne({ username: username });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Username already exists"
            });
        }

        const existingEmail = await user.findOne({ email: email });
        if (existingEmail) {
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password should be at least 6 characters'
            });
        }

        let userRole = 'student';
        if (role && ['student', 'teacher', 'admin'].includes(role)) {
            userRole = role;
        }

        const hashPass = await bcrypt.hash(password, 10);

        const newUser = new user({
            username,
            email,
            password: hashPass,
            role: userRole,
            name: username
        });

        await newUser.save();

        const token = jwt.sign(
            {
                id: newUser._id,
                username: newUser.username,
                role: newUser.role
            },
            process.env.JWT_SECRET || 'your_secret_key',
            { expiresIn: '7d' }
        );

        res.status(201).json({
            success: true,
            message: `${userRole === 'teacher' ? 'Teacher' : 'Student'} registered successfully`,
            token,
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role,
                avatar: newUser.avatar
            }
        });

    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

// Sign in API
router.post('/sign-in', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide username and password"
            });
        }

        const existingUser = await user.findOne({ username });
        if (!existingUser) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const isPasswordValid = await bcrypt.compare(password, existingUser.password);

        if (isPasswordValid) {
            existingUser.lastLogin = Date.now();
            await existingUser.save();

            const token = jwt.sign(
                {
                    id: existingUser._id,
                    username: existingUser.username,
                    role: existingUser.role
                },
                process.env.JWT_SECRET || 'your_secret_key',
                { expiresIn: "7d" }
            );

            res.status(200).json({
                success: true,
                message: "Login successful",
                id: existingUser._id,
                role: existingUser.role,
                username: existingUser.username,
                token
            });
        } else {
            res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

    } catch (error) {
        console.error('Signin error:', error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

// Get user information
router.get('/get-user-information', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No token provided"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
        const userData = await user.findById(decoded.id).select('-password');

        if (!userData) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            user: userData
        });
    } catch (error) {
        console.error('Get user error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Update user profile - FIXED
// backend/routes/user.js - Update the update-profile route

// Update user profile
router.put('/update-profile', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No token provided"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');

        console.log('Updating profile for user:', decoded.id);
        console.log('Request body:', req.body);

        // Fields that can be updated - INCLUDING designation and qualification
        const updateData = {};

        if (req.body.name !== undefined) updateData.name = req.body.name;
        if (req.body.phone !== undefined) updateData.phone = req.body.phone;
        if (req.body.address !== undefined) updateData.address = req.body.address;
        if (req.body.department !== undefined) updateData.department = req.body.department;
        if (req.body.program !== undefined) updateData.program = req.body.program;
        if (req.body.agNumber !== undefined) updateData.agNumber = req.body.agNumber;
        
        // Teacher-specific fields
        if (req.body.designation !== undefined) updateData.designation = req.body.designation;
        if (req.body.qualification !== undefined) updateData.qualification = req.body.qualification;

        console.log('Update data:', updateData);

        const updatedUser = await user.findByIdAndUpdate(
            decoded.id,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        console.log('User updated successfully:', updatedUser.username);
        console.log('Updated designation:', updatedUser.designation);
        console.log('Updated qualification:', updatedUser.qualification);

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser
        });
    } catch (error) {
        console.error('Update profile error:', error);
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "AG Number already exists. Please use a unique AG Number."
            });
        }
        return res.status(500).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
});

// Update password - FIXED
router.put('/update-password', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No token provided"
            });
        }

        const { currentPassword, newPassword } = req.body;

        console.log('Password update request for token:', token.substring(0, 20) + '...');

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Please provide current and new password"
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: "New password must be at least 6 characters"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
        const userData = await user.findById(decoded.id).select('+password');

        if (!userData) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Verify current password
        const isPasswordValid = await bcrypt.compare(currentPassword, userData.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Current password is incorrect"
            });
        }

        // Hash new password
        const hashPass = await bcrypt.hash(newPassword, 10);
        userData.password = hashPass;
        await userData.save();

        console.log('Password updated successfully for user:', userData.username);

        return res.status(200).json({
            success: true,
            message: "Password updated successfully"
        });
    } catch (error) {
        console.error('Update password error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
});

// Submit verification documents - FIXED
router.post('/submit-verification', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No token provided"
            });
        }

        const { cnicNumber, fatherName, dateOfBirth, address } = req.body;

        console.log('Verification data received:', { cnicNumber, fatherName, dateOfBirth, address });

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');

        const userData = await user.findById(decoded.id);

        if (!userData) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Store verification documents as a plain object
        const verificationDocs = {
            cnicNumber: cnicNumber,
            fatherName: fatherName,
            dateOfBirth: dateOfBirth,
            permanentAddress: address
        };

        userData.verificationDocuments = verificationDocs;
        userData.verificationStatus = 'pending';
        userData.verificationSubmittedAt = new Date();
        userData.isVerified = false;

        await userData.save();

        console.log('Verification submitted successfully for user:', userData.username);

        return res.status(200).json({
            success: true,
            message: "Verification documents submitted successfully. Admin will review your application."
        });
    } catch (error) {
        console.error('Submit verification error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
});

// Get verification status
router.get('/verification-status', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No token provided"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
        const userData = await user.findById(decoded.id).select('verificationStatus verificationDocuments verificationSubmittedAt isVerified');

        if (!userData) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            verificationStatus: userData.verificationStatus,
            isVerified: userData.isVerified,
            verificationSubmittedAt: userData.verificationSubmittedAt,
            verificationDocuments: userData.verificationDocuments
        });
    } catch (error) {
        console.error('Get verification status error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

const verifyAdmin = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ success: false, message: 'No token provided' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
        const adminUser = await user.findById(decoded.id);
        if (adminUser.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Access denied. Admin only.' });
        }
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
    }
};

// Get all students
router.get('/students', verifyAdmin, async (req, res) => {
    try {
        const students = await user.find({ role: 'student' }).select('-password');
        res.json({ success: true, students });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get all teachers
router.get('/teachers', verifyAdmin, async (req, res) => {
    try {
        const teachers = await user.find({ role: 'teacher' }).select('-password');
        res.json({ success: true, teachers });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Verify student
router.put('/verify-student/:id', verifyAdmin, async (req, res) => {
    try {
        const { status } = req.body;
        const student = await user.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }
        student.isVerified = status === 'approved';
        student.verificationStatus = status;
        await student.save();
        res.json({ success: true, message: `Student ${status} successfully` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});


module.exports = router;