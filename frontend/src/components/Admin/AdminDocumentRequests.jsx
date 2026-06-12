// src/components/Admin/AdminDocumentRequests.jsx
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
    AlertCircle,
    Download,
    FileSpreadsheet,
    File as FilePdf,
    X,
    Truck,
    Package,
    GraduationCap,
    CreditCard,
    Printer,
    RefreshCw,
    Send
} from 'lucide-react';

const AdminDocumentRequests = ({ token }) => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [adminComment, setAdminComment] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterType, setFilterType] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [statistics, setStatistics] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [expectedPickupDate, setExpectedPickupDate] = useState('');
    const [trackingNumber, setTrackingNumber] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });

    const API_URL = 'http://localhost:8000/api/document-requests';

    useEffect(() => {
        fetchRequests();
        fetchStatistics();
    }, [filterStatus, filterType]);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            let url = `${API_URL}/all-requests?`;
            if (filterStatus !== 'all') url += `status=${filterStatus}&`;
            if (filterType !== 'all') url += `requestType=${filterType}`;
            if (dateRange.start) url += `startDate=${dateRange.start}&`;
            if (dateRange.end) url += `endDate=${dateRange.end}`;
            
            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setRequests(response.data.data);
        } catch (error) {
            console.error('Error fetching requests:', error);
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

    const handleReview = async (requestId, status) => {
        setProcessing(true);
        try {
            const response = await axios.put(`${API_URL}/review/${requestId}`, {
                status,
                adminComments: adminComment,
                expectedPickupDate: expectedPickupDate || undefined,
                trackingNumber: trackingNumber || undefined
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (response.data.success) {
                fetchRequests();
                fetchStatistics();
                setShowModal(false);
                setSelectedRequest(null);
                setAdminComment('');
                setExpectedPickupDate('');
                setTrackingNumber('');
                setSelectedStatus('');
            }
        } catch (error) {
            console.error('Error reviewing request:', error);
            alert('Error reviewing request');
        } finally {
            setProcessing(false);
        }
    };

    const handleDownloadPDF = async (requestId, registrationNumber) => {
        try {
            const response = await axios.get(`${API_URL}/download-pdf/${requestId}`, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob'
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Document_Request_${registrationNumber}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            
        } catch (error) {
            console.error('Error downloading PDF:', error);
            alert('Error downloading PDF');
        }
    };

    const handleDownloadAllExcel = async () => {
        try {
            let url = `${API_URL}/download-all-excel?`;
            if (filterStatus !== 'all') url += `status=${filterStatus}&`;
            if (filterType !== 'all') url += `requestType=${filterType}`;
            
            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob'
            });
            
            const url_blob = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url_blob;
            link.setAttribute('download', `Document_Requests_${new Date().toISOString().split('T')[0]}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url_blob);
            
        } catch (error) {
            console.error('Error downloading Excel:', error);
            alert('Error downloading Excel');
        }
    };

    const getStatusBadge = (status) => {
        const config = {
            pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, text: 'Pending' },
            processing: { color: 'bg-blue-100 text-blue-800', icon: Clock, text: 'Processing' },
            approved: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Approved' },
            rejected: { color: 'bg-red-100 text-red-800', icon: XCircle, text: 'Rejected' },
            ready_for_pickup: { color: 'bg-purple-100 text-purple-800', icon: Package, text: 'Ready for Pickup' },
            dispatched: { color: 'bg-indigo-100 text-indigo-800', icon: Truck, text: 'Dispatched' }
        };
        
        const { color, icon: Icon, text } = config[status];
        return (
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${color}`}>
                <Icon className="h-3 w-3" />
                {text}
            </span>
        );
    };

    const filteredRequests = requests.filter(request => {
        const matchesSearch = request.applicantName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             request.registrationNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             request.cnicNumber?.includes(searchTerm) ||
                             request.fatherName?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    const StatCard = ({ title, value, icon: Icon, color, onClick }) => (
        <div 
            onClick={onClick}
            className="bg-white rounded-xl shadow-lg p-6 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
        >
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
                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-4">
                    <StatCard title="Total Requests" value={statistics.totalRequests} icon={FileText} color="bg-blue-500" />
                    <StatCard title="Pending" value={statistics.pendingRequests} icon={Clock} color="bg-yellow-500" />
                    <StatCard title="Processing" value={statistics.processingRequests} icon={Clock} color="bg-blue-500" />
                    <StatCard title="Ready for Pickup" value={statistics.readyRequests} icon={Package} color="bg-purple-500" />
                    <StatCard title="Approved" value={statistics.approvedRequests} icon={CheckCircle} color="bg-green-500" />
                    <StatCard title="Rejected" value={statistics.rejectedRequests} icon={XCircle} color="bg-red-500" />
                    <StatCard title="Dispatched" value={statistics.dispatchedRequests} icon={Truck} color="bg-indigo-500" />
                    <StatCard title="Degree/DMC" value={`${statistics.degreeRequests || 0}/${statistics.dmcRequests || 0}`} icon={GraduationCap} color="bg-orange-500" />
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
                                placeholder="Search by name, registration, father name or CNIC..."
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
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="ready_for_pickup">Ready for Pickup</option>
                        <option value="dispatched">Dispatched</option>
                    </select>
                    
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="all">All Types</option>
                        <option value="degree">Degree Certificates</option>
                        <option value="dmc">DMC Certificates</option>
                    </select>
                    
                    <input
                        type="date"
                        placeholder="From Date"
                        value={dateRange.start}
                        onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                    
                    <input
                        type="date"
                        placeholder="To Date"
                        value={dateRange.end}
                        onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                    
                    <button
                        onClick={fetchRequests}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Apply Filters
                    </button>
                    
                    <button
                        onClick={handleDownloadAllExcel}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                    >
                        <FileSpreadsheet className="h-4 w-4" />
                        Export to Excel
                    </button>
                </div>
            </div>

            {/* Requests Table */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant Details</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Academic Info</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredRequests.map((request) => (
                                <tr key={request._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{request.applicantName}</div>
                                        <div className="text-sm text-gray-500">Father: {request.fatherName}</div>
                                        <div className="text-xs text-gray-400">CNIC: {request.cnicNumber}</div>
                                        <div className="text-xs text-gray-400">Phone: {request.cellNumber}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                            request.requestType === 'degree' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                                        }`}>
                                            {request.requestType.toUpperCase()}
                                        </span>
                                        <div className="text-xs text-gray-500 mt-1">Challan: {request.bankChallanNo}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900">{request.registrationNumber}</div>
                                        <div className="text-xs text-gray-500">{request.degree} - {request.major}</div>
                                        <div className="text-xs text-gray-400">CGPA: {request.cgpa}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {getStatusBadge(request.status)}
                                        {request.expectedPickupDate && (
                                            <div className="text-xs text-gray-500 mt-1">
                                                Pickup: {new Date(request.expectedPickupDate).toLocaleDateString()}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(request.submittedAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedRequest(request);
                                                    setSelectedStatus(request.status);
                                                    setAdminComment(request.adminComments || '');
                                                    setShowModal(true);
                                                }}
                                                className="p-1 text-blue-600 hover:text-blue-800"
                                                title="View Details"
                                            >
                                                <Eye className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDownloadPDF(request._id, request.registrationNumber)}
                                                className="p-1 text-red-600 hover:text-red-800"
                                                title="Download PDF"
                                            >
                                                <FilePdf className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredRequests.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                        No document requests found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Request Details Modal */}
            {showModal && selectedRequest && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-gray-800">Request Details</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        
                        <div className="p-6 space-y-6">
                            <div className={`p-4 rounded-lg ${
                                selectedRequest.status === 'approved' ? 'bg-green-50' :
                                selectedRequest.status === 'rejected' ? 'bg-red-50' :
                                selectedRequest.status === 'processing' ? 'bg-blue-50' :
                                selectedRequest.status === 'ready_for_pickup' ? 'bg-purple-50' : 'bg-yellow-50'
                            }`}>
                                <div className="flex items-center gap-2">
                                    {getStatusBadge(selectedRequest.status)}
                                </div>
                            </div>
                            
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-3">Personal Information</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><span className="text-sm text-gray-500">Name:</span> {selectedRequest.applicantName}</div>
                                    <div><span className="text-sm text-gray-500">Father's Name:</span> {selectedRequest.fatherName}</div>
                                    <div><span className="text-sm text-gray-500">CNIC:</span> {selectedRequest.cnicNumber}</div>
                                    <div><span className="text-sm text-gray-500">Registration:</span> {selectedRequest.registrationNumber}</div>
                                    <div><span className="text-sm text-gray-500">Phone:</span> {selectedRequest.phoneNumber}</div>
                                    <div><span className="text-sm text-gray-500">Cell:</span> {selectedRequest.cellNumber}</div>
                                    <div className="col-span-2"><span className="text-sm text-gray-500">Present Address:</span> {selectedRequest.presentAddress}</div>
                                    <div className="col-span-2"><span className="text-sm text-gray-500">Permanent Address:</span> {selectedRequest.permanentAddress}</div>
                                </div>
                            </div>
                            
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-3">Academic Information</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><span className="text-sm text-gray-500">Degree:</span> {selectedRequest.degree}</div>
                                    <div><span className="text-sm text-gray-500">Faculty:</span> {selectedRequest.faculty}</div>
                                    <div><span className="text-sm text-gray-500">Major:</span> {selectedRequest.major}</div>
                                    <div><span className="text-sm text-gray-500">Section:</span> {selectedRequest.section}</div>
                                    <div><span className="text-sm text-gray-500">Year of Passing:</span> {selectedRequest.yearOfPassing}</div>
                                    <div><span className="text-sm text-gray-500">CGPA:</span> {selectedRequest.cgpa}</div>
                                    <div><span className="text-sm text-gray-500">Marks:</span> {selectedRequest.marksObtained}/{selectedRequest.totalMarks}</div>
                                    <div><span className="text-sm text-gray-500">Percentage:</span> {selectedRequest.percentage?.toFixed(2)}%</div>
                                </div>
                            </div>
                            
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-3">Bank Challan Details</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><span className="text-sm text-gray-500">Challan No:</span> {selectedRequest.bankChallanNo}</div>
                                    <div><span className="text-sm text-gray-500">Date:</span> {new Date(selectedRequest.bankChallanDate).toLocaleDateString()}</div>
                                    <div><span className="text-sm text-gray-500">Bank:</span> {selectedRequest.bankName}</div>
                                    <div><span className="text-sm text-gray-500">Amount:</span> PKR {selectedRequest.amountPaid?.toLocaleString()}</div>
                                </div>
                            </div>
                            
                            {/* Admin Review Section */}
                            <div className="border-t pt-4">
                                <h3 className="font-semibold text-gray-800 mb-3">Admin Review</h3>
                                <textarea
                                    value={adminComment}
                                    onChange={(e) => setAdminComment(e.target.value)}
                                    rows="3"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Add admin comments..."
                                />
                                
                                <div className="flex gap-2 mt-3">
                                    <button
                                        onClick={() => handleReview(selectedRequest._id, 'approved')}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleReview(selectedRequest._id, 'rejected')}
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                    >
                                        Reject
                                    </button>
                                    <button
                                        onClick={() => handleReview(selectedRequest._id, 'processing')}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        Mark as Processing
                                    </button>
                                    <button
                                        onClick={() => handleReview(selectedRequest._id, 'ready_for_pickup')}
                                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                                    >
                                        Ready for Pickup
                                    </button>
                                    <button
                                        onClick={() => handleReview(selectedRequest._id, 'dispatched')}
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                                    >
                                        Mark Dispatched
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDocumentRequests;