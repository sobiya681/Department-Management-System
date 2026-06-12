// src/components/Admin/UGFormManagement.jsx - Corrected version

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Eye,
    CheckCircle,
    XCircle,
    Clock,
    FileText,
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    BookOpen,
    Search,
    Filter,
    ChevronDown,
    AlertCircle,
    Download,
    FileSpreadsheet,
    File as FilePdf,
    X
} from 'lucide-react';

const UGFormManagement = ({ token }) => {
    const [forms, setForms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedForm, setSelectedForm] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [adminComment, setAdminComment] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterSection, setFilterSection] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [statistics, setStatistics] = useState(null);
    const [downloading, setDownloading] = useState(false);

    const API_URL = 'http://localhost:8000/api/ugform';

    useEffect(() => {
        fetchForms();
        fetchStatistics();
    }, [filterStatus, filterSection]);

    const fetchForms = async () => {
        try {
            let url = `${API_URL}/all-forms?`;
            if (filterStatus !== 'all') url += `status=${filterStatus}&`;
            if (filterSection !== 'all') url += `section=${filterSection}`;
            
            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setForms(response.data.data);
        } catch (error) {
            console.error('Error fetching forms:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStatistics = async () => {
        try {
            const response = await axios.get(`${API_URL}/statistics`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStatistics(response.data.statistics);
        } catch (error) {
            console.error('Error fetching statistics:', error);
        }
    };

    const handleReview = async (formId, status) => {
        try {
            const response = await axios.put(`${API_URL}/review/${formId}`, {
                status,
                adminComments: adminComment
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (response.data.success) {
                fetchForms();
                fetchStatistics();
                setShowModal(false);
                setSelectedForm(null);
                setAdminComment('');
            }
        } catch (error) {
            console.error('Error reviewing form:', error);
            alert('Error reviewing form');
        }
    };

    const handleDownloadPDF = async (formId, registrationNumber) => {
        setDownloading(true);
        try {
            const response = await axios.get(`${API_URL}/download-pdf/${formId}`, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob'
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `UG_Form_${registrationNumber}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            
        } catch (error) {
            console.error('Error downloading PDF:', error);
            alert('Error downloading PDF');
        } finally {
            setDownloading(false);
        }
    };

    const handleDownloadCSV = async (formId, registrationNumber) => {
        setDownloading(true);
        try {
            const response = await axios.get(`${API_URL}/download-csv/${formId}`, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob'
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `UG_Form_${registrationNumber}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            
        } catch (error) {
            console.error('Error downloading CSV:', error);
            alert('Error downloading CSV');
        } finally {
            setDownloading(false);
        }
    };

    const filteredForms = forms.filter(form => {
        const matchesSearch = form.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             form.registrationNumber?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    const getStatusBadge = (status) => {
        const config = {
            draft: { color: 'bg-gray-100 text-gray-800', icon: FileText, text: 'Draft' },
            submitted: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, text: 'Pending' },
            approved: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Approved' },
            rejected: { color: 'bg-red-100 text-red-800', icon: XCircle, text: 'Rejected' }
        };
        
        const { color, icon: Icon, text } = config[status];
        return (
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${color}`}>
                <Icon className="h-3 w-3" />
                {text}
            </span>
        );
    };

    const StatCard = ({ title, value, icon: Icon, color }) => (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-500 text-sm font-medium">{title}</p>
                    <p className="text-2xl font-bold text-gray-800 mt-2">{value}</p>
                </div>
                <div className={`h-12 w-12 rounded-full flex items-center justify-center ${color}`}>
                    <Icon className="h-6 w-6 text-white" />
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Statistics Section */}
            {statistics && (
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                    <StatCard title="Total Forms" value={statistics.totalForms} icon={FileText} color="bg-blue-500" />
                    <StatCard title="Pending Review" value={statistics.submittedForms} icon={Clock} color="bg-yellow-500" />
                    <StatCard title="Approved" value={statistics.approvedForms} icon={CheckCircle} color="bg-green-500" />
                    <StatCard title="Rejected" value={statistics.rejectedForms} icon={XCircle} color="bg-red-500" />
                    <StatCard title="Drafts" value={statistics.draftForms} icon={FileText} color="bg-gray-500" />
                </div>
            )}

            {/* Filters Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[200px]">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by student name or registration number..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>
                    
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="all">All Status</option>
                        <option value="submitted">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="draft">Draft</option>
                    </select>
                    
                    <select
                        value={filterSection}
                        onChange={(e) => setFilterSection(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="all">All Sections</option>
                        <option value="A">Section A</option>
                        <option value="B">Section B</option>
                        <option value="C">Section C</option>
                        <option value="D">Section D</option>
                    </select>
                </div>
            </div>

            {/* Forms Table */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Student Details
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Registration
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Contact
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Submitted Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredForms.map((form) => (
                                <tr key={form._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div>
                                            <div className="font-medium text-gray-900">{form.studentName}</div>
                                            <div className="text-sm text-gray-500">Father: {form.fatherName}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900">{form.registrationNumber}</div>
                                        <div className="text-xs text-gray-500">Section: {form.section}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900">{form.email}</div>
                                        <div className="text-xs text-gray-500">{form.contactNumber}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {getStatusBadge(form.status)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {form.submittedAt ? new Date(form.submittedAt).toLocaleDateString() : 'Not submitted'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedForm(form);
                                                    setShowModal(true);
                                                }}
                                                className="p-1 text-blue-600 hover:text-blue-800"
                                                title="View Details"
                                            >
                                                <Eye className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDownloadPDF(form._id, form.registrationNumber)}
                                                disabled={downloading}
                                                className="p-1 text-red-600 hover:text-red-800"
                                                title="Download PDF"
                                            >
                                                <FilePdf className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDownloadCSV(form._id, form.registrationNumber)}
                                                disabled={downloading}
                                                className="p-1 text-green-600 hover:text-green-800"
                                                title="Download Excel"
                                            >
                                                <FileSpreadsheet className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredForms.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                        No UG forms found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Form Details Modal */}
            {showModal && selectedForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-gray-800">UG Form Details</h2>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleDownloadPDF(selectedForm._id, selectedForm.registrationNumber)}
                                    disabled={downloading}
                                    className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 text-sm"
                                >
                                    <FilePdf className="h-4 w-4" />
                                    Download PDF
                                </button>
                                <button
                                    onClick={() => handleDownloadCSV(selectedForm._id, selectedForm.registrationNumber)}
                                    disabled={downloading}
                                    className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 text-sm"
                                >
                                    <FileSpreadsheet className="h-4 w-4" />
                                    Download Excel
                                </button>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                        </div>
                        
                        <div className="p-6 space-y-6">
                            {/* Student Information */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                    <User className="h-5 w-5 text-indigo-600" />
                                    Student Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <label className="text-xs font-medium text-gray-500">Full Name</label>
                                        <p className="text-gray-900">{selectedForm.studentName}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <label className="text-xs font-medium text-gray-500">Father's Name</label>
                                        <p className="text-gray-900">{selectedForm.fatherName}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <label className="text-xs font-medium text-gray-500">Registration Number</label>
                                        <p className="text-gray-900">{selectedForm.registrationNumber}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <label className="text-xs font-medium text-gray-500">Section</label>
                                        <p className="text-gray-900">{selectedForm.section}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <label className="text-xs font-medium text-gray-500">Date of First Enrollment</label>
                                        <p className="text-gray-900">{new Date(selectedForm.dateOfFirstEnrollment).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Contact Information */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                    <Mail className="h-5 w-5 text-indigo-600" />
                                    Contact Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <label className="text-xs font-medium text-gray-500">Email</label>
                                        <p className="text-gray-900">{selectedForm.email}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <label className="text-xs font-medium text-gray-500">Contact Number</label>
                                        <p className="text-gray-900">{selectedForm.contactNumber}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg md:col-span-2">
                                        <label className="text-xs font-medium text-gray-500">Permanent Address</label>
                                        <p className="text-gray-900">{selectedForm.permanentAddress}</p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Courses Information */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                    <BookOpen className="h-5 w-5 text-indigo-600" />
                                    Registered Courses
                                </h3>
                                <div className="space-y-3">
                                    {selectedForm.courses?.map((course, idx) => (
                                        <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="font-medium text-gray-900">{course.courseName}</p>
                                                    <p className="text-sm text-gray-600">{course.courseCode}</p>
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {course.creditHours} Credit Hours
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="bg-indigo-50 p-3 rounded-lg">
                                        <div className="flex justify-between items-center">
                                            <span className="font-semibold text-gray-800">Total Credit Hours:</span>
                                            <span className="font-bold text-indigo-600">{selectedForm.totalCreditHours}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Admin Review Section */}
                            {selectedForm.status === 'submitted' && (
                                <div className="border-t border-gray-200 pt-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Admin Review</h3>
                                    <div className="space-y-4">
                                        <textarea
                                            value={adminComment}
                                            onChange={(e) => setAdminComment(e.target.value)}
                                            rows="3"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                            placeholder="Add comments (optional)"
                                        />
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => handleReview(selectedForm._id, 'approved')}
                                                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                                            >
                                                <CheckCircle className="h-4 w-4" />
                                                Approve Application
                                            </button>
                                            <button
                                                onClick={() => handleReview(selectedForm._id, 'rejected')}
                                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
                                            >
                                                <XCircle className="h-4 w-4" />
                                                Reject Application
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            {/* Review Comments */}
                            {selectedForm.adminComments && (
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-sm font-medium text-gray-700 mb-1">Admin Comments:</p>
                                    <p className="text-gray-600">{selectedForm.adminComments}</p>
                                    {selectedForm.reviewedBy && (
                                        <p className="text-xs text-gray-500 mt-2">
                                            Reviewed by: {selectedForm.reviewedBy?.name || selectedForm.reviewedBy?.username}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UGFormManagement;