// src/components/Admin/CoursesManagement.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Plus,
    Edit,
    Trash2,
    Eye,
    X,
    BookOpen,
    Code,
    Clock,
    Users,
    User,
    Search,
    Filter,
    Download,
    CheckCircle,
    XCircle,
    ChevronRight,
    GraduationCap
} from 'lucide-react';

const CoursesManagement = ({ token }) => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [formData, setFormData] = useState({
        courseCode: '',
        courseName: '',
        title: '',
        description: '',
        creditHours: 3,
        department: 'Computer Science',
        semester: 1,
        teacherId: ''
    });
    const [teachers, setTeachers] = useState([]);

    const API_URL = 'http://localhost:8000/api/courses';

    useEffect(() => {
        fetchCourses();
        fetchTeachers();
    }, []);

    const fetchCourses = async () => {
        try {
            const response = await axios.get(`${API_URL}/all`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCourses(response.data.courses);
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTeachers = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/user/teachers', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTeachers(response.data.teachers);
        } catch (error) {
            console.error('Error fetching teachers:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            if (editingCourse) {
                await axios.put(`${API_URL}/update/${editingCourse._id}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post(`${API_URL}/create`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            
            fetchCourses();
            resetForm();
            setShowModal(false);
        } catch (error) {
            console.error('Error saving course:', error);
            alert(error.response?.data?.message || 'Error saving course');
        }
    };

    const handleDelete = async (courseId) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            try {
                await axios.delete(`${API_URL}/delete/${courseId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchCourses();
            } catch (error) {
                console.error('Error deleting course:', error);
                alert('Error deleting course');
            }
        }
    };

    const handleEdit = (course) => {
        setEditingCourse(course);
        setFormData({
            courseCode: course.courseCode,
            courseName: course.courseName,
            title: course.title,
            description: course.description,
            creditHours: course.creditHours,
            department: course.department,
            semester: course.semester,
            teacherId: course.teacher?._id || ''
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setEditingCourse(null);
        setFormData({
            courseCode: '',
            courseName: '',
            title: '',
            description: '',
            creditHours: 3,
            department: 'Computer Science',
            semester: 1,
            teacherId: ''
        });
    };

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              course.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              course.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDepartment = !selectedDepartment || course.department === selectedDepartment;
        return matchesSearch && matchesDepartment;
    });

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
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Course Management</h2>
                    <p className="text-gray-600 mt-1">Create and manage academic courses</p>
                </div>
                <button
                    onClick={() => {
                        resetForm();
                        setShowModal(true);
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
                >
                    <Plus className="h-5 w-5" />
                    Add New Course
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard title="Total Courses" value={courses.length} icon={BookOpen} color="bg-blue-500" />
                <StatCard title="Active Courses" value={courses.filter(c => c.isActive).length} icon={CheckCircle} color="bg-green-500" />
                <StatCard title="Total Students Enrolled" value={courses.reduce((sum, c) => sum + c.enrolledStudents?.length, 0)} icon={Users} color="bg-purple-500" />
                <StatCard title="Departments" value={new Set(courses.map(c => c.department)).size} icon={GraduationCap} color="bg-orange-500" />
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[200px]">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search courses..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>
                    
                    <select
                        value={selectedDepartment}
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="">All Departments</option>
                        <option value="Computer Science">Computer Science</option>
                        <option value="Software Engineering">Software Engineering</option>
                        <option value="Information Technology">Information Technology</option>
                        <option value="Data Science">Data Science</option>
                        <option value="Artificial Intelligence">Artificial Intelligence</option>
                    </select>
                </div>
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                    <div key={course._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-bold text-white">{course.courseName}</h3>
                                    <p className="text-indigo-100 text-sm">{course.courseCode}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(course)}
                                        className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-100"
                                    >
                                        <Edit className="h-4 w-4 text-blue-600" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(course._id)}
                                        className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-100"
                                    >
                                        <Trash2 className="h-4 w-4 text-red-600" />
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-6">
                            <h4 className="text-lg font-semibold text-gray-800 mb-2">{course.title}</h4>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
                            
                            <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-sm">
                                    <Clock className="h-4 w-4 text-indigo-600" />
                                    <span className="text-gray-600">Credit Hours: <span className="font-semibold">{course.creditHours}</span></span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <GraduationCap className="h-4 w-4 text-indigo-600" />
                                    <span className="text-gray-600">Department: <span className="font-semibold">{course.department}</span></span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <User className="h-4 w-4 text-indigo-600" />
                                    <span className="text-gray-600">Teacher: <span className="font-semibold">{course.teacher?.name || 'Not assigned'}</span></span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Users className="h-4 w-4 text-indigo-600" />
                                    <span className="text-gray-600">Enrolled Students: <span className="font-semibold">{course.enrolledStudents?.length || 0}</span></span>
                                </div>
                            </div>
                            
                            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${course.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {course.isActive ? 'Active' : 'Inactive'}
                                </span>
                                <span className="text-sm text-gray-500">Semester: {course.semester}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredCourses.length === 0 && (
                <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                    <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600">No courses found</h3>
                    <p className="text-gray-500 mt-2">Click "Add New Course" to get started</p>
                </div>
            )}

            {/* Add/Edit Course Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-gray-800">
                                {editingCourse ? 'Edit Course' : 'Add New Course'}
                            </h2>
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    resetForm();
                                }}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Course Code *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.courseCode}
                                            onChange={(e) => setFormData({ ...formData, courseCode: e.target.value.toUpperCase() })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                            placeholder="e.g., CS101"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Course Name *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.courseName}
                                            onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                            placeholder="e.g., Programming Fundamentals"
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Title *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        placeholder="e.g., Introduction to Programming"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description *
                                    </label>
                                    <textarea
                                        required
                                        rows="3"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Course description..."
                                    />
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Credit Hours *
                                        </label>
                                        <select
                                            required
                                            value={formData.creditHours}
                                            onChange={(e) => setFormData({ ...formData, creditHours: parseInt(e.target.value) })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        >
                                            <option value={1}>1 Credit Hour</option>
                                            <option value={2}>2 Credit Hours</option>
                                            <option value={3}>3 Credit Hours</option>
                                            <option value={4}>4 Credit Hours</option>
                                        </select>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Semester *
                                        </label>
                                        <select
                                            required
                                            value={formData.semester}
                                            onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value) })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        >
                                            {[1,2,3,4,5,6,7,8].map(sem => (
                                                <option key={sem} value={sem}>Semester {sem}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Department *
                                        </label>
                                        <select
                                            required
                                            value={formData.department}
                                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        >
                                            <option value="Computer Science">Computer Science</option>
                                            <option value="Software Engineering">Software Engineering</option>
                                            <option value="Information Technology">Information Technology</option>
                                            <option value="Data Science">Data Science</option>
                                            <option value="Artificial Intelligence">Artificial Intelligence</option>
                                        </select>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Assigned Teacher *
                                        </label>
                                        <select
                                            required
                                            value={formData.teacherId}
                                            onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        >
                                            <option value="">Select Teacher</option>
                                            {teachers.map(teacher => (
                                                <option key={teacher._id} value={teacher._id}>
                                                    {teacher.name} ({teacher.email})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        resetForm();
                                    }}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg"
                                >
                                    {editingCourse ? 'Update Course' : 'Create Course'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CoursesManagement;