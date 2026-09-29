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
    Building2,
    UserCircle,
    Smartphone,
    Lock,
    FileText,
    Upload,
    IdCard,
    UserCheck,
    Bell,
    Clock,
    ChevronRight,
    Eye,
    Download,
    FileCheck,
    ClipboardList,
    Send,
    CreditCard,
    Truck,
    Package
} from 'lucide-react';
import DocumentRequest from '../components/Student/DocumentRequest';

const Student_Profile = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [updateLoading, setUpdateLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');

    // Courses state
    const [myCourses, setMyCourses] = useState([]);
    const [coursesLoading, setCoursesLoading] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);

    // UG Form state
    const [ugForm, setUgForm] = useState(null);
    const [ugFormLoading, setUgFormLoading] = useState(false);
    const [showUGFormModal, setShowUGFormModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [ugFormData, setUgFormData] = useState({
        studentName: '',
        fatherName: '',
        registrationNumber: '',
        dateOfFirstEnrollment: '',
        section: 'A',
        permanentAddress: '',
        contactNumber: '',
        email: '',
        courses: [
            { courseName: '', creditHours: 3, courseCode: '', semester: 1 },
            { courseName: '', creditHours: 3, courseCode: '', semester: 1 },
            { courseName: '', creditHours: 3, courseCode: '', semester: 1 },
            { courseName: '', creditHours: 3, courseCode: '', semester: 1 },
            { courseName: '', creditHours: 3, courseCode: '', semester: 1 },
            { courseName: '', creditHours: 3, courseCode: '', semester: 1 }
        ]
    });

    // Degree/DMC state
    const [showDegreeModal, setShowDegreeModal] = useState(false);
    const [degreeData, setDegreeData] = useState({
        degreeType: '',
        specialization: '',
        enrollmentYear: '',
        completionYear: '',
        cgpa: '',
        degreeCertificate: null,
        transcript: null,
        dmc: null
    });
    const [degreeLoading, setDegreeLoading] = useState(false);

    // Notifications state
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showNotifications, setShowNotifications] = useState(false);

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
    const UG_FORM_API_URL = 'http://localhost:8000/api/ugform';

    // Degree program options
    const degreePrograms = [
        'BS Computer Science',
        'BS Information Technology',
        'BS Software Engineering',
        'BS Data Science',
        'BS Artificial Intelligence',
        'BS Bioinformatics',
        'BS Cyber Security',
        'BS Digital Marketing',
        'BS Cloud Computing',
        'BS Internet of Things',
        'BS Game Development',
        'BS Multimedia'
    ];

    useEffect(() => {
        fetchUserInformation();
        fetchMyCourses();
        fetchUGForm();
        fetchNotifications();
        
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

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
                setEditForm(response.data.user);
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

    const fetchMyCourses = async () => {
        try {
            setCoursesLoading(true);
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            const response = await axios.get(`${COURSES_API_URL}/student/my-courses`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMyCourses(response.data.courses);
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            setCoursesLoading(false);
        }
    };

    const fetchUGForm = async () => {
        try {
            setUgFormLoading(true);
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            const response = await axios.get(`${UG_FORM_API_URL}/my-form`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUgForm(response.data.data);
        } catch (error) {
            if (error.response?.status !== 404) {
                console.error('Error fetching UG form:', error);
            }
        } finally {
            setUgFormLoading(false);
        }
    };

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            const response = await axios.get(`${COURSES_API_URL}/notifications`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(response.data.notifications);
            setUnreadCount(response.data.unreadCount);
        } catch (error) {
            console.error('Error fetching notifications:', error);
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
        setEditForm({ ...userData });
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

    const validateAGNumber = (agNumber) => {
        if (!agNumber) return true;
        const pattern = /^\d{4}-ag-\d{4}$/;
        return pattern.test(agNumber);
    };

    const handleSaveProfile = async () => {
        try {
            if (editForm.agNumber && !validateAGNumber(editForm.agNumber)) {
                setError('AG Number must be in format: YYYY-ag-XXXX (e.g., 2020-ag-6543)');
                setTimeout(() => setError(null), 3000);
                return;
            }

            setUpdateLoading(true);
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');

            const updateData = {
                name: editForm.name,
                phone: editForm.phone,
                address: editForm.address,
                program: editForm.program,
                agNumber: editForm.agNumber || null
            };

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
                setTimeout(() => setSuccessMessage(''), 3000);
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

    // UG Form handlers
    const handleUGFormChange = (e) => {
        const { name, value } = e.target;
        setUgFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCourseChange = (index, field, value) => {
        const updatedCourses = [...ugFormData.courses];
        updatedCourses[index][field] = value;
        setUgFormData(prev => ({ ...prev, courses: updatedCourses }));
    };

    const validateUGForm = () => {
        if (!ugFormData.studentName) return 'Student name is required';
        if (!ugFormData.fatherName) return "Father's name is required";
        if (!ugFormData.registrationNumber) return 'Registration number is required';
        if (!ugFormData.dateOfFirstEnrollment) return 'Date of first enrollment is required';
        if (!ugFormData.permanentAddress) return 'Permanent address is required';
        if (!ugFormData.contactNumber) return 'Contact number is required';
        if (!ugFormData.email) return 'Email is required';
        
        for (let i = 0; i < ugFormData.courses.length; i++) {
            const course = ugFormData.courses[i];
            if (!course.courseName) return `Course ${i + 1} name is required`;
            if (!course.courseCode) return `Course ${i + 1} code is required`;
            if (!course.creditHours) return `Credit hours for course ${i + 1} is required`;
        }
        
        return null;
    };

    const handleSaveUGFormDraft = async () => {
        const validationError = validateUGForm();
        if (validationError) {
            setError(validationError);
            setTimeout(() => setError(null), 3000);
            return;
        }

        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            const response = await axios.post(`${UG_FORM_API_URL}/submit`, ugFormData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (response.data.success) {
                setSuccessMessage('Form saved as draft successfully!');
                setShowUGFormModal(false);
                fetchUGForm();
                setTimeout(() => setSuccessMessage(''), 3000);
            }
        } catch (error) {
            console.error('Error saving form:', error);
            if (error.response?.data?.message?.includes('already exists')) {
                setError('This registration number is already in use. Please use a different registration number.');
            } else {
                setError(error.response?.data?.message || 'Error saving form');
            }
            setTimeout(() => setError(null), 5000);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSubmitUGFormForReview = async () => {
        const validationError = validateUGForm();
        if (validationError) {
            setError(validationError);
            setTimeout(() => setError(null), 3000);
            return;
        }

        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            
            const saveResponse = await axios.post(`${UG_FORM_API_URL}/submit`, ugFormData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (saveResponse.data.success) {
                const submitResponse = await axios.put(`${UG_FORM_API_URL}/submit-for-review`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                if (submitResponse.data.success) {
                    setSuccessMessage('Form submitted for review successfully!');
                    setShowUGFormModal(false);
                    fetchUGForm();
                    setTimeout(() => setSuccessMessage(''), 3000);
                }
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            if (error.response?.data?.message?.includes('already exists')) {
                setError('This registration number is already in use. Please use a different registration number.');
            } else {
                setError(error.response?.data?.message || 'Error submitting form');
            }
            setTimeout(() => setError(null), 5000);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Degree/DMC handlers
    const handleDegreeSubmit = async (e) => {
        e.preventDefault();
        setDegreeLoading(true);
        
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            const formData = new FormData();
            formData.append('degreeType', degreeData.degreeType);
            formData.append('specialization', degreeData.specialization);
            formData.append('enrollmentYear', degreeData.enrollmentYear);
            formData.append('completionYear', degreeData.completionYear);
            formData.append('cgpa', degreeData.cgpa);
            if (degreeData.degreeCertificate) formData.append('degreeCertificate', degreeData.degreeCertificate);
            if (degreeData.transcript) formData.append('transcript', degreeData.transcript);
            if (degreeData.dmc) formData.append('dmc', degreeData.dmc);
            
            const response = await axios.post(`${API_URL}/submit-degree`, formData, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            if (response.data.success) {
                setSuccessMessage('Degree/DMC submitted successfully!');
                setShowDegreeModal(false);
                setDegreeData({
                    degreeType: '',
                    specialization: '',
                    enrollmentYear: '',
                    completionYear: '',
                    cgpa: '',
                    degreeCertificate: null,
                    transcript: null,
                    dmc: null
                });
                setTimeout(() => setSuccessMessage(''), 3000);
            }
        } catch (error) {
            console.error('Error submitting degree:', error);
            setError(error.response?.data?.message || 'Error submitting degree');
            setTimeout(() => setError(null), 3000);
        } finally {
            setDegreeLoading(false);
        }
    };

    const getUGFormStatusBadge = () => {
        if (!ugForm) return null;
        
        const statusConfig = {
            draft: { color: 'bg-gray-100 text-gray-800', icon: FileText, text: 'Draft' },
            submitted: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, text: 'Pending Review' },
            approved: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Approved' },
            rejected: { color: 'bg-red-100 text-red-800', icon: X, text: 'Rejected' }
        };
        
        const config = statusConfig[ugForm.status];
        const Icon = config.icon;
        
        return (
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
                <Icon className="h-3 w-3" />
                {config.text}
            </span>
        );
    };

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
                                        {notifications.length > 0 ? (
                                            notifications.map(notification => (
                                                <div
                                                    key={notification._id}
                                                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${!notification.isRead ? 'bg-blue-50' : ''}`}
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
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Student
                                </span>
                                <span className="text-sm text-gray-500">Enrollment: {userData?.enrollmentNumber || 'Pending'}</span>
                                {userData?.agNumber && (
                                    <span className="text-sm text-gray-500">AG No: {userData?.agNumber}</span>
                                )}
                                {getUGFormStatusBadge()}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200 pb-4">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                            activeTab === 'profile'
                                ? 'bg-indigo-600 text-white shadow-lg'
                                : 'bg-white text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        <User className="h-4 w-4" />
                        Profile
                    </button>
                    <button
                        onClick={() => setActiveTab('courses')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                            activeTab === 'courses'
                                ? 'bg-indigo-600 text-white shadow-lg'
                                : 'bg-white text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        <BookOpen className="h-4 w-4" />
                        My Courses ({myCourses.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('ug-form')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                            activeTab === 'ug-form'
                                ? 'bg-indigo-600 text-white shadow-lg'
                                : 'bg-white text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        <FileText className="h-4 w-4" />
                        UG Form
                    </button>
                    <button
                        onClick={() => setActiveTab('documents')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                            activeTab === 'documents'
                                ? 'bg-indigo-600 text-white shadow-lg'
                                : 'bg-white text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        <FileCheck className="h-4 w-4" />
                        Document Requests
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
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">AG Number</label>
                                    {!isEditing ? (
                                        <p className="text-gray-900">{userData?.agNumber || 'Not provided'}</p>
                                    ) : (
                                        <div>
                                            <input
                                                type="text"
                                                name="agNumber"
                                                value={editForm.agNumber || ''}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 font-mono"
                                                placeholder="e.g., 2020-ag-6543"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                Format: YYYY-ag-XXXX (e.g., 2020-ag-6543)
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Academic Information Card */}
                        <div className="bg-white rounded-2xl shadow-xl p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <GraduationCap className="h-5 w-5 text-indigo-600" />
                                Academic Information
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Department</label>
                                    <p>Computer Science</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Degree Program</label>
                                    {!isEditing ? (
                                        <p className="text-gray-900">{userData?.program || 'BS Computer Science'}</p>
                                    ) : (
                                        <select
                                            name="program"
                                            value={editForm.program || 'BS Computer Science'}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        >
                                            {degreePrograms.map(program => (
                                                <option key={program} value={program}>{program}</option>
                                            ))}
                                        </select>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Date of Account Creation</label>
                                    <p className="text-gray-900">{new Date(userData?.createdAt).toLocaleDateString() || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'courses' && (
                    <div className="bg-white rounded-2xl shadow-xl p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-indigo-600" />
                            My Enrolled Courses
                        </h2>
                        
                        {coursesLoading ? (
                            <div className="flex justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent"></div>
                            </div>
                        ) : myCourses.length > 0 ? (
                            <div className="space-y-4">
                                {myCourses.map((course) => (
                                    <div
                                        key={course._id}
                                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
                                        onClick={() => setSelectedCourse(course)}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-800">{course.courseName}</h3>
                                                <p className="text-xs text-gray-500">{course.courseCode}</p>
                                                <p className="text-sm text-gray-600 mt-2">{course.title}</p>
                                                <div className="flex items-center gap-4 mt-3">
                                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                                        <Clock className="h-3 w-3" />
                                                        {course.creditHours} Credit Hours
                                                    </div>
                                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                                        <GraduationCap className="h-3 w-3" />
                                                        Semester {course.semester}
                                                    </div>
                                                </div>
                                                {course.teacher && (
                                                    <p className="text-xs text-gray-500 mt-2">
                                                        Instructor: {course.teacher.name}
                                                    </p>
                                                )}
                                            </div>
                                            <ChevronRight className="h-5 w-5 text-gray-400" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500">No courses enrolled yet</p>
                                <p className="text-xs text-gray-400 mt-1">You'll be notified when added to a course</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'ug-form' && (
                    <div className="bg-white rounded-2xl shadow-xl p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                                <FileText className="h-5 w-5 text-indigo-600" />
                                UG Application Form
                            </h2>
                            {(!ugForm || ugForm.status === 'draft' || ugForm.status === 'rejected') && (
                                <button
                                    onClick={() => {
                                        if (ugForm) {
                                            setUgFormData({
                                                studentName: ugForm.studentName || '',
                                                fatherName: ugForm.fatherName || '',
                                                registrationNumber: ugForm.registrationNumber || '',
                                                dateOfFirstEnrollment: ugForm.dateOfFirstEnrollment ? ugForm.dateOfFirstEnrollment.split('T')[0] : '',
                                                section: ugForm.section || 'A',
                                                permanentAddress: ugForm.permanentAddress || '',
                                                contactNumber: ugForm.contactNumber || '',
                                                email: ugForm.email || '',
                                                courses: ugForm.courses || [
                                                    { courseName: '', creditHours: 3, courseCode: '', semester: 1 },
                                                    { courseName: '', creditHours: 3, courseCode: '', semester: 1 },
                                                    { courseName: '', creditHours: 3, courseCode: '', semester: 1 },
                                                    { courseName: '', creditHours: 3, courseCode: '', semester: 1 },
                                                    { courseName: '', creditHours: 3, courseCode: '', semester: 1 },
                                                    { courseName: '', creditHours: 3, courseCode: '', semester: 1 }
                                                ]
                                            });
                                        }
                                        setShowUGFormModal(true);
                                    }}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                                >
                                    <FileText className="h-4 w-4" />
                                    {ugForm ? 'Edit UG Form' : 'Fill UG Form'}
                                </button>
                            )}
                        </div>

                        {ugFormLoading ? (
                            <div className="flex justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent"></div>
                            </div>
                        ) : ugForm ? (
                            <div className="space-y-6">
                                <div className={`p-4 rounded-lg ${
                                    ugForm.status === 'approved' ? 'bg-green-50 border border-green-200' :
                                    ugForm.status === 'submitted' ? 'bg-yellow-50 border border-yellow-200' :
                                    ugForm.status === 'rejected' ? 'bg-red-50 border border-red-200' :
                                    'bg-gray-50 border border-gray-200'
                                }`}>
                                    <div className="flex items-center gap-2 mb-2">
                                        {getUGFormStatusBadge()}
                                        <span className="text-sm text-gray-600">
                                            {ugForm.status === 'approved' && 'Your UG form has been approved!'}
                                            {ugForm.status === 'submitted' && 'Your form is pending admin review'}
                                            {ugForm.status === 'rejected' && 'Your form was rejected. Please review and resubmit.'}
                                            {ugForm.status === 'draft' && 'Complete and submit your form for review'}
                                        </span>
                                    </div>
                                    {ugForm.adminComments && (
                                        <p className="text-sm text-red-600 mt-2">
                                            <strong>Admin Comments:</strong> {ugForm.adminComments}
                                        </p>
                                    )}
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="font-semibold text-gray-800 mb-3">Personal Information</h3>
                                        <div className="space-y-2">
                                            <p><span className="text-sm text-gray-500">Student Name:</span> <span className="font-medium">{ugForm.studentName}</span></p>
                                            <p><span className="text-sm text-gray-500">Father's Name:</span> <span className="font-medium">{ugForm.fatherName}</span></p>
                                            <p><span className="text-sm text-gray-500">Registration Number:</span> <span className="font-medium">{ugForm.registrationNumber}</span></p>
                                            <p><span className="text-sm text-gray-500">Section:</span> <span className="font-medium">{ugForm.section}</span></p>
                                            <p><span className="text-sm text-gray-500">Enrollment Date:</span> <span className="font-medium">{new Date(ugForm.dateOfFirstEnrollment).toLocaleDateString()}</span></p>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800 mb-3">Contact Information</h3>
                                        <div className="space-y-2">
                                            <p><span className="text-sm text-gray-500">Email:</span> <span className="font-medium">{ugForm.email}</span></p>
                                            <p><span className="text-sm text-gray-500">Contact Number:</span> <span className="font-medium">{ugForm.contactNumber}</span></p>
                                            <p><span className="text-sm text-gray-500">Address:</span> <span className="font-medium">{ugForm.permanentAddress}</span></p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-3">Registered Courses (6 Courses)</h3>
                                    <div className="space-y-2">
                                        {ugForm.courses?.map((course, idx) => (
                                            <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                                                <div className="flex justify-between">
                                                    <div>
                                                        <p className="font-medium">{course.courseName}</p>
                                                        <p className="text-sm text-gray-600">{course.courseCode}</p>
                                                    </div>
                                                    <div className="text-sm text-gray-500">{course.creditHours} Credit Hours</div>
                                                </div>
                                            </div>
                                        ))}
                                        <div className="bg-indigo-50 p-3 rounded-lg mt-2">
                                            <div className="flex justify-between">
                                                <span className="font-semibold">Total Credit Hours:</span>
                                                <span className="font-bold text-indigo-600">{ugForm.totalCreditHours}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {ugForm.status === 'rejected' && (
                                    <button
                                        onClick={() => {
                                            setUgFormData({
                                                studentName: ugForm.studentName || '',
                                                fatherName: ugForm.fatherName || '',
                                                registrationNumber: ugForm.registrationNumber || '',
                                                dateOfFirstEnrollment: ugForm.dateOfFirstEnrollment ? ugForm.dateOfFirstEnrollment.split('T')[0] : '',
                                                section: ugForm.section || 'A',
                                                permanentAddress: ugForm.permanentAddress || '',
                                                contactNumber: ugForm.contactNumber || '',
                                                email: ugForm.email || '',
                                                courses: ugForm.courses || [
                                                    { courseName: '', creditHours: 3, courseCode: '', semester: 1 },
                                                    { courseName: '', creditHours: 3, courseCode: '', semester: 1 },
                                                    { courseName: '', creditHours: 3, courseCode: '', semester: 1 },
                                                    { courseName: '', creditHours: 3, courseCode: '', semester: 1 },
                                                    { courseName: '', creditHours: 3, courseCode: '', semester: 1 },
                                                    { courseName: '', creditHours: 3, courseCode: '', semester: 1 }
                                                ]
                                            });
                                            setShowUGFormModal(true);
                                        }}
                                        className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                                    >
                                        Edit and Resubmit Form
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500">No UG form submitted yet</p>
                                <button
                                    onClick={() => setShowUGFormModal(true)}
                                    className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                                >
                                    Fill UG Form
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'documents' && (
                    <DocumentRequest token={localStorage.getItem('token') || sessionStorage.getItem('token')} />
                )}

                {activeTab === 'degree' && (
                    <div className="bg-white rounded-2xl shadow-xl p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                                <GraduationCap className="h-5 w-5 text-indigo-600" />
                                Degree & DMC Submission
                            </h2>
                            <button
                                onClick={() => setShowDegreeModal(true)}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                            >
                                <Upload className="h-4 w-4" />
                                Submit Degree/DMC
                            </button>
                        </div>

                        <div className="text-center py-12">
                            <GraduationCap className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">Submit your degree certificate, transcript, and DMC</p>
                            <p className="text-sm text-gray-400 mt-2">Required for degree verification</p>
                        </div>
                    </div>
                )}
            </div>

            {/* UG Form Modal */}
            {showUGFormModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-gray-800">
                                UG Program Application Form
                            </h2>
                            <button onClick={() => setShowUGFormModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        
                        <div className="p-6 space-y-8">
                            {/* Personal Information Section */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <User className="h-5 w-5 text-indigo-600" />
                                    Personal Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Student Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="studentName"
                                            value={ugFormData.studentName}
                                            onChange={handleUGFormChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                            placeholder="Enter full name"
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
                                            value={ugFormData.fatherName}
                                            onChange={handleUGFormChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                            placeholder="Enter father's name"
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
                                            value={ugFormData.registrationNumber}
                                            onChange={handleUGFormChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                            placeholder="e.g., 2020-CS-101"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Date of First Enrollment *
                                        </label>
                                        <input
                                            type="date"
                                            name="dateOfFirstEnrollment"
                                            value={ugFormData.dateOfFirstEnrollment}
                                            onChange={handleUGFormChange}
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
                                            value={ugFormData.section}
                                            onChange={handleUGFormChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                            required
                                        >
                                            <option value="A">Section A</option>
                                            <option value="B">Section B</option>
                                            <option value="C">Section C</option>
                                            <option value="D">Section D</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Information Section */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <Mail className="h-5 w-5 text-indigo-600" />
                                    Contact Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={ugFormData.email}
                                            onChange={handleUGFormChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                            placeholder="student@example.com"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Contact Number *
                                        </label>
                                        <input
                                            type="tel"
                                            name="contactNumber"
                                            value={ugFormData.contactNumber}
                                            onChange={handleUGFormChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                            placeholder="+92 XXX XXXXXXX"
                                            required
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Permanent Address *
                                        </label>
                                        <textarea
                                            name="permanentAddress"
                                            value={ugFormData.permanentAddress}
                                            onChange={handleUGFormChange}
                                            rows="3"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                            placeholder="Enter your complete permanent address"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Courses Section */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <BookOpen className="h-5 w-5 text-indigo-600" />
                                    Course Registration (6 Courses Required)
                                </h3>
                                <div className="space-y-4">
                                    {ugFormData.courses.map((course, index) => (
                                        <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                            <div className="flex justify-between items-center mb-3">
                                                <h4 className="font-semibold text-gray-800">Course {index + 1}</h4>
                                                <span className="text-sm text-gray-500">Required</span>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Course Name *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={course.courseName}
                                                        onChange={(e) => handleCourseChange(index, 'courseName', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                                        placeholder="e.g., Programming Fundamentals"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Course Code *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={course.courseCode}
                                                        onChange={(e) => handleCourseChange(index, 'courseCode', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                                        placeholder="e.g., CS-101"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Credit Hours *
                                                    </label>
                                                    <select
                                                        value={course.creditHours}
                                                        onChange={(e) => handleCourseChange(index, 'creditHours', parseInt(e.target.value))}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                                        required
                                                    >
                                                        <option value={1}>1 Credit Hour</option>
                                                        <option value={2}>2 Credit Hours</option>
                                                        <option value={3}>3 Credit Hours</option>
                                                        <option value={4}>4 Credit Hours</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4 pt-4 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => setShowUGFormModal(false)}
                                    className="flex-1 px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSaveUGFormDraft}
                                    disabled={isSubmitting}
                                    className="flex-1 px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    <Save className="h-4 w-4" />
                                    {isSubmitting ? 'Saving...' : 'Save as Draft'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSubmitUGFormForReview}
                                    disabled={isSubmitting}
                                    className="flex-1 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    <Send className="h-4 w-4" />
                                    {isSubmitting ? 'Submitting...' : 'Submit for Review'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Course Details Modal */}
            {selectedCourse && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-gray-800">Course Details</h2>
                            <button onClick={() => setSelectedCourse(null)} className="text-gray-400 hover:text-gray-600">
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 -m-6 mb-6 p-6">
                                <h3 className="text-2xl font-bold text-white">{selectedCourse.courseName}</h3>
                                <p className="text-indigo-100">{selectedCourse.courseCode}</p>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-semibold text-gray-800 mb-2">Title</h4>
                                    <p className="text-gray-700">{selectedCourse.title}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-800 mb-2">Description</h4>
                                    <p className="text-gray-700">{selectedCourse.description}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="font-semibold text-gray-800 mb-2">Credit Hours</h4>
                                        <p className="text-gray-700">{selectedCourse.creditHours}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-800 mb-2">Semester</h4>
                                        <p className="text-gray-700">{selectedCourse.semester}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-800 mb-2">Department</h4>
                                        <p className="text-gray-700">{selectedCourse.department}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-800 mb-2">Instructor</h4>
                                        <p className="text-gray-700">{selectedCourse.teacher?.name || 'Not assigned'}</p>
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

            {/* Degree/DMC Modal */}
            {showDegreeModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-gray-800">Submit Degree & DMC</h2>
                            <button onClick={() => setShowDegreeModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleDegreeSubmit} className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Degree Type</label>
                                    <select
                                        value={degreeData.degreeType}
                                        onChange={(e) => setDegreeData({...degreeData, degreeType: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        required
                                    >
                                        <option value="">Select Degree Type</option>
                                        <option value="BS">Bachelor of Science (BS)</option>
                                        <option value="MS">Master of Science (MS)</option>
                                        <option value="PhD">Doctor of Philosophy (PhD)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                                    <select
                                        value={degreeData.specialization}
                                        onChange={(e) => setDegreeData({...degreeData, specialization: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        required
                                    >
                                        <option value="">Select Specialization</option>
                                        {degreePrograms.map(program => (
                                            <option key={program} value={program}>{program}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Enrollment Year</label>
                                        <input
                                            type="number"
                                            placeholder="2020"
                                            value={degreeData.enrollmentYear}
                                            onChange={(e) => setDegreeData({...degreeData, enrollmentYear: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Completion Year</label>
                                        <input
                                            type="number"
                                            placeholder="2024"
                                            value={degreeData.completionYear}
                                            onChange={(e) => setDegreeData({...degreeData, completionYear: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">CGPA</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        placeholder="3.5"
                                        value={degreeData.cgpa}
                                        onChange={(e) => setDegreeData({...degreeData, cgpa: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Degree Certificate (PDF)</label>
                                    <input
                                        type="file"
                                        accept=".pdf,.jpg,.png"
                                        onChange={(e) => setDegreeData({...degreeData, degreeCertificate: e.target.files[0]})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Transcript (PDF)</label>
                                    <input
                                        type="file"
                                        accept=".pdf,.jpg,.png"
                                        onChange={(e) => setDegreeData({...degreeData, transcript: e.target.files[0]})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">DMC (Detailed Marks Certificate)</label>
                                    <input
                                        type="file"
                                        accept=".pdf,.jpg,.png"
                                        onChange={(e) => setDegreeData({...degreeData, dmc: e.target.files[0]})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowDegreeModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={degreeLoading}
                                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    {degreeLoading ? 'Submitting...' : 'Submit Degree/DMC'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Student_Profile;