import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Users,
    User,
    FileText,
    BookOpen,
    MessageSquare,
    CheckCircle,
    Clock,
    XCircle,
    Eye,
    Search,
    ChevronRight,
    AlertCircle,
    UserCheck,
    X,
    Plus,
    Edit,
    Bell,
    Shield,
    UserPlus,
    Award,
    Calendar,
    Mail,
    Phone,
    MapPin,
    GraduationCap,
    IdCard,
    FileCheck,
    FolderGit2,
    FileSpreadsheet
} from 'lucide-react';
import ProjectsManagement from '../components/ProjectsManagment';
import UGFormManagement from '../components/UgForm';
import CoursesManagement from '../components/Admin/CoursesManagement';
import AdminDocumentRequests from '../components/Admin/AdminDocumentRequests';

const Admin_Dashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [students, setStudents] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [showVerificationModal, setShowVerificationModal] = useState(false);
    const [verificationDetails, setVerificationDetails] = useState(null);
    const [documentStats, setDocumentStats] = useState(null);

    const API_URL = 'http://localhost:8000/api/user';
    const DOCUMENT_API_URL = 'http://localhost:8000/api/document-requests';

    useEffect(() => {
        fetchAllData();
        fetchDocumentStats();
    }, []);

    const fetchAllData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');

            const [studentsRes, teachersRes] = await Promise.all([
                axios.get(`${API_URL}/students`, { headers: { Authorization: `Bearer ${token}` } }),
                axios.get(`${API_URL}/teachers`, { headers: { Authorization: `Bearer ${token}` } })
            ]);

            setStudents(studentsRes.data.students || []);
            setTeachers(teachersRes.data.teachers || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchDocumentStats = async () => {
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            const response = await axios.get(`${DOCUMENT_API_URL}/statistics`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDocumentStats(response.data.statistics);
        } catch (error) {
            console.error('Error fetching document stats:', error);
        }
    };

    const stats = {
        totalStudents: students.length,
        totalTeachers: teachers.length,
        pendingVerifications: [...students, ...teachers].filter(u => u.verificationStatus === 'pending').length,
        verifiedStudents: students.filter(s => s.isVerified === true).length,
        unverifiedStudents: students.filter(s => s.isVerified === false && s.verificationStatus !== 'pending').length,
        verifiedTeachers: teachers.filter(t => t.isVerified === true).length,
        unverifiedTeachers: teachers.filter(t => t.isVerified === false && t.verificationStatus !== 'pending').length,
        pendingDocumentRequests: documentStats?.pendingRequests || 0
    };

    const handleVerifyUser = async (userId, status) => {
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            const response = await axios.put(`${API_URL}/verify-user/${userId}`,
                { status },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                alert(response.data.message);
                fetchAllData();
                setShowVerificationModal(false);
                setSelectedUser(null);
            }
        } catch (error) {
            console.error('Error verifying user:', error);
            alert(error.response?.data?.message || 'Error verifying user');
        }
    };

    const handleViewVerificationDetails = async (user) => {
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            const response = await axios.get(`${API_URL}/user-verification/${user._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setVerificationDetails(response.data.verificationData);
                setSelectedUser(user);
                setShowVerificationModal(true);
            }
        } catch (error) {
            console.error('Error fetching verification details:', error);
            alert('Error fetching verification details');
        }
    };

    const StatCard = ({ title, value, icon: Icon, color, onClick, badge }) => (
        <div
            onClick={onClick}
            className="bg-white rounded-xl shadow-lg p-6 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl relative"
        >
            {badge && (
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                    {badge}
                </div>
            )}
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-500 text-sm font-medium">{title}</p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
                </div>
                <div className={`h-12 w-12 rounded-full flex items-center justify-center ${color}`}>
                    <Icon className="h-6 w-6 text-white" />
                </div>
            </div>
        </div>
    );

    const NavigationCard = ({ title, icon: Icon, color, onClick, count, badge }) => (
        <div
            onClick={onClick}
            className="bg-white rounded-xl shadow-lg p-6 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl text-center group relative"
        >
            {badge && (
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                    {badge}
                </div>
            )}
            <div className={`h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4 ${color} group-hover:scale-110 transition-transform`}>
                <Icon className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            {count !== undefined && (
                <p className="text-sm text-gray-500 mt-1">{count} users</p>
            )}
            <ChevronRight className="h-5 w-5 text-gray-400 mx-auto mt-3 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
    );

    const UserTable = ({ users, title, icon: Icon, type }) => (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Icon className="h-7 w-7 text-blue-600" />
                    {title} Management
                </h2>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder={`Search ${title.toLowerCase()}...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 w-64"
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Degree</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verification Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {users
                                .filter(u => u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    u.email?.toLowerCase().includes(searchTerm.toLowerCase()))
                                .map((user) => (
                                    <tr key={user._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                                                    {user.name?.charAt(0) || user.username?.charAt(0)}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{user.name || user.username}</div>
                                                    <div className="text-sm text-gray-500">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-500">{user.phone || 'No phone'}</div>
                                            <div className="text-xs text-gray-400">{user.address?.substring(0, 30) || 'No address'}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">{user.department || 'N/A'}</div>
                                            <div className="text-xs text-gray-500">{user.program || (type === 'teacher' ? 'Faculty' : 'Student')}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.isVerified ? (
                                                <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                                                    <CheckCircle className="h-3 w-3 mr-1" />
                                                    Verified
                                                </span>
                                            ) : user.verificationStatus === 'pending' ? (
                                                <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                                                    <Clock className="h-3 w-3 mr-1" />
                                                    Pending Verification
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                                                    <XCircle className="h-3 w-3 mr-1" />
                                                    Not Verified
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleViewVerificationDetails(user)}
                                                    className="p-1 text-blue-600 hover:text-blue-800"
                                                    title="View Details"
                                                >
                                                    <Eye className="h-5 w-5" />
                                                </button>
                                                {user.verificationStatus === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleVerifyUser(user._id, 'approved')}
                                                            className="p-1 text-green-600 hover:text-green-800"
                                                            title="Approve"
                                                        >
                                                            <UserCheck className="h-5 w-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleVerifyUser(user._id, 'rejected')}
                                                            className="p-1 text-red-600 hover:text-red-800"
                                                            title="Reject"
                                                        >
                                                            <X className="h-5 w-5" />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                        No {title.toLowerCase()} found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const renderOverview = () => (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <StatCard
                    title="Total Students"
                    value={stats.totalStudents}
                    icon={Users}
                    color="bg-blue-500"
                    onClick={() => setActiveTab('students')}
                />
                <StatCard
                    title="Total Teachers"
                    value={stats.totalTeachers}
                    icon={User}
                    color="bg-purple-500"
                    onClick={() => setActiveTab('teachers')}
                />
                <StatCard
                    title="Pending Verifications"
                    value={stats.pendingVerifications}
                    icon={Clock}
                    color="bg-yellow-500"
                    onClick={() => setActiveTab('students')}
                />
                <StatCard
                    title="Verified Students"
                    value={stats.verifiedStudents}
                    icon={CheckCircle}
                    color="bg-green-500"
                    onClick={() => setActiveTab('students')}
                />
                <StatCard
                    title="Verified Teachers"
                    value={stats.verifiedTeachers}
                    icon={Award}
                    color="bg-indigo-500"
                    onClick={() => setActiveTab('teachers')}
                />
                <StatCard
                    title="Pending Doc Requests"
                    value={stats.pendingDocumentRequests}
                    icon={FileText}
                    color="bg-orange-500"
                    badge={stats.pendingDocumentRequests > 0 ? stats.pendingDocumentRequests : null}
                    onClick={() => setActiveTab('document-requests')}
                />
            </div>

            {/* Quick Action Icons */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-6 mb-8">
                <NavigationCard
                    title="Students"
                    icon={Users}
                    color="bg-blue-500"
                    count={stats.totalStudents}
                    badge={stats.pendingVerifications > 0 ? stats.pendingVerifications : null}
                    onClick={() => setActiveTab('students')}
                />
                <NavigationCard
                    title="Teachers"
                    icon={User}
                    color="bg-purple-500"
                    count={stats.totalTeachers}
                    onClick={() => setActiveTab('teachers')}
                />
                <NavigationCard
                    title="Courses"
                    icon={BookOpen}
                    color="bg-green-500"
                    onClick={() => setActiveTab('courses')}
                />
                <NavigationCard
                    title="Projects"
                    icon={FolderGit2}
                    color="bg-red-500"
                    onClick={() => setActiveTab('projects')}
                />
                <NavigationCard
                    title="UG Forms"
                    icon={FileSpreadsheet}
                    color="bg-yellow-500"
                    onClick={() => setActiveTab('ug-forms')}
                />
                <NavigationCard
                    title="Doc Requests"
                    icon={FileText}
                    color="bg-orange-500"
                    badge={stats.pendingDocumentRequests > 0 ? stats.pendingDocumentRequests : null}
                    onClick={() => setActiveTab('document-requests')}
                />
            </div>

            {/* Pending Verifications Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                        <FileCheck className="h-6 w-6 text-yellow-500" />
                        Pending Verifications
                    </h2>
                    <button
                        onClick={() => setActiveTab('students')}
                        className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                    >
                        View All
                    </button>
                </div>
                <div className="space-y-4">
                    {[...students, ...teachers]
                        .filter(u => u.verificationStatus === 'pending')
                        .slice(0, 5)
                        .map((user, index) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center text-white font-bold">
                                        {user.name?.charAt(0) || user.username?.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-800">{user.name || user.username}</h4>
                                        <p className="text-sm text-gray-500">{user.email}</p>
                                        <p className="text-xs text-gray-400">{user.role === 'student' ? 'Student' : 'Teacher'}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleViewVerificationDetails(user)}
                                        className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
                                    >
                                        View Details
                                    </button>
                                    <button
                                        onClick={() => handleVerifyUser(user._id, 'approved')}
                                        className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600"
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleVerifyUser(user._id, 'rejected')}
                                        className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600"
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    {[...students, ...teachers].filter(u => u.verificationStatus === 'pending').length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            No pending verifications
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                            <p className="text-indigo-100 mt-1">Manage students, teachers, courses, projects, UG forms and document requests</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <Bell className="h-6 w-6 cursor-pointer hover:text-indigo-200" />
                            <Shield className="h-6 w-6 cursor-pointer hover:text-indigo-200" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Navigation Tabs */}
                <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200 pb-4">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${activeTab === 'overview'
                            ? 'bg-indigo-600 text-white shadow-lg'
                            : 'bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('students')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${activeTab === 'students'
                            ? 'bg-indigo-600 text-white shadow-lg'
                            : 'bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <Users className="h-4 w-4" />
                        Students ({students.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('teachers')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${activeTab === 'teachers'
                            ? 'bg-indigo-600 text-white shadow-lg'
                            : 'bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <User className="h-4 w-4" />
                        Teachers ({teachers.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('courses')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${activeTab === 'courses'
                            ? 'bg-indigo-600 text-white shadow-lg'
                            : 'bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <BookOpen className="h-4 w-4" />
                        Courses
                    </button>
                    <button
                        onClick={() => setActiveTab('projects')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${activeTab === 'projects'
                            ? 'bg-indigo-600 text-white shadow-lg'
                            : 'bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <FolderGit2 className="h-4 w-4" />
                        Projects
                    </button>
                    <button
                        onClick={() => setActiveTab('ug-forms')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${activeTab === 'ug-forms'
                            ? 'bg-indigo-600 text-white shadow-lg'
                            : 'bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <FileSpreadsheet className="h-4 w-4" />
                        UG Forms
                    </button>
                    <button
                        onClick={() => setActiveTab('document-requests')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${activeTab === 'document-requests'
                            ? 'bg-indigo-600 text-white shadow-lg'
                            : 'bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <FileText className="h-4 w-4" />
                        Document Requests
                        {stats.pendingDocumentRequests > 0 && (
                            <span className="ml-1 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                                {stats.pendingDocumentRequests}
                            </span>
                        )}
                    </button>
                </div>

                {/* Render Active Tab Content */}
                {activeTab === 'overview' && renderOverview()}
                {activeTab === 'students' && (
                    <UserTable users={students} title="Students" icon={Users} type="student" />
                )}
                {activeTab === 'teachers' && (
                    <UserTable users={teachers} title="Teachers" icon={User} type="teacher" />
                )}
                {activeTab === 'courses' && (
                    <CoursesManagement token={localStorage.getItem('token') || sessionStorage.getItem('token')} />
                )}
                {activeTab === 'projects' && (
                    <ProjectsManagement token={localStorage.getItem('token') || sessionStorage.getItem('token')} />
                )}
                {activeTab === 'ug-forms' && (
                    <UGFormManagement token={localStorage.getItem('token') || sessionStorage.getItem('token')} />
                )}
                {activeTab === 'document-requests' && (
                    <AdminDocumentRequests token={localStorage.getItem('token') || sessionStorage.getItem('token')} />
                )}
            </div>

            {/* Verification Details Modal */}
            {showVerificationModal && verificationDetails && selectedUser && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-gray-800">Verification Details</h2>
                            <button onClick={() => setShowVerificationModal(false)} className="text-gray-400 hover:text-gray-600">
                                <XCircle className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="p-6">
                            {/* User Info */}
                            <div className="mb-6 text-center">
                                <div className="h-20 w-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-2xl mx-auto mb-3">
                                    {selectedUser.name?.charAt(0) || selectedUser.username?.charAt(0)}
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">{selectedUser.name || selectedUser.username}</h3>
                                <p className="text-gray-500">{selectedUser.email}</p>
                                <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full mt-2 ${selectedUser.isVerified ? 'bg-green-100 text-green-800' :
                                    selectedUser.verificationStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                    {selectedUser.isVerified ? 'Verified' :
                                        selectedUser.verificationStatus === 'pending' ? 'Pending Verification' : 'Not Verified'}
                                </span>
                            </div>

                            {/* Verification Documents */}
                            <div className="border-t border-gray-200 pt-4">
                                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-indigo-600" />
                                    Verification Documents
                                </h4>

                                {verificationDetails.verificationDocuments && Object.keys(verificationDetails.verificationDocuments).length > 0 ? (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-gray-50 p-3 rounded-lg">
                                                <label className="block text-xs font-medium text-gray-500 mb-1">CNIC Number</label>
                                                <p className="text-gray-900">{verificationDetails.verificationDocuments.cnicNumber || 'N/A'}</p>
                                            </div>
                                            <div className="bg-gray-50 p-3 rounded-lg">
                                                <label className="block text-xs font-medium text-gray-500 mb-1">Father's Name</label>
                                                <p className="text-gray-900">{verificationDetails.verificationDocuments.fatherName || 'N/A'}</p>
                                            </div>
                                            <div className="bg-gray-50 p-3 rounded-lg">
                                                <label className="block text-xs font-medium text-gray-500 mb-1">Date of Birth</label>
                                                <p className="text-gray-900">{verificationDetails.verificationDocuments.dateOfBirth || 'N/A'}</p>
                                            </div>
                                            <div className="bg-gray-50 p-3 rounded-lg col-span-2">
                                                <label className="block text-xs font-medium text-gray-500 mb-1">Permanent Address</label>
                                                <p className="text-gray-900">{verificationDetails.verificationDocuments.permanentAddress || 'N/A'}</p>
                                            </div>
                                        </div>
                                        {verificationDetails.verificationSubmittedAt && (
                                            <div className="text-xs text-gray-500 text-center pt-2">
                                                Submitted on: {new Date(verificationDetails.verificationSubmittedAt).toLocaleString()}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <AlertCircle className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                                        <p>No verification documents submitted yet</p>
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            {selectedUser.verificationStatus === 'pending' && (
                                <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
                                    <button
                                        onClick={() => handleVerifyUser(selectedUser._id, 'approved')}
                                        className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center justify-center gap-2"
                                    >
                                        <UserCheck className="h-4 w-4" />
                                        Approve User
                                    </button>
                                    <button
                                        onClick={() => handleVerifyUser(selectedUser._id, 'rejected')}
                                        className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center justify-center gap-2"
                                    >
                                        <X className="h-4 w-4" />
                                        Reject User
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin_Dashboard;