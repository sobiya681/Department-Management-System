// src/components/StudentUGForm.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Save,
    Send,
    X,
    CheckCircle,
    AlertCircle,
    Clock,
    FileText,
    User,
    Phone,
    Mail,
    MapPin,
    Calendar,
    BookOpen,
    Plus,
    Trash2,
    Edit2
} from 'lucide-react';

const StudentUGForm = () => {
    const [formData, setFormData] = useState({
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
    
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [existingForm, setExistingForm] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const API_URL = 'http://localhost:8000/api/ugform';

    useEffect(() => {
        fetchExistingForm();
    }, []);

    const fetchExistingForm = async () => {
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            const response = await axios.get(`${API_URL}/my-form`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (response.data.success && response.data.data) {
                const form = response.data.data;
                setExistingForm(form);
                setFormData({
                    studentName: form.studentName || '',
                    fatherName: form.fatherName || '',
                    registrationNumber: form.registrationNumber || '',
                    dateOfFirstEnrollment: form.dateOfFirstEnrollment ? form.dateOfFirstEnrollment.split('T')[0] : '',
                    section: form.section || 'A',
                    permanentAddress: form.permanentAddress || '',
                    contactNumber: form.contactNumber || '',
                    email: form.email || '',
                    courses: form.courses && form.courses.length === 6 ? form.courses : formData.courses
                });
            }
        } catch (error) {
            if (error.response?.status !== 404) {
                console.error('Error fetching form:', error);
            }
        } finally {
            setFetching(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCourseChange = (index, field, value) => {
        const updatedCourses = [...formData.courses];
        updatedCourses[index][field] = value;
        setFormData(prev => ({ ...prev, courses: updatedCourses }));
    };

    const validateForm = () => {
        if (!formData.studentName) return 'Student name is required';
        if (!formData.fatherName) return "Father's name is required";
        if (!formData.registrationNumber) return 'Registration number is required';
        if (!formData.dateOfFirstEnrollment) return 'Date of first enrollment is required';
        if (!formData.permanentAddress) return 'Permanent address is required';
        if (!formData.contactNumber) return 'Contact number is required';
        if (!formData.email) return 'Email is required';
        
        for (let i = 0; i < formData.courses.length; i++) {
            const course = formData.courses[i];
            if (!course.courseName) return `Course ${i + 1} name is required`;
            if (!course.courseCode) return `Course ${i + 1} code is required`;
            if (!course.creditHours) return `Credit hours for course ${i + 1} is required`;
        }
        
        return null;
    };

    const handleSaveAsDraft = async () => {
        const validationError = validateForm();
        if (validationError) {
            setMessage({ type: 'error', text: validationError });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
            return;
        }

        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            const response = await axios.post(`${API_URL}/submit`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (response.data.success) {
                setMessage({ type: 'success', text: 'Form saved as draft successfully!' });
                setExistingForm(response.data.data);
                setTimeout(() => setMessage({ type: '', text: '' }), 3000);
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Error saving form' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSubmitForReview = async () => {
        const validationError = validateForm();
        if (validationError) {
            setMessage({ type: 'error', text: validationError });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
            return;
        }

        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            
            // First save/update the form
            const saveResponse = await axios.post(`${API_URL}/submit`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (saveResponse.data.success) {
                // Then submit for review
                const submitResponse = await axios.put(`${API_URL}/submit-for-review`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                if (submitResponse.data.success) {
                    setMessage({ type: 'success', text: 'Form submitted for review successfully!' });
                    fetchExistingForm();
                    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
                }
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Error submitting form' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getStatusBadge = () => {
        if (!existingForm) return null;
        
        const statusConfig = {
            draft: { color: 'bg-gray-100 text-gray-800', icon: Clock, text: 'Draft' },
            submitted: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, text: 'Pending Review' },
            approved: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Approved' },
            rejected: { color: 'bg-red-100 text-red-800', icon: AlertCircle, text: 'Rejected' }
        };
        
        const config = statusConfig[existingForm.status];
        const Icon = config.icon;
        
        return (
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${config.color}`}>
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium">{config.text}</span>
            </div>
        );
    };

    if (fetching) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading form...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-2xl font-bold text-white">UG Program Application Form</h1>
                                <p className="text-indigo-100 mt-1">Please fill in all required information accurately</p>
                            </div>
                            {getStatusBadge()}
                        </div>
                    </div>
                </div>

                {/* Message Display */}
                {message.text && (
                    <div className={`mb-6 rounded-lg p-4 ${
                        message.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                    }`}>
                        <div className="flex items-center">
                            {message.type === 'success' ? (
                                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                            ) : (
                                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                            )}
                            <span className={`text-sm ${message.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>
                                {message.text}
                            </span>
                        </div>
                    </div>
                )}

                {/* Form Content */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <form className="p-8 space-y-8">
                        {/* Personal Information Section */}
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <User className="h-5 w-5 text-indigo-600" />
                                Personal Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Student Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="studentName"
                                        value={formData.studentName}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        placeholder="Enter full name"
                                        disabled={existingForm?.status === 'approved' || existingForm?.status === 'submitted'}
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Father's Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="fatherName"
                                        value={formData.fatherName}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        placeholder="Enter father's name"
                                        disabled={existingForm?.status === 'approved' || existingForm?.status === 'submitted'}
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Registration Number *
                                    </label>
                                    <input
                                        type="text"
                                        name="registrationNumber"
                                        value={formData.registrationNumber}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        placeholder="e.g., 2020-CS-101"
                                        disabled={existingForm?.status === 'approved' || existingForm?.status === 'submitted'}
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Date of First Enrollment *
                                    </label>
                                    <input
                                        type="date"
                                        name="dateOfFirstEnrollment"
                                        value={formData.dateOfFirstEnrollment}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        disabled={existingForm?.status === 'approved' || existingForm?.status === 'submitted'}
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Section *
                                    </label>
                                    <select
                                        name="section"
                                        value={formData.section}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        disabled={existingForm?.status === 'approved' || existingForm?.status === 'submitted'}
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
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Mail className="h-5 w-5 text-indigo-600" />
                                Contact Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        placeholder="student@example.com"
                                        disabled={existingForm?.status === 'approved' || existingForm?.status === 'submitted'}
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Contact Number *
                                    </label>
                                    <input
                                        type="tel"
                                        name="contactNumber"
                                        value={formData.contactNumber}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        placeholder="+92 XXX XXXXXXX"
                                        disabled={existingForm?.status === 'approved' || existingForm?.status === 'submitted'}
                                    />
                                </div>
                                
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Permanent Address *
                                    </label>
                                    <textarea
                                        name="permanentAddress"
                                        value={formData.permanentAddress}
                                        onChange={handleInputChange}
                                        rows="3"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        placeholder="Enter your complete permanent address"
                                        disabled={existingForm?.status === 'approved' || existingForm?.status === 'submitted'}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Courses Section */}
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <BookOpen className="h-5 w-5 text-indigo-600" />
                                Course Registration (6 Courses Required)
                            </h2>
                            <div className="space-y-4">
                                {formData.courses.map((course, index) => (
                                    <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                        <div className="flex justify-between items-center mb-3">
                                            <h3 className="font-semibold text-gray-800">Course {index + 1}</h3>
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
                                                    disabled={existingForm?.status === 'approved' || existingForm?.status === 'submitted'}
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
                                                    disabled={existingForm?.status === 'approved' || existingForm?.status === 'submitted'}
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
                                                    disabled={existingForm?.status === 'approved' || existingForm?.status === 'submitted'}
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
                        <div className="flex gap-4 pt-6 border-t border-gray-200">
                            {(!existingForm || existingForm.status === 'draft') && (
                                <>
                                    <button
                                        type="button"
                                        onClick={handleSaveAsDraft}
                                        disabled={isSubmitting}
                                        className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        <Save className="h-5 w-5" />
                                        {isSubmitting ? 'Saving...' : 'Save as Draft'}
                                    </button>
                                    
                                    <button
                                        type="button"
                                        onClick={handleSubmitForReview}
                                        disabled={isSubmitting}
                                        className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        <Send className="h-5 w-5" />
                                        {isSubmitting ? 'Submitting...' : 'Submit for Review'}
                                    </button>
                                </>
                            )}
                            
                            {existingForm?.status === 'submitted' && (
                                <div className="w-full bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                                    <Clock className="h-5 w-5 text-yellow-600 inline mr-2" />
                                    <span className="text-yellow-800">Your form has been submitted and is pending admin review</span>
                                </div>
                            )}
                            
                            {existingForm?.status === 'approved' && (
                                <div className="w-full bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                                    <CheckCircle className="h-5 w-5 text-green-600 inline mr-2" />
                                    <span className="text-green-800">Your form has been approved! Welcome to the program.</span>
                                </div>
                            )}
                            
                            {existingForm?.status === 'rejected' && (
                                <div className="w-full bg-red-50 border border-red-200 rounded-lg p-4">
                                    <AlertCircle className="h-5 w-5 text-red-600 inline mr-2" />
                                    <span className="text-red-800">Your form was rejected. Please contact admin for more information.</span>
                                    {existingForm.adminComments && (
                                        <p className="mt-2 text-sm text-red-700">Reason: {existingForm.adminComments}</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default StudentUGForm;