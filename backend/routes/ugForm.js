// backend/routes/ugForm.js
const { Router } = require('express');
const UGForm = require('../models/UGForm');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
// backend/routes/ugForm.js - Add these new routes

const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const router = Router();

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

// Submit or update UG Form (Student only)
router.post('/submit', verifyToken, async (req, res) => {
    try {
        // Check if user is student
        if (req.user.role !== 'student') {
            return res.status(403).json({ 
                success: false, 
                message: 'Only students can submit UG forms' 
            });
        }

        const {
            studentName,
            fatherName,
            registrationNumber,
            dateOfFirstEnrollment,
            section,
            permanentAddress,
            contactNumber,
            email,
            courses
        } = req.body;

        // Validate required fields
        if (!studentName || !fatherName || !registrationNumber || !dateOfFirstEnrollment ||
            !section || !permanentAddress || !contactNumber || !email || !courses || courses.length !== 6) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required and exactly 6 courses must be provided'
            });
        }

        // Check if form already exists
        let ugForm = await UGForm.findOne({ student: req.userId });

        if (ugForm) {
            // Update existing form
            ugForm.studentName = studentName;
            ugForm.fatherName = fatherName;
            ugForm.registrationNumber = registrationNumber;
            ugForm.dateOfFirstEnrollment = new Date(dateOfFirstEnrollment);
            ugForm.section = section;
            ugForm.permanentAddress = permanentAddress;
            ugForm.contactNumber = contactNumber;
            ugForm.email = email;
            ugForm.courses = courses;
            ugForm.lastModified = new Date();
            
            await ugForm.save();
            
            return res.status(200).json({
                success: true,
                message: 'UG Form updated successfully',
                data: ugForm
            });
        } else {
            // Create new form
            ugForm = new UGForm({
                student: req.userId,
                studentName,
                fatherName,
                registrationNumber,
                dateOfFirstEnrollment: new Date(dateOfFirstEnrollment),
                section,
                permanentAddress,
                contactNumber,
                email,
                courses
            });
            
            await ugForm.save();
            
            return res.status(201).json({
                success: true,
                message: 'UG Form submitted successfully',
                data: ugForm
            });
        }
    } catch (error) {
        console.error('UG Form submission error:', error);
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Registration number already exists. Please use a unique registration number.'
            });
        }
        return res.status(500).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
});

// Get student's own UG Form
router.get('/my-form', verifyToken, async (req, res) => {
    try {
        const ugForm = await UGForm.findOne({ student: req.userId });
        
        if (!ugForm) {
            return res.status(404).json({
                success: false,
                message: 'No UG form found'
            });
        }
        
        return res.status(200).json({
            success: true,
            data: ugForm
        });
    } catch (error) {
        console.error('Get UG form error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
});

// Submit form for review (change status from draft to submitted)
router.put('/submit-for-review', verifyToken, async (req, res) => {
    try {
        const ugForm = await UGForm.findOne({ student: req.userId });
        
        if (!ugForm) {
            return res.status(404).json({
                success: false,
                message: 'No UG form found'
            });
        }
        
        ugForm.status = 'submitted';
        ugForm.submittedAt = new Date();
        await ugForm.save();
        
        return res.status(200).json({
            success: true,
            message: 'UG Form submitted for review successfully',
            data: ugForm
        });
    } catch (error) {
        console.error('Submit for review error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
});

// Get all UG forms (Admin only)
router.get('/all-forms', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const { status, section } = req.query;
        let query = {};
        
        if (status) query.status = status;
        if (section) query.section = section;
        
        const forms = await UGForm.find(query)
            .populate('student', 'username email name phone')
            .populate('reviewedBy', 'username name')
            .sort({ createdAt: -1 });
        
        return res.status(200).json({
            success: true,
            count: forms.length,
            data: forms
        });
    } catch (error) {
        console.error('Get all forms error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
});

// Get single UG form by ID (Admin only)
router.get('/form/:id', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const form = await UGForm.findById(req.params.id)
            .populate('student', 'username email name phone avatar')
            .populate('reviewedBy', 'username name');
        
        if (!form) {
            return res.status(404).json({
                success: false,
                message: 'UG Form not found'
            });
        }
        
        return res.status(200).json({
            success: true,
            data: form
        });
    } catch (error) {
        console.error('Get form by ID error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
});

// Approve or reject UG form (Admin only)
router.put('/review/:id', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const { status, adminComments } = req.body;
        
        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Status must be either approved or rejected'
            });
        }
        
        const ugForm = await UGForm.findById(req.params.id);
        
        if (!ugForm) {
            return res.status(404).json({
                success: false,
                message: 'UG Form not found'
            });
        }
        
        ugForm.status = status;
        ugForm.adminComments = adminComments || '';
        ugForm.reviewedBy = req.userId;
        ugForm.reviewedAt = new Date();
        
        await ugForm.save();
        
        // Also update user's verification status if approved
        if (status === 'approved') {
            await User.findByIdAndUpdate(ugForm.student, {
                isVerified: true,
                verificationStatus: 'approved',
                enrollmentNumber: ugForm.registrationNumber
            });
        }
        
        return res.status(200).json({
            success: true,
            message: `UG Form ${status} successfully`,
            data: ugForm
        });
    } catch (error) {
        console.error('Review form error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
});

// Delete UG form (Admin only)
router.delete('/delete/:id', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const ugForm = await UGForm.findByIdAndDelete(req.params.id);
        
        if (!ugForm) {
            return res.status(404).json({
                success: false,
                message: 'UG Form not found'
            });
        }
        
        return res.status(200).json({
            success: true,
            message: 'UG Form deleted successfully'
        });
    } catch (error) {
        console.error('Delete form error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
});

// Get statistics for admin dashboard
router.get('/statistics', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const totalForms = await UGForm.countDocuments();
        const submittedForms = await UGForm.countDocuments({ status: 'submitted' });
        const approvedForms = await UGForm.countDocuments({ status: 'approved' });
        const rejectedForms = await UGForm.countDocuments({ status: 'rejected' });
        const draftForms = await UGForm.countDocuments({ status: 'draft' });
        
        const sectionWise = await UGForm.aggregate([
            { $group: { _id: '$section', count: { $sum: 1 } } }
        ]);
        
        return res.status(200).json({
            success: true,
            statistics: {
                totalForms,
                submittedForms,
                approvedForms,
                rejectedForms,
                draftForms,
                sectionWise
            }
        });
    } catch (error) {
        console.error('Get statistics error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
});


// Download UG Form as PDF (Admin only)
router.get('/download-pdf/:id', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const ugForm = await UGForm.findById(req.params.id)
            .populate('student', 'username email name phone');
        
        if (!ugForm) {
            return res.status(404).json({ success: false, message: 'UG Form not found' });
        }
        
        // Create PDF document
        const doc = new PDFDocument({ margin: 50, size: 'A4' });
        
        // Set response headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=UG_Form_${ugForm.registrationNumber}.pdf`);
        
        doc.pipe(res);
        
        // Add header
        doc.fontSize(20)
           .font('Helvetica-Bold')
           .fillColor('#1e40af')
           .text('UG Program Application Form', { align: 'center' });
        
        doc.moveDown();
        doc.fontSize(12)
           .font('Helvetica')
           .fillColor('#666666')
           .text(`Registration Number: ${ugForm.registrationNumber}`, { align: 'center' });
        doc.text(`Submission Date: ${new Date(ugForm.submittedAt || ugForm.createdAt).toLocaleDateString()}`, { align: 'center' });
        
        doc.moveDown(2);
        
        // Status Badge
        doc.fontSize(14)
           .font('Helvetica-Bold')
           .fillColor('#1e40af')
           .text('Application Status', { underline: true });
        doc.moveDown(0.5);
        
        let statusColor = '#000000';
        let statusText = ugForm.status.toUpperCase();
        if (ugForm.status === 'approved') statusColor = '#059669';
        else if (ugForm.status === 'rejected') statusColor = '#dc2626';
        else if (ugForm.status === 'submitted') statusColor = '#d97706';
        
        doc.fontSize(12)
           .font('Helvetica')
           .fillColor(statusColor)
           .text(statusText);
        
        doc.moveDown(1.5);
        
        // Personal Information Section
        doc.fontSize(14)
           .font('Helvetica-Bold')
           .fillColor('#1e40af')
           .text('Personal Information', { underline: true });
        doc.moveDown(0.5);
        
        const personalInfo = [
            { label: 'Student Name', value: ugForm.studentName },
            { label: "Father's Name", value: ugForm.fatherName },
            { label: 'Registration Number', value: ugForm.registrationNumber },
            { label: 'Date of First Enrollment', value: new Date(ugForm.dateOfFirstEnrollment).toLocaleDateString() },
            { label: 'Section', value: ugForm.section }
        ];
        
        personalInfo.forEach(info => {
            doc.fontSize(11)
               .font('Helvetica-Bold')
               .fillColor('#333333')
               .text(`${info.label}: `, { continued: true })
               .font('Helvetica')
               .fillColor('#666666')
               .text(info.value);
            doc.moveDown(0.3);
        });
        
        doc.moveDown(1);
        
        // Contact Information Section
        doc.fontSize(14)
           .font('Helvetica-Bold')
           .fillColor('#1e40af')
           .text('Contact Information', { underline: true });
        doc.moveDown(0.5);
        
        const contactInfo = [
            { label: 'Email Address', value: ugForm.email },
            { label: 'Contact Number', value: ugForm.contactNumber },
            { label: 'Permanent Address', value: ugForm.permanentAddress }
        ];
        
        contactInfo.forEach(info => {
            doc.fontSize(11)
               .font('Helvetica-Bold')
               .fillColor('#333333')
               .text(`${info.label}: `, { continued: true })
               .font('Helvetica')
               .fillColor('#666666')
               .text(info.value);
            doc.moveDown(0.3);
        });
        
        doc.moveDown(1);
        
        // Courses Section
        doc.fontSize(14)
           .font('Helvetica-Bold')
           .fillColor('#1e40af')
           .text('Registered Courses', { underline: true });
        doc.moveDown(0.5);
        
        // Course table
        const tableTop = doc.y;
        const tableHeaders = ['S.No', 'Course Name', 'Course Code', 'Credit Hours'];
        const columnWidths = [50, 200, 100, 100];
        
        // Draw header row
        let currentY = tableTop;
        let currentX = 50;
        
        doc.font('Helvetica-Bold').fontSize(10).fillColor('#ffffff');
        doc.rect(currentX, currentY, 50, 20).fill('#1e40af');
        doc.rect(currentX + 50, currentY, 200, 20).fill('#1e40af');
        doc.rect(currentX + 250, currentY, 100, 20).fill('#1e40af');
        doc.rect(currentX + 350, currentY, 100, 20).fill('#1e40af');
        
        doc.fillColor('#ffffff')
           .text('S.No', currentX + 15, currentY + 5)
           .text('Course Name', currentX + 55, currentY + 5)
           .text('Course Code', currentX + 260, currentY + 5)
           .text('Credit Hours', currentX + 365, currentY + 5);
        
        doc.fillColor('#333333');
        currentY += 20;
        
        // Draw data rows
        ugForm.courses.forEach((course, index) => {
            const rowColor = index % 2 === 0 ? '#f3f4f6' : '#ffffff';
            doc.rect(currentX, currentY, 50, 20).fill(rowColor);
            doc.rect(currentX + 50, currentY, 200, 20).fill(rowColor);
            doc.rect(currentX + 250, currentY, 100, 20).fill(rowColor);
            doc.rect(currentX + 350, currentY, 100, 20).fill(rowColor);
            
            doc.fillColor('#333333')
               .font('Helvetica')
               .fontSize(10)
               .text(String(index + 1), currentX + 15, currentY + 5)
               .text(course.courseName, currentX + 55, currentY + 5)
               .text(course.courseCode, currentX + 260, currentY + 5)
               .text(String(course.creditHours), currentX + 365, currentY + 5);
            
            currentY += 20;
        });
        
        // Total credit hours
        doc.rect(currentX, currentY, 350, 20).fill('#e5e7eb');
        doc.rect(currentX + 350, currentY, 100, 20).fill('#e5e7eb');
        doc.fillColor('#333333')
           .font('Helvetica-Bold')
           .text('Total Credit Hours:', currentX + 15, currentY + 5)
           .text(String(ugForm.totalCreditHours), currentX + 365, currentY + 5);
        
        doc.moveDown(2);
        
        // Admin Comments (if any)
        if (ugForm.adminComments) {
            doc.fontSize(14)
               .font('Helvetica-Bold')
               .fillColor('#1e40af')
               .text('Admin Comments', { underline: true });
            doc.moveDown(0.5);
            doc.fontSize(11)
               .font('Helvetica')
               .fillColor('#666666')
               .text(ugForm.adminComments);
        }
        
        // Footer
        const pageCount = doc.bufferedPageRange().count;
        for (let i = 0; i < pageCount; i++) {
            doc.switchToPage(i);
            doc.fontSize(8)
               .fillColor('#999999')
               .text(
                   `Generated on ${new Date().toLocaleString()} - Page ${i + 1} of ${pageCount}`,
                   50,
                   doc.page.height - 50,
                   { align: 'center' }
               );
        }
        
        doc.end();
        
    } catch (error) {
        console.error('PDF generation error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Download UG Form as CSV (Admin only)
router.get('/download-csv/:id', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const ugForm = await UGForm.findById(req.params.id)
            .populate('student', 'username email name phone');
        
        if (!ugForm) {
            return res.status(404).json({ success: false, message: 'UG Form not found' });
        }
        
        // Create workbook and worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('UG Form Details');
        
        // Add title
        worksheet.mergeCells('A1:F1');
        worksheet.getCell('A1').value = 'UG Program Application Form';
        worksheet.getCell('A1').font = { size: 16, bold: true };
        worksheet.getCell('A1').alignment = { horizontal: 'center' };
        
        worksheet.mergeCells('A2:F2');
        worksheet.getCell('A2').value = `Registration Number: ${ugForm.registrationNumber}`;
        worksheet.getCell('A2').alignment = { horizontal: 'center' };
        
        worksheet.addRow([]);
        
        // Application Status
        worksheet.getCell('A4').value = 'Application Status:';
        worksheet.getCell('A4').font = { bold: true };
        worksheet.getCell('B4').value = ugForm.status.toUpperCase();
        
        // Personal Information Section
        worksheet.addRow([]);
        worksheet.getCell('A6').value = 'PERSONAL INFORMATION';
        worksheet.getCell('A6').font = { bold: true, size: 12 };
        worksheet.getCell('A6').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF1e40af' }
        };
        worksheet.getCell('A6').font = { color: { argb: 'FFFFFFFF' } };
        
        const personalData = [
            ['Student Name:', ugForm.studentName],
            ["Father's Name:", ugForm.fatherName],
            ['Registration Number:', ugForm.registrationNumber],
            ['Date of First Enrollment:', new Date(ugForm.dateOfFirstEnrollment).toLocaleDateString()],
            ['Section:', ugForm.section]
        ];
        
        personalData.forEach((row, index) => {
            const rowNum = 7 + index;
            worksheet.getCell(`A${rowNum}`).value = row[0];
            worksheet.getCell(`A${rowNum}`).font = { bold: true };
            worksheet.getCell(`B${rowNum}`).value = row[1];
        });
        
        // Contact Information Section
        worksheet.addRow([]);
        const contactStartRow = 7 + personalData.length + 1;
        worksheet.getCell(`A${contactStartRow}`).value = 'CONTACT INFORMATION';
        worksheet.getCell(`A${contactStartRow}`).font = { bold: true, size: 12 };
        worksheet.getCell(`A${contactStartRow}`).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF1e40af' }
        };
        worksheet.getCell(`A${contactStartRow}`).font = { color: { argb: 'FFFFFFFF' } };
        
        const contactData = [
            ['Email Address:', ugForm.email],
            ['Contact Number:', ugForm.contactNumber],
            ['Permanent Address:', ugForm.permanentAddress]
        ];
        
        contactData.forEach((row, index) => {
            const rowNum = contactStartRow + 1 + index;
            worksheet.getCell(`A${rowNum}`).value = row[0];
            worksheet.getCell(`A${rowNum}`).font = { bold: true };
            worksheet.getCell(`B${rowNum}`).value = row[1];
        });
        
        // Courses Section
        const courseStartRow = contactStartRow + contactData.length + 2;
        worksheet.getCell(`A${courseStartRow}`).value = 'REGISTERED COURSES';
        worksheet.getCell(`A${courseStartRow}`).font = { bold: true, size: 12 };
        worksheet.getCell(`A${courseStartRow}`).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF1e40af' }
        };
        worksheet.getCell(`A${courseStartRow}`).font = { color: { argb: 'FFFFFFFF' } };
        
        // Course headers
        const headerRow = courseStartRow + 1;
        worksheet.getCell(`A${headerRow}`).value = 'S.No';
        worksheet.getCell(`B${headerRow}`).value = 'Course Name';
        worksheet.getCell(`C${headerRow}`).value = 'Course Code';
        worksheet.getCell(`D${headerRow}`).value = 'Credit Hours';
        
        for (let i = 1; i <= 4; i++) {
            worksheet.getCell(getColumnLetter(i) + headerRow).font = { bold: true };
            worksheet.getCell(getColumnLetter(i) + headerRow).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFe5e7eb' }
            };
        }
        
        // Course data
        ugForm.courses.forEach((course, index) => {
            const rowNum = headerRow + 1 + index;
            worksheet.getCell(`A${rowNum}`).value = index + 1;
            worksheet.getCell(`B${rowNum}`).value = course.courseName;
            worksheet.getCell(`C${rowNum}`).value = course.courseCode;
            worksheet.getCell(`D${rowNum}`).value = course.creditHours;
        });
        
        // Total credit hours
        const totalRow = headerRow + ugForm.courses.length + 1;
        worksheet.getCell(`C${totalRow}`).value = 'Total Credit Hours:';
        worksheet.getCell(`C${totalRow}`).font = { bold: true };
        worksheet.getCell(`D${totalRow}`).value = ugForm.totalCreditHours;
        worksheet.getCell(`D${totalRow}`).font = { bold: true };
        worksheet.getCell(`D${totalRow}`).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFe0f2fe' }
        };
        
        // Admin Comments
        if (ugForm.adminComments) {
            const commentRow = totalRow + 2;
            worksheet.getCell(`A${commentRow}`).value = 'Admin Comments:';
            worksheet.getCell(`A${commentRow}`).font = { bold: true };
            worksheet.mergeCells(`B${commentRow}:D${commentRow}`);
            worksheet.getCell(`B${commentRow}`).value = ugForm.adminComments;
        }
        
        // Set column widths
        worksheet.getColumn(1).width = 10;  // S.No
        worksheet.getColumn(2).width = 35;  // Course Name
        worksheet.getColumn(3).width = 20;  // Course Code
        worksheet.getColumn(4).width = 15;  // Credit Hours
        
        // Generate CSV file
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=UG_Form_${ugForm.registrationNumber}.xlsx`);
        
        await workbook.xlsx.write(res);
        res.end();
        
    } catch (error) {
        console.error('CSV generation error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Helper function to get column letter
function getColumnLetter(columnNumber) {
    let letter = '';
    while (columnNumber > 0) {
        const remainder = (columnNumber - 1) % 26;
        letter = String.fromCharCode(65 + remainder) + letter;
        columnNumber = Math.floor((columnNumber - 1) / 26);
    }
    return letter;
}
module.exports = router;