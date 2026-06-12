// src/components/Teacher/TeacherCourses.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    BookOpen,
    Users,
    Clock,
    GraduationCap,
    Eye,
    User,
    ChevronRight,
    Search,
    X
} from 'lucide-react';

const TeacherCourses = ({ token }) => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedCourseStudents, setSelectedCourseStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showStudentsModal, setShowStudentsModal] = useState(false);
    const [studentsLoading, setStudentsLoading] = useState(false);

    const API_URL = 'http://localhost:8000/api/courses';

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/all`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('Courses response:', response.data);
            setCourses(response.data.courses || []);
        } catch (error) {
            console.error('Error fetching courses:', error);
            alert('Error fetching courses: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const fetchCourseStudents = async (courseId) => {
        try {
            setStudentsLoading(true);
            console.log('Fetching students for course:', courseId);
            const response = await axios.get(`${API_URL}/${courseId}/students`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('Students response:', response.data);
            
            // Handle both response formats
            const students = response.data.students || response.data || [];
            const courseInfo = response.data.course || {};
            
            setSelectedCourseStudents(students);
            setSelectedCourse(courseInfo);
            setShowStudentsModal(true);
        } catch (error) {
            console.error('Error fetching course students:', error);
            console.error('Error details:', error.response?.data);
            alert('Error fetching students: ' + (error.response?.data?.message || error.message));
        } finally {
            setStudentsLoading(false);
        }
    };

    const filteredCourses = courses.filter(course =>
        course.courseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.courseCode?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
            </div>
        );
    }

    if (courses.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600">No Courses Assigned</h3>
                <p className="text-gray-500 mt-2">You haven't been assigned any courses yet.</p>
                <p className="text-gray-500">Contact the admin to assign courses to you.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-gray-800">My Courses</h2>
                <p className="text-gray-600 mt-1">View and manage your assigned courses</p>
            </div>

            {/* Search */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search your courses..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                    <div key={course._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4">
                            <h3 className="text-xl font-bold text-white">{course.courseName}</h3>
                            <p className="text-indigo-100 text-sm">{course.courseCode}</p>
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
                                    <Users className="h-4 w-4 text-indigo-600" />
                                    <span className="text-gray-600">Enrolled: <span className="font-semibold">{course.enrolledStudents?.length || 0}</span> students</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <GraduationCap className="h-4 w-4 text-indigo-600" />
                                    <span className="text-gray-600">Semester: <span className="font-semibold">{course.semester}</span></span>
                                </div>
                            </div>
                            
                            <button
                                onClick={() => fetchCourseStudents(course._id)}
                                className="w-full mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                <Users className="h-4 w-4" />
                                View Enrolled Students ({course.enrolledStudents?.length || 0})
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredCourses.length === 0 && searchTerm && (
                <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                    <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600">No matching courses</h3>
                    <p className="text-gray-500 mt-2">Try a different search term</p>
                </div>
            )}

            {/* Students List Modal */}
            {showStudentsModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800">
                                    {selectedCourse?.name || 'Course'} - Enrolled Students
                                </h2>
                                <p className="text-sm text-gray-500">
                                    Total: {selectedCourseStudents.length} student(s)
                                </p>
                            </div>
                            <button 
                                onClick={() => {
                                    setShowStudentsModal(false);
                                    setSelectedCourse(null);
                                    setSelectedCourseStudents([]);
                                }} 
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        
                        <div className="p-6">
                            {studentsLoading ? (
                                <div className="flex justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent"></div>
                                </div>
                            ) : selectedCourseStudents.length > 0 ? (
                                <div className="space-y-3">
                                    {selectedCourseStudents.map((student, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                                                    {student.name?.charAt(0) || student.username?.charAt(0) || 'S'}
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-800">{student.name || student.username}</h4>
                                                    <p className="text-sm text-gray-500">{student.email}</p>
                                                    <div className="flex gap-3 mt-1">
                                                        {student.program && (
                                                            <p className="text-xs text-gray-400">Program: {student.program}</p>
                                                        )}
                                                        {student.agNumber && (
                                                            <p className="text-xs text-gray-400">AG: {student.agNumber}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {student.enrollmentNumber && (
                                                    <span className="text-xs">Enrollment: {student.enrollmentNumber}</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <Users className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                                    <p>No students enrolled in this course yet</p>
                                    <p className="text-sm mt-1">Use the "Student Management" tab to add students to this course</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeacherCourses;