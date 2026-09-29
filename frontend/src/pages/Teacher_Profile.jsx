import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    User,
    Mail,
    GraduationCap,
    Calendar,
    MapPin,
    Phone,
    BookOpen,
    Award,
    Edit2,
    Save,
    X,
    AlertCircle,
    CheckCircle,
    UserCircle,
    Lock,
    Bell,
    Users,
    Clock,
    ChevronRight,
    Eye,
    Download,
    UserPlus,
    Search,
    Filter,
    Trash2,
    XCircle
} from 'lucide-react';

// Import the components we created
import TeacherCourses from '../components/Teacher/TeacherCourses';
import TeacherStudentsManagement from '../components/Teacher/TeacherStudentsManagement';

const Teacher_Profile = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [updateLoading, setUpdateLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');

    // Notifications state
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notificationsLoading, setNotificationsLoading] = useState(false);

    // Student Management State
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [studentsLoading, setStudentsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProgram, setSelectedProgram] = useState('all');
    const [selectedSemester, setSelectedSemester] = useState('all');
    const [selectedCourse, setSelectedCourse] = useState('');
    const [courses, setCourses] = useState([]);
    const [showEnrollModal, setShowEnrollModal] = useState(false);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [showStudentDetails, setShowStudentDetails] = useState(null);

    // Password change state
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordErrors, setPasswordErrors] = useState({});
    const [updatingPassword, setUpdatingPassword] = useState(false);

    const API_URL = 'http://localhost:8000/api/user';
    const COURSES_API_URL = 'http://localhost:8000/api/courses';

    useEffect(() => {
        fetchUserInformation();
        fetchNotifications();
        fetchCourses();
        fetchStudents();

        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        filterStudents();
    }, [searchTerm, selectedProgram, selectedSemester, students]);
    const fetchUserInformation = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');

            if (!token) {
                setError('No authentication token found. Please login again.');
                setLoading(false);
                return;
            }

            const response = await axios.get(`${API_URL}/get-user-information`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setUserData(response.data.user);
                setEditForm({
                    ...response.data.user,
                    designation: response.data.user.designation || '',
                    qualification: response.data.user.qualification || ''
                });
                setError(null);
            } else {
                setError(response.data.message || 'Failed to fetch user information');
            }
        } catch (err) {
            console.error('Error fetching user info:', err);
            if (err.response?.status === 401) {
                setError('Session expired. Please login again.');
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
            } else {
                setError(err.response?.data?.message || 'Failed to load profile. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchStudents = async () => {
        try {
            setStudentsLoading(true);
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            const response = await axios.get(`${COURSES_API_URL}/students/all`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStudents(response.data.students);
            setFilteredStudents(response.data.students);
        } catch (error) {
            console.error('Error fetching students:', error);
        } finally {
            setStudentsLoading(false);
        }
    };

    const fetchCourses = async () => {
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            const response = await axios.get(`${COURSES_API_URL}/all`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCourses(response.data.courses);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const filterStudents = () => {
        let filtered = [...students];

        if (searchTerm) {
            filtered = filtered.filter(s =>
                s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.agNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.registrationNumber?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedProgram !== 'all') {
            filtered = filtered.filter(s => s.program === selectedProgram);
        }

        if (selectedSemester !== 'all') {
            filtered = filtered.filter(s => s.semester === parseInt(selectedSemester));
        }

        setFilteredStudents(filtered);
    };

    const fetchNotifications = async () => {
        try {
            setNotificationsLoading(true);
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            const response = await axios.get(`${COURSES_API_URL}/notifications`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(response.data.notifications);
            setUnreadCount(response.data.unreadCount);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setNotificationsLoading(false);
        }
    };

    const markNotificationAsRead = async (notificationId) => {
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            await axios.put(`${COURSES_API_URL}/notifications/${notificationId}/read`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchNotifications();
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const handleEditClick = () => {
        setIsEditing(true);
        setEditForm({
            ...userData,
            designation: userData?.designation || '',
            qualification: userData?.qualification || ''
        });
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditForm({ ...userData });
        setSuccessMessage('');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({ ...prev, [name]: value }));
    };

    // Teacher_Profile.jsx - Update the handleSaveProfile function

    const handleSaveProfile = async () => {
        try {
            setUpdateLoading(true);
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');

            const updateData = {
                name: editForm.name,
                phone: editForm.phone || null,
                address: editForm.address || null,
                department: editForm.department || 'Computer Science',
                designation: editForm.designation || null,
                qualification: editForm.qualification || null
            };

            console.log('Sending update data:', updateData);

            const response = await axios.put(`${API_URL}/update-profile`, updateData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.success) {
                setUserData(response.data.user);
                setSuccessMessage('Profile updated successfully!');
                setIsEditing(false);
                // Refresh the page data
                await fetchUserInformation();
                setTimeout(() => {
                    setSuccessMessage('');
                }, 3000);
            } else {
                setError(response.data.message || 'Failed to update profile');
            }
        } catch (err) {
            console.error('Error updating profile:', err);
            setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
            setTimeout(() => setError(null), 3000);
        } finally {
            setUpdateLoading(false);
        }
    };
    const handleEnrollStudents = async () => {
        if (!selectedCourse || selectedStudents.length === 0) {
            alert('Please select a course and students');
            return;
        }

        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            const response = await axios.post(`${COURSES_API_URL}/${selectedCourse}/add-students`, {
                studentIds: selectedStudents
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert(response.data.message);
            setShowEnrollModal(false);
            setSelectedStudents([]);
            setSelectedCourse('');
            fetchStudents();
        } catch (error) {
            console.error('Error enrolling students:', error);
            alert(error.response?.data?.message || 'Error enrolling students');
        }
    };

    // Password change handlers
    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
        if (passwordErrors[name]) {
            setPasswordErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validatePasswordForm = () => {
        const errors = {};
        if (!passwordData.currentPassword) {
            errors.currentPassword = 'Current password is required';
        }
        if (!passwordData.newPassword) {
            errors.newPassword = 'New password is required';
        } else if (passwordData.newPassword.length < 6) {
            errors.newPassword = 'Password must be at least 6 characters';
        }
        if (!passwordData.confirmPassword) {
            errors.confirmPassword = 'Please confirm your password';
        } else if (passwordData.confirmPassword !== passwordData.newPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }
        return errors;
    };

    const handleUpdatePassword = async () => {
        const errors = validatePasswordForm();
        if (Object.keys(errors).length > 0) {
            setPasswordErrors(errors);
            return;
        }

        try {
            setUpdatingPassword(true);
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');

            const response = await axios.put(`${API_URL}/update-password`, {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.success) {
                setSuccessMessage('Password updated successfully!');
                setShowPasswordModal(false);
                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
                setTimeout(() => setSuccessMessage(''), 3000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update password');
            setTimeout(() => setError(null), 3000);
        } finally {
            setUpdatingPassword(false);
        }
    };

    // Programs list
    const programs = ['all', 'BS Computer Science', 'BS Information Technology', 'BS Software Engineering', 'BS Data Science', 'BS Artificial Intelligence', 'BS Bioinformatics'];
    const semesters = ['all', '1', '2', '3', '4', '5', '6', '7', '8'];

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
                <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
                    <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Profile</h3>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header with Notifications */}
                <div className="flex justify-end mb-4">
                    <div className="relative">
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="relative p-2 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all"
                        >
                            <Bell className="h-6 w-6 text-gray-600" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {unreadCount}
                                </span>
                            )}
                        </button>

                        {showNotifications && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)}></div>
                                <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl z-50 border border-gray-200">
                                    <div className="p-4 border-b border-gray-200">
                                        <h3 className="font-semibold text-gray-800">Notifications</h3>
                                    </div>
                                    <div className="max-h-96 overflow-y-auto">
                                        {notificationsLoading ? (
                                            <div className="p-8 text-center">
                                                <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent mx-auto"></div>
                                            </div>
                                        ) : notifications.length > 0 ? (
                                            notifications.map(notification => (
                                                <div
                                                    key={notification._id}
                                                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${!notification.isRead ? 'bg-blue-50' : ''}`}
                                                    onClick={() => markNotificationAsRead(notification._id)}
                                                >
                                                    <p className="text-sm font-medium text-gray-800">{notification.title}</p>
                                                    <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        {new Date(notification.createdAt).toLocaleString()}
                                                    </p>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-8 text-center text-gray-500">
                                                <Bell className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                                                <p className="text-sm">No notifications</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Success Message */}
                {successMessage && (
                    <div className="mb-6 rounded-lg bg-green-50 border border-green-200 p-4">
                        <div className="flex items-center">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                            <span className="text-sm text-green-700">{successMessage}</span>
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4">
                        <div className="flex items-center">
                            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                            <span className="text-sm text-red-700">{error}</span>
                        </div>
                    </div>
                )}

                {/* Profile Header */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-32"></div>
                    <div className="relative px-6 pb-6">
                        <div className="flex justify-between items-start flex-wrap gap-4">
                            <div className="relative -mt-16">
                                <div className="h-24 w-24 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 border-4 border-white flex items-center justify-center shadow-lg">
                                    {userData?.avatar ? (
                                        <img src={userData.avatar} alt={userData.name} className="h-full w-full rounded-full object-cover" />
                                    ) : (
                                        <UserCircle className="h-14 w-14 text-white" />
                                    )}
                                </div>
                            </div>
                            <div className="mt-4 flex gap-2">
                                <button
                                    onClick={() => setShowPasswordModal(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                                >
                                    <Lock className="h-4 w-4" />
                                    Change Password
                                </button>
                                {!isEditing ? (
                                    <button
                                        onClick={handleEditClick}
                                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                                    >
                                        <Edit2 className="h-4 w-4" />
                                        Edit Profile
                                    </button>
                                ) : (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleSaveProfile}
                                            disabled={updateLoading}
                                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                                        >
                                            {updateLoading ? (
                                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                            ) : (
                                                <Save className="h-4 w-4" />
                                            )}
                                            Save
                                        </button>
                                        <button
                                            onClick={handleCancelEdit}
                                            className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                                        >
                                            <X className="h-4 w-4" />
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="mt-4">
                            {!isEditing ? (
                                <h1 className="text-2xl font-bold text-gray-900">{userData?.name || userData?.username}</h1>
                            ) : (
                                <input
                                    type="text"
                                    name="name"
                                    value={editForm.name || ''}
                                    onChange={handleInputChange}
                                    className="text-2xl font-bold text-gray-900 border-b-2 border-indigo-500 focus:outline-none bg-transparent"
                                    placeholder="Your Full Name"
                                />
                            )}
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                    Teacher
                                </span>
                                <span className="text-sm text-gray-500">Employee ID: {userData?.employeeId || 'Pending'}</span>
                                {userData?.designation && (
                                    <span className="text-sm text-gray-500">{userData.designation}</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200 pb-4">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${activeTab === 'profile'
                                ? 'bg-indigo-600 text-white shadow-lg'
                                : 'bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <User className="h-4 w-4" />
                        Profile
                    </button>
                    <button
                        onClick={() => setActiveTab('courses')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${activeTab === 'courses'
                                ? 'bg-indigo-600 text-white shadow-lg'
                                : 'bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <BookOpen className="h-4 w-4" />
                        My Courses
                    </button>
                    <button
                        onClick={() => setActiveTab('students')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${activeTab === 'students'
                                ? 'bg-indigo-600 text-white shadow-lg'
                                : 'bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <Users className="h-4 w-4" />
                        Student Management
                    </button>
                </div>

                {/* Tab Content */}
                {activeTab === 'profile' && (
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Personal Information Card */}
                        <div className="bg-white rounded-2xl shadow-xl p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <User className="h-5 w-5 text-indigo-600" />
                                Personal Information
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Username</label>
                                    <p className="text-gray-900">{userData?.username}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
                                    <p className="text-gray-900">{userData?.email}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Phone Number</label>
                                    {!isEditing ? (
                                        <p className="text-gray-900">{userData?.phone || 'Not provided'}</p>
                                    ) : (
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={editForm.phone || ''}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                            placeholder="Phone Number"
                                        />
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Address</label>
                                    {!isEditing ? (
                                        <p className="text-gray-900">{userData?.address || 'Not provided'}</p>
                                    ) : (
                                        <textarea
                                            name="address"
                                            value={editForm.address || ''}
                                            onChange={handleInputChange}
                                            rows="2"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                            placeholder="Your Address"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Professional Information Card */}
                        <div className="bg-white rounded-2xl shadow-xl p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <GraduationCap className="h-5 w-5 text-indigo-600" />
                                Professional Information
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Department</label>
                                    {!isEditing ? (
                                        <p className="text-gray-900">{userData?.department || 'Computer Science'}</p>
                                    ) : (
                                        <input
                                            type="text"
                                            name="department"
                                            value={editForm.department || ''}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                            placeholder="Department"
                                        />
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Designation</label>
                                    {!isEditing ? (
                                        <p className="text-gray-900">{userData?.designation || 'Not specified'}</p>
                                    ) : (
                                        <input
                                            type="text"
                                            name="designation"
                                            value={editForm.designation || ''}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                            placeholder="e.g., Assistant Professor"
                                        />
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Qualification</label>
                                    {!isEditing ? (
                                        <p className="text-gray-900">{userData?.qualification || 'Not specified'}</p>
                                    ) : (
                                        <input
                                            type="text"
                                            name="qualification"
                                            value={editForm.qualification || ''}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                            placeholder="e.g., Ph.D. Computer Science"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'courses' && (
                    <TeacherCourses token={localStorage.getItem('token') || sessionStorage.getItem('token')} />
                )}

                {activeTab === 'students' && (
                    <div className="space-y-6">
                        {/* Student Management Header */}
                        <div className="bg-white rounded-2xl shadow-xl p-6">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">Student Management</h2>
                                    <p className="text-gray-600 mt-1">View, filter, and enroll students in courses</p>
                                </div>
                                <button
                                    onClick={() => setShowEnrollModal(true)}
                                    className="px-4 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
                                >
                                    <UserPlus className="h-5 w-5" />
                                    Enroll Students
                                </button>
                            </div>

                            {/* Filters */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search by name, email, AG number..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                <select
                                    value={selectedProgram}
                                    onChange={(e) => setSelectedProgram(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                >
                                    {programs.map(program => (
                                        <option key={program} value={program}>
                                            {program === 'all' ? 'All Programs' : program}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    value={selectedSemester}
                                    onChange={(e) => setSelectedSemester(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                >
                                    {semesters.map(semester => (
                                        <option key={semester} value={semester}>
                                            {semester === 'all' ? 'All Semesters' : `Semester ${semester}`}
                                        </option>
                                    ))}
                                </select>

                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                        setSelectedProgram('all');
                                        setSelectedSemester('all');
                                    }}
                                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center justify-center gap-2"
                                >
                                    <XCircle className="h-4 w-4" />
                                    Clear Filters
                                </button>
                            </div>
                        </div>

                        {/* Students Table */}
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Program</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Semester</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AG Number</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {studentsLoading ? (
                                            <tr>
                                                <td colSpan="6" className="px-6 py-8 text-center">
                                                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent mx-auto"></div>
                                                </td>
                                            </tr>
                                        ) : filteredStudents.length > 0 ? (
                                            filteredStudents.map((student) => (
                                                <tr key={student._id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center">
                                                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                                                                {student.name?.charAt(0) || 'S'}
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                                                <div className="text-sm text-gray-500">{student.email}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">{student.program}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">Semester {student.semester || 'N/A'}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">{student.agNumber || 'N/A'}</td>
                                                    <td className="px-6 py-4">
                                                        {student.isVerified ? (
                                                            <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                                                                <CheckCircle className="h-3 w-3 mr-1" />
                                                                Verified
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                                                                <Clock className="h-3 w-3 mr-1" />
                                                                Pending
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <button
                                                            onClick={() => setShowStudentDetails(student)}
                                                            className="text-indigo-600 hover:text-indigo-900 font-medium flex items-center gap-1"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                            View Details
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                                    No students found matching the filters
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Enroll Students Modal */}
            {showEnrollModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-gray-800">Enroll Students in Course</h2>
                            <button onClick={() => setShowEnrollModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Select Course</label>
                                <select
                                    value={selectedCourse}
                                    onChange={(e) => setSelectedCourse(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="">Choose a course...</option>
                                    {courses.map(course => (
                                        <option key={course._id} value={course._id}>
                                            {course.courseName} ({course.courseCode})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Select Students</label>
                                <div className="border border-gray-300 rounded-lg max-h-60 overflow-y-auto">
                                    {filteredStudents.map(student => (
                                        <label key={student._id} className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100">
                                            <input
                                                type="checkbox"
                                                checked={selectedStudents.includes(student._id)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedStudents([...selectedStudents, student._id]);
                                                    } else {
                                                        setSelectedStudents(selectedStudents.filter(id => id !== student._id));
                                                    }
                                                }}
                                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                            />
                                            <div className="ml-3">
                                                <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                                <div className="text-sm text-gray-500">{student.email} - {student.program} (Semester {student.semester})</div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleEnrollStudents}
                                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                                >
                                    Enroll Selected Students
                                </button>
                                <button
                                    onClick={() => setShowEnrollModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Student Details Modal */}
            {showStudentDetails && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-gray-800">Student Details</h2>
                            <button onClick={() => setShowStudentDetails(null)} className="text-gray-400 hover:text-gray-600">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="h-20 w-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-2xl">
                                    {showStudentDetails.name?.charAt(0) || 'S'}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-800">{showStudentDetails.name}</h3>
                                    <p className="text-gray-500">{showStudentDetails.email}</p>
                                    <p className="text-sm text-gray-500">AG Number: {showStudentDetails.agNumber || 'N/A'}</p>
                                    <p className="text-sm text-gray-500">Semester: {showStudentDetails.semester || 'N/A'}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-gray-800 mb-3">Personal Information</h4>
                                    <div className="space-y-2">
                                        <p><span className="text-sm text-gray-500">Phone:</span> {showStudentDetails.phone || 'N/A'}</p>
                                        <p><span className="text-sm text-gray-500">Address:</span> {showStudentDetails.address || 'N/A'}</p>
                                        <p><span className="text-sm text-gray-500">Program:</span> {showStudentDetails.program}</p>
                                        <p><span className="text-sm text-gray-500">Department:</span> {showStudentDetails.department}</p>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-gray-800 mb-3">Academic Information</h4>
                                    <div className="space-y-2">
                                        <p><span className="text-sm text-gray-500">Registration Number:</span> {showStudentDetails.registrationNumber || 'N/A'}</p>
                                        <p><span className="text-sm text-gray-500">Enrollment Number:</span> {showStudentDetails.enrollmentNumber || 'N/A'}</p>
                                        <p><span className="text-sm text-gray-500">CGPA:</span> {showStudentDetails.cgpa || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Password Change Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-900">Change Password</h2>
                            <button onClick={() => setShowPasswordModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                                <input
                                    type="password"
                                    name="currentPassword"
                                    value={passwordData.currentPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                />
                                {passwordErrors.currentPassword && (
                                    <p className="text-xs text-red-600 mt-1">{passwordErrors.currentPassword}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                />
                                {passwordErrors.newPassword && (
                                    <p className="text-xs text-red-600 mt-1">{passwordErrors.newPassword}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                />
                                {passwordErrors.confirmPassword && (
                                    <p className="text-xs text-red-600 mt-1">{passwordErrors.confirmPassword}</p>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={handleUpdatePassword}
                                disabled={updatingPassword}
                                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                            >
                                {updatingPassword ? 'Updating...' : 'Update Password'}
                            </button>
                            <button
                                onClick={() => setShowPasswordModal(false)}
                                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Teacher_Profile;