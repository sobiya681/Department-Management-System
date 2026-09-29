// src/components/Student/DocumentRequest.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    FileText,
    Send,
    Save,
    X,
    CheckCircle,
    AlertCircle,
    Clock,
    User,
    Phone,
    MapPin,
    CreditCard,
    GraduationCap,
    Calendar,
    Download,
    Eye
} from 'lucide-react';

const DocumentRequest = ({ token }) => {
    const [activeTab, setActiveTab] = useState('new');
    const [myRequests, setMyRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState('');
    const [selectedRequest, setSelectedRequest] = useState(null);
    
    const [formData, setFormData] = useState({
        requestType: 'degree',
        applicantName: '',
        fatherName: '',
        presentAddress: '',
        permanentAddress: '',
        cnicNumber: '',
        phoneNumber: '',
        cellNumber: '',
        registrationNumber: '',
        natureOfDocument: 'degree',
        bankChallanNo: '',
        bankChallanDate: '',
        bankName: 'National Bank of Pakistan',
        amountPaid: '',
        degree: 'BS',
        faculty: '',
        major: '',
        section: 'A',
        yearOfPassing: '',
        marksObtained: '',
        totalMarks: '',
        cgpa: ''
    });

    const API_URL = 'http://localhost:8000/api/document-requests';

    useEffect(() => {
        fetchMyRequests();
    }, []);

    const fetchMyRequests = async () => {
        try {
            const response = await axios.get(`${API_URL}/my-requests`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMyRequests(response.data.data);
        } catch (error) {
            console.error('Error fetching requests:', error);
        } finally {
            setFetching(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Auto-calculate percentage when marks are entered
        if (name === 'marksObtained' || name === 'totalMarks') {
            const marksObtained = name === 'marksObtained' ? parseFloat(value) : parseFloat(formData.marksObtained);
            const totalMarks = name === 'totalMarks' ? parseFloat(value) : parseFloat(formData.totalMarks);
            if (marksObtained && totalMarks && totalMarks > 0) {
                // No auto-calculation needed, just allow normal input
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            const response = await axios.post(`${API_URL}/submit`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (response.data.success) {
                setSuccessMessage('Document request submitted successfully!');
                setFormData({
                    requestType: 'degree',
                    applicantName: '',
                    fatherName: '',
                    presentAddress: '',
                    permanentAddress: '',
                    cnicNumber: '',
                    phoneNumber: '',
                    cellNumber: '',
                    registrationNumber: '',
                    natureOfDocument: 'degree',
                    bankChallanNo: '',
                    bankChallanDate: '',
                    bankName: 'National Bank of Pakistan',
                    amountPaid: '',
                    degree: 'BS',
                    faculty: '',
                    major: '',
                    section: 'A',
                    yearOfPassing: '',
                    marksObtained: '',
                    totalMarks: '',
                    cgpa: ''
                });
                fetchMyRequests();
                setActiveTab('my-requests');
                setTimeout(() => setSuccessMessage(''), 3000);
            }
        } catch (error) {
            console.error('Error submitting request:', error);
            setError(error.response?.data?.message || 'Error submitting request');
            setTimeout(() => setError(''), 3000);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const config = {
            pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, text: 'Pending' },
            processing: { color: 'bg-blue-100 text-blue-800', icon: Clock, text: 'Processing' },
            approved: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Approved' },
            rejected: { color: 'bg-red-100 text-red-800', icon: AlertCircle, text: 'Rejected' },
            ready_for_pickup: { color: 'bg-purple-100 text-purple-800', icon: CheckCircle, text: 'Ready for Pickup' },
            dispatched: { color: 'bg-indigo-100 text-indigo-800', icon: CheckCircle, text: 'Dispatched' }
        };
        
        const { color, icon: Icon, text } = config[status];
        return (
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${color}`}>
                <Icon className="h-3 w-3" />
                {text}
            </span>
        );
    };

    if (fetching) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Success/Error Messages */}
            {successMessage && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="text-green-700">{successMessage}</span>
                    </div>
                </div>
            )}
            
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                        <span className="text-red-700">{error}</span>
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div className="flex gap-4 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('new')}
                    className={`px-6 py-3 font-medium transition-all duration-200 ${
                        activeTab === 'new'
                            ? 'text-indigo-600 border-b-2 border-indigo-600'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    New Request
                </button>
                <button
                    onClick={() => setActiveTab('my-requests')}
                    className={`px-6 py-3 font-medium transition-all duration-200 ${
                        activeTab === 'my-requests'
                            ? 'text-indigo-600 border-b-2 border-indigo-600'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    My Requests ({myRequests.length})
                </button>
            </div>

            {/* New Request Form */}
            {activeTab === 'new' && (
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-6">
                    <div className="space-y-8">
                        {/* Request Type Selection */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Document Type</h3>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="requestType"
                                        value="degree"
                                        checked={formData.requestType === 'degree'}
                                        onChange={handleInputChange}
                                        className="h-4 w-4 text-indigo-600"
                                    />
                                    <span className="text-gray-700">Degree Certificate</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="requestType"
                                        value="dmc"
                                        checked={formData.requestType === 'dmc'}
                                        onChange={handleInputChange}
                                        className="h-4 w-4 text-indigo-600"
                                    />
                                    <span className="text-gray-700">DMC (Detailed Marks Certificate)</span>
                                </label>
                            </div>
                        </div>

                        {/* Personal Information */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <User className="h-5 w-5 text-indigo-600" />
                                Personal Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Applicant Name (Block Letters) *
                                    </label>
                                    <input
                                        type="text"
                                        name="applicantName"
                                        value={formData.applicantName}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 uppercase"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Father's Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="fatherName"
                                        value={formData.fatherName}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        CNIC Number *
                                    </label>
                                    <input
                                        type="text"
                                        name="cnicNumber"
                                        value={formData.cnicNumber}
                                        onChange={handleInputChange}
                                        placeholder="12345-1234567-1"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Registration Number *
                                    </label>
                                    <input
                                        type="text"
                                        name="registrationNumber"
                                        value={formData.registrationNumber}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Cell Number *
                                    </label>
                                    <input
                                        type="tel"
                                        name="cellNumber"
                                        value={formData.cellNumber}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Present Address *
                                    </label>
                                    <textarea
                                        name="presentAddress"
                                        value={formData.presentAddress}
                                        onChange={handleInputChange}
                                        rows="2"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Permanent Address *
                                    </label>
                                    <textarea
                                        name="permanentAddress"
                                        value={formData.permanentAddress}
                                        onChange={handleInputChange}
                                        rows="2"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Academic Information */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <GraduationCap className="h-5 w-5 text-indigo-600" />
                                Academic Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Degree *
                                    </label>
                                    <select
                                        name="degree"
                                        value={formData.degree}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        required
                                    >
                                        <option value="BS">Bachelor of Science (BS)</option>
                                        <option value="MS">Master of Science (MS)</option>
                                        <option value="PhD">Doctor of Philosophy (PhD)</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Faculty *
                                    </label>
                                    <input
                                        type="text"
                                        name="faculty"
                                        value={formData.faculty}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Major / Program *
                                    </label>
                                    <input
                                        type="text"
                                        name="major"
                                        value={formData.major}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Section *
                                    </label>
                                    <select
                                        name="section"
                                        value={formData.section}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        required
                                    >
                                        <option value="A">Section A</option>
                                        <option value="B">Section B</option>
                                        <option value="C">Section C</option>
                                        <option value="D">Section D</option>
                                        <option value="E">Section E</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Year of Passing *
                                    </label>
                                    <input
                                        type="number"
                                        name="yearOfPassing"
                                        value={formData.yearOfPassing}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        CGPA *
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="cgpa"
                                        value={formData.cgpa}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Marks Obtained *
                                    </label>
                                    <input
                                        type="number"
                                        name="marksObtained"
                                        value={formData.marksObtained}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Total Marks *
                                    </label>
                                    <input
                                        type="number"
                                        name="totalMarks"
                                        value={formData.totalMarks}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Bank Challan Details */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <CreditCard className="h-5 w-5 text-indigo-600" />
                                Bank Challan Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Bank Challan No. *
                                    </label>
                                    <input
                                        type="text"
                                        name="bankChallanNo"
                                        value={formData.bankChallanNo}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Challan Date *
                                    </label>
                                    <input
                                        type="date"
                                        name="bankChallanDate"
                                        value={formData.bankChallanDate}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Bank Name
                                    </label>
                                    <input
                                        type="text"
                                        name="bankName"
                                        value={formData.bankName}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Amount Paid (PKR) *
                                    </label>
                                    <input
                                        type="number"
                                        name="amountPaid"
                                        value={formData.amountPaid}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex gap-4 pt-4 border-t border-gray-200">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                <Send className="h-5 w-5" />
                                {loading ? 'Submitting...' : 'Submit Request'}
                            </button>
                        </div>
                    </div>
                </form>
            )}

            {/* My Requests List */}
            {activeTab === 'my-requests' && (
                <div className="space-y-4">
                    {myRequests.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">No document requests found</p>
                            <button
                                onClick={() => setActiveTab('new')}
                                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                            >
                                Submit New Request
                            </button>
                        </div>
                    ) : (
                        myRequests.map((request) => (
                            <div key={request._id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800">
                                                {request.requestType.toUpperCase()} Request
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                Submitted: {new Date(request.submittedAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        {getStatusBadge(request.status)}
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Registration Number</p>
                                            <p className="font-medium">{request.registrationNumber}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Applicant Name</p>
                                            <p className="font-medium">{request.applicantName}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Degree Program</p>
                                            <p className="font-medium">{request.degree} - {request.major}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Year of Passing</p>
                                            <p className="font-medium">{request.yearOfPassing}</p>
                                        </div>
                                    </div>
                                    
                                    {request.adminComments && (
                                        <div className="bg-gray-50 p-3 rounded-lg mb-4">
                                            <p className="text-sm font-medium text-gray-700">Admin Comments:</p>
                                            <p className="text-sm text-gray-600">{request.adminComments}</p>
                                        </div>
                                    )}
                                    
                                    <button
                                        onClick={() => setSelectedRequest(request)}
                                        className="w-full px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Eye className="h-4 w-4" />
                                        View Full Details
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Request Details Modal */}
            {selectedRequest && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-gray-800">
                                {selectedRequest.requestType.toUpperCase()} Request Details
                            </h2>
                            <button onClick={() => setSelectedRequest(null)} className="text-gray-400 hover:text-gray-600">
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        
                        <div className="p-6 space-y-6">
                            <div className={`p-4 rounded-lg ${
                                selectedRequest.status === 'approved' ? 'bg-green-50' :
                                selectedRequest.status === 'rejected' ? 'bg-red-50' :
                                selectedRequest.status === 'processing' ? 'bg-blue-50' :
                                selectedRequest.status === 'ready_for_pickup' ? 'bg-purple-50' :
                                'bg-yellow-50'
                            }`}>
                                <div className="flex items-center gap-2">
                                    {getStatusBadge(selectedRequest.status)}
                                    <span className="text-sm">
                                        {selectedRequest.status === 'approved' && 'Your request has been approved!'}
                                        {selectedRequest.status === 'rejected' && 'Your request was rejected.'}
                                        {selectedRequest.status === 'processing' && 'Your request is being processed.'}
                                        {selectedRequest.status === 'ready_for_pickup' && 'Your document is ready for pickup!'}
                                        {selectedRequest.status === 'dispatched' && 'Your document has been dispatched.'}
                                        {selectedRequest.status === 'pending' && 'Your request is pending review.'}
                                    </span>
                                </div>
                            </div>
                            
                            {/* Personal Information */}
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-3">Personal Information</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><span className="text-sm text-gray-500">Name:</span> <span className="font-medium">{selectedRequest.applicantName}</span></div>
                                    <div><span className="text-sm text-gray-500">Father's Name:</span> <span className="font-medium">{selectedRequest.fatherName}</span></div>
                                    <div><span className="text-sm text-gray-500">CNIC:</span> <span className="font-medium">{selectedRequest.cnicNumber}</span></div>
                                    <div><span className="text-sm text-gray-500">Registration No:</span> <span className="font-medium">{selectedRequest.registrationNumber}</span></div>
                                    <div><span className="text-sm text-gray-500">Phone:</span> <span className="font-medium">{selectedRequest.phoneNumber}</span></div>
                                    <div><span className="text-sm text-gray-500">Cell:</span> <span className="font-medium">{selectedRequest.cellNumber}</span></div>
                                    <div className="col-span-2"><span className="text-sm text-gray-500">Present Address:</span> <span className="font-medium">{selectedRequest.presentAddress}</span></div>
                                    <div className="col-span-2"><span className="text-sm text-gray-500">Permanent Address:</span> <span className="font-medium">{selectedRequest.permanentAddress}</span></div>
                                </div>
                            </div>
                            
                            {/* Academic Information */}
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-3">Academic Information</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><span className="text-sm text-gray-500">Degree:</span> <span className="font-medium">{selectedRequest.degree}</span></div>
                                    <div><span className="text-sm text-gray-500">Faculty:</span> <span className="font-medium">{selectedRequest.faculty}</span></div>
                                    <div><span className="text-sm text-gray-500">Major:</span> <span className="font-medium">{selectedRequest.major}</span></div>
                                    <div><span className="text-sm text-gray-500">Section:</span> <span className="font-medium">{selectedRequest.section}</span></div>
                                    <div><span className="text-sm text-gray-500">Year of Passing:</span> <span className="font-medium">{selectedRequest.yearOfPassing}</span></div>
                                    <div><span className="text-sm text-gray-500">CGPA:</span> <span className="font-medium">{selectedRequest.cgpa}</span></div>
                                    <div><span className="text-sm text-gray-500">Marks:</span> <span className="font-medium">{selectedRequest.marksObtained}/{selectedRequest.totalMarks}</span></div>
                                    <div><span className="text-sm text-gray-500">Percentage:</span> <span className="font-medium">{selectedRequest.percentage?.toFixed(2)}%</span></div>
                                </div>
                            </div>
                            
                            {/* Bank Challan Details */}
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-3">Bank Challan Details</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><span className="text-sm text-gray-500">Challan No:</span> <span className="font-medium">{selectedRequest.bankChallanNo}</span></div>
                                    <div><span className="text-sm text-gray-500">Date:</span> <span className="font-medium">{new Date(selectedRequest.bankChallanDate).toLocaleDateString()}</span></div>
                                    <div><span className="text-sm text-gray-500">Bank:</span> <span className="font-medium">{selectedRequest.bankName}</span></div>
                                    <div><span className="text-sm text-gray-500">Amount:</span> <span className="font-medium">PKR {selectedRequest.amountPaid?.toLocaleString()}</span></div>
                                </div>
                            </div>
                            
                            {selectedRequest.adminComments && (
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-sm font-medium text-gray-700 mb-1">Admin Comments:</p>
                                    <p className="text-gray-600">{selectedRequest.adminComments}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DocumentRequest;