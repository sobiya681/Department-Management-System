// backend/routes/documentRequest.js
const express = require('express');
const router = express.Router();
const DocumentRequest = require('../models/DocumentRequest');
const User = require('../models/user');
const Notification = require('../models/Notification');
const jwt = require('jsonwebtoken');
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');

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

// Submit Document Request (Student only)
router.post('/submit', verifyToken, async (req, res) => {
    try {
        if (req.user.role !== 'student') {
            return res.status(403).json({ 
                success: false, 
                message: 'Only students can submit document requests' 
            });
        }

        const {
            requestType,
            applicantName,
            fatherName,
            presentAddress,
            permanentAddress,
            cnicNumber,
            phoneNumber,
            cellNumber,
            registrationNumber,
            natureOfDocument,
            bankChallanNo,
            bankChallanDate,
            bankName,
            amountPaid,
            degree,
            faculty,
            major,
            section,
            yearOfPassing,
            marksObtained,
            totalMarks,
            cgpa
        } = req.body;

        // Validate required fields
        if (!requestType || !applicantName || !fatherName || !presentAddress || !permanentAddress ||
            !cnicNumber || !phoneNumber || !cellNumber || !registrationNumber || !natureOfDocument ||
            !bankChallanNo || !bankChallanDate || !amountPaid || !degree || !faculty || !major ||
            !section || !yearOfPassing || !marksObtained || !totalMarks || !cgpa) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        const documentRequest = new DocumentRequest({
            student: req.userId,
            requestType,
            applicantName: applicantName.toUpperCase(),
            fatherName,
            presentAddress,
            permanentAddress,
            cnicNumber,
            phoneNumber,
            cellNumber,
            registrationNumber,
            natureOfDocument,
            bankChallanNo,
            bankChallanDate: new Date(bankChallanDate),
            bankName: bankName || 'National Bank of Pakistan',
            amountPaid,
            degree,
            faculty,
            major,
            section,
            yearOfPassing,
            marksObtained,
            totalMarks,
            cgpa
        });

        await documentRequest.save();

        // Create notification for admin
        const admins = await User.find({ role: 'admin' });
        for (const admin of admins) {
            const notification = new Notification({
                user: admin._id,
                type: 'announcement',
                title: 'New Document Request',
                message: `New ${requestType.toUpperCase()} request from ${applicantName} (${registrationNumber})`,
                data: {
                    requestId: documentRequest._id,
                    requestType: requestType
                }
            });
            await notification.save();
        }

        res.status(201).json({
            success: true,
            message: 'Document request submitted successfully',
            data: documentRequest
        });
    } catch (error) {
        console.error('Document request submission error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
});

// Get student's own document requests
router.get('/my-requests', verifyToken, async (req, res) => {
    try {
        const requests = await DocumentRequest.find({ student: req.userId })
            .sort({ createdAt: -1 });
        
        res.json({
            success: true,
            data: requests
        });
    } catch (error) {
        console.error('Get document requests error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get all document requests (Admin only)
router.get('/all-requests', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const { status, requestType } = req.query;
        let query = {};
        
        if (status) query.status = status;
        if (requestType) query.requestType = requestType;
        
        const requests = await DocumentRequest.find(query)
            .populate('student', 'username name email phone')
            .populate('reviewedBy', 'username name')
            .sort({ createdAt: -1 });
        
        res.json({
            success: true,
            count: requests.length,
            data: requests
        });
    } catch (error) {
        console.error('Get all requests error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get single document request by ID (Admin only)
router.get('/request/:id', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const request = await DocumentRequest.findById(req.params.id)
            .populate('student', 'username name email phone avatar')
            .populate('reviewedBy', 'username name');
        
        if (!request) {
            return res.status(404).json({ success: false, message: 'Request not found' });
        }
        
        res.json({
            success: true,
            data: request
        });
    } catch (error) {
        console.error('Get request error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Update request status (Admin only)
router.put('/review/:id', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const { status, adminComments, expectedPickupDate, trackingNumber } = req.body;
        
        const validStatuses = ['pending', 'approved', 'rejected', 'processing', 'ready_for_pickup', 'dispatched'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }
        
        const documentRequest = await DocumentRequest.findById(req.params.id);
        
        if (!documentRequest) {
            return res.status(404).json({ success: false, message: 'Request not found' });
        }
        
        documentRequest.status = status;
        documentRequest.adminComments = adminComments || documentRequest.adminComments;
        documentRequest.reviewedBy = req.userId;
        documentRequest.reviewedAt = new Date();
        if (expectedPickupDate) documentRequest.expectedPickupDate = new Date(expectedPickupDate);
        if (trackingNumber) documentRequest.trackingNumber = trackingNumber;
        
        await documentRequest.save();
        
        // Create notification for student
        const notification = new Notification({
            user: documentRequest.student,
            type: 'announcement',
            title: `Document Request ${status.toUpperCase()}`,
            message: `Your ${documentRequest.requestType.toUpperCase()} request has been ${status}. ${adminComments ? `Reason: ${adminComments}` : ''}`,
            data: {
                requestId: documentRequest._id,
                status: status
            }
        });
        await notification.save();
        
        res.json({
            success: true,
            message: `Document request ${status} successfully`,
            data: documentRequest
        });
    } catch (error) {
        console.error('Review request error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Download document request as PDF (Admin only)
router.get('/download-pdf/:id', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const request = await DocumentRequest.findById(req.params.id)
            .populate('student', 'username email name phone');
        
        if (!request) {
            return res.status(404).json({ success: false, message: 'Request not found' });
        }
        
        const doc = new PDFDocument({ margin: 50, size: 'A4' });
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=Document_Request_${request.registrationNumber}.pdf`);
        
        doc.pipe(res);
        
        // Header
        doc.fontSize(20)
           .font('Helvetica-Bold')
           .fillColor('#1e40af')
           .text(`${request.requestType.toUpperCase()} REQUEST FORM`, { align: 'center' });
        
        doc.moveDown();
        doc.fontSize(12)
           .font('Helvetica')
           .fillColor('#666666')
           .text(`Request ID: ${request._id}`, { align: 'center' });
        doc.text(`Submission Date: ${new Date(request.submittedAt).toLocaleDateString()}`, { align: 'center' });
        
        doc.moveDown(2);
        
        // Status
        doc.fontSize(14)
           .font('Helvetica-Bold')
           .fillColor('#1e40af')
           .text('Application Status', { underline: true });
        doc.moveDown(0.5);
        
        let statusColor = '#000000';
        if (request.status === 'approved') statusColor = '#059669';
        else if (request.status === 'rejected') statusColor = '#dc2626';
        else if (request.status === 'processing') statusColor = '#d97706';
        else statusColor = '#6b7280';
        
        doc.fontSize(12)
           .font('Helvetica')
           .fillColor(statusColor)
           .text(request.status.toUpperCase());
        
        doc.moveDown(1.5);
        
        // Personal Information
        doc.fontSize(14)
           .font('Helvetica-Bold')
           .fillColor('#1e40af')
           .text('Personal Information', { underline: true });
        doc.moveDown(0.5);
        
        const personalInfo = [
            { label: "Applicant's Name", value: request.applicantName },
            { label: "Father's Name", value: request.fatherName },
            { label: 'CNIC Number', value: request.cnicNumber },
            { label: 'Registration Number', value: request.registrationNumber },
            { label: 'Phone Number', value: request.phoneNumber },
            { label: 'Cell Number', value: request.cellNumber },
            { label: 'Present Address', value: request.presentAddress },
            { label: 'Permanent Address', value: request.permanentAddress }
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
        
        // Academic Information
        doc.fontSize(14)
           .font('Helvetica-Bold')
           .fillColor('#1e40af')
           .text('Academic Information', { underline: true });
        doc.moveDown(0.5);
        
        const academicInfo = [
            { label: 'Degree', value: request.degree },
            { label: 'Faculty', value: request.faculty },
            { label: 'Major/Section', value: `${request.major} - ${request.section}` },
            { label: 'Year of Passing', value: request.yearOfPassing },
            { label: 'Marks Obtained', value: `${request.marksObtained}/${request.totalMarks}` },
            { label: 'Percentage', value: `${request.percentage.toFixed(2)}%` },
            { label: 'CGPA', value: request.cgpa }
        ];
        
        academicInfo.forEach(info => {
            doc.fontSize(11)
               .font('Helvetica-Bold')
               .fillColor('#333333')
               .text(`${info.label}: `, { continued: true })
               .font('Helvetica')
               .fillColor('#666666')
               .text(String(info.value));
            doc.moveDown(0.3);
        });
        
        doc.moveDown(1);
        
        // Bank Challan Details
        doc.fontSize(14)
           .font('Helvetica-Bold')
           .fillColor('#1e40af')
           .text('Bank Challan Details', { underline: true });
        doc.moveDown(0.5);
        
        const bankInfo = [
            { label: 'Bank Challan No.', value: request.bankChallanNo },
            { label: 'Bank Name', value: request.bankName },
            { label: 'Challan Date', value: new Date(request.bankChallanDate).toLocaleDateString() },
            { label: 'Amount Paid', value: `PKR ${request.amountPaid.toLocaleString()}` }
        ];
        
        bankInfo.forEach(info => {
            doc.fontSize(11)
               .font('Helvetica-Bold')
               .fillColor('#333333')
               .text(`${info.label}: `, { continued: true })
               .font('Helvetica')
               .fillColor('#666666')
               .text(info.value);
            doc.moveDown(0.3);
        });
        
        // Admin Comments
        if (request.adminComments) {
            doc.moveDown(1);
            doc.fontSize(14)
               .font('Helvetica-Bold')
               .fillColor('#1e40af')
               .text('Admin Comments', { underline: true });
            doc.moveDown(0.5);
            doc.fontSize(11)
               .font('Helvetica')
               .fillColor('#666666')
               .text(request.adminComments);
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

// Download all document requests as Excel (Admin only)
router.get('/download-all-excel', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const { status, requestType } = req.query;
        let query = {};
        
        if (status) query.status = status;
        if (requestType) query.requestType = requestType;
        
        const requests = await DocumentRequest.find(query)
            .populate('student', 'username name email')
            .sort({ createdAt: -1 });
        
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Document Requests');
        
        // Add title
        worksheet.mergeCells('A1:P1');
        worksheet.getCell('A1').value = 'Document Requests Report';
        worksheet.getCell('A1').font = { size: 16, bold: true };
        worksheet.getCell('A1').alignment = { horizontal: 'center' };
        
        worksheet.mergeCells('A2:P2');
        worksheet.getCell('A2').value = `Generated on ${new Date().toLocaleString()}`;
        worksheet.getCell('A2').alignment = { horizontal: 'center' };
        
        worksheet.addRow([]);
        
        // Headers
        const headers = [
            'S.No', 'Request Type', 'Applicant Name', 'Father Name', 'Registration No',
            'CNIC', 'Phone', 'Cell', 'Degree', 'Faculty', 'Major/Section', 
            'Year of Passing', 'Marks', 'CGPA', 'Status', 'Submitted Date'
        ];
        
        const headerRow = worksheet.addRow(headers);
        headerRow.eachCell((cell) => {
            cell.font = { bold: true };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF1e40af' }
            };
            cell.font = { color: { argb: 'FFFFFFFF' } };
        });
        
        // Data rows
        requests.forEach((request, index) => {
            worksheet.addRow([
                index + 1,
                request.requestType.toUpperCase(),
                request.applicantName,
                request.fatherName,
                request.registrationNumber,
                request.cnicNumber,
                request.phoneNumber,
                request.cellNumber,
                request.degree,
                request.faculty,
                `${request.major} - ${request.section}`,
                request.yearOfPassing,
                `${request.marksObtained}/${request.totalMarks}`,
                request.cgpa,
                request.status.toUpperCase(),
                new Date(request.submittedAt).toLocaleDateString()
            ]);
        });
        
        // Set column widths
        worksheet.columns.forEach(column => {
            column.width = 15;
        });
        
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=Document_Requests.xlsx');
        
        await workbook.xlsx.write(res);
        res.end();
        
    } catch (error) {
        console.error('Excel generation error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get statistics (Admin only)
router.get('/statistics', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const totalRequests = await DocumentRequest.countDocuments();
        const pendingRequests = await DocumentRequest.countDocuments({ status: 'pending' });
        const approvedRequests = await DocumentRequest.countDocuments({ status: 'approved' });
        const rejectedRequests = await DocumentRequest.countDocuments({ status: 'rejected' });
        const processingRequests = await DocumentRequest.countDocuments({ status: 'processing' });
        const readyRequests = await DocumentRequest.countDocuments({ status: 'ready_for_pickup' });
        const dispatchedRequests = await DocumentRequest.countDocuments({ status: 'dispatched' });
        
        const degreeRequests = await DocumentRequest.countDocuments({ requestType: 'degree' });
        const dmcRequests = await DocumentRequest.countDocuments({ requestType: 'dmc' });
        
        res.json({
            success: true,
            statistics: {
                totalRequests,
                pendingRequests,
                approvedRequests,
                rejectedRequests,
                processingRequests,
                readyRequests,
                dispatchedRequests,
                degreeRequests,
                dmcRequests
            }
        });
    } catch (error) {
        console.error('Get statistics error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;