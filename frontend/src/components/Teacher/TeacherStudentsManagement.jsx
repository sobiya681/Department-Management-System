// src/components/Teacher/TeacherStudentsManagement.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Users,
    Search,
    Filter,
    Download,
    UserPlus,
    X,
    CheckCircle,
    Clock,
    Mail,
    Phone,
    MapPin,
    GraduationCap,
    FileText,
    BookOpen,
    ChevronRight,
    Eye
} from 'lucide-react';
import * as XLSX from 'xlsx';

const TeacherStudentsManagement = ({ token }) => {
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProgram, setSelectedProgram] = useState('all');
    const [selectedCourse, setSelectedCourse] = useState('');
    const [courses, setCourses] = useState([]);
    const [showEnrollModal, setShowEnrollModal] = useState(false);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [showStudentDetails, setShowStudentDetails] = useState(null);

    const API_URL = 'http://localhost:8000/api/courses';

    useEffect(() => {
        fetchStudents();
        fetchCourses();
    }, []);

    useEffect(() => {
        filterStudents();
    }, [searchTerm, selectedProgram, students]);

    const fetchStudents = async () => {
        try {
            const response = await axios.get(`${API_URL}/students/all`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStudents(response.data.students);
            setFilteredStudents(response.data.students);
        } catch (error) {
            console.error('Error fetching students:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCourses = async () => {
        try {
            const response = await axios.get(`${API_URL}/all`, {
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
                s.agNumber?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        if (selectedProgram !== 'all') {
            filtered = filtered.filter(s => s.program === selectedProgram);
        }
        
        setFilteredStudents(filtered);
    };

    const handleEnrollStudents = async () => {
        if (!selectedCourse || selectedStudents.length === 0) {
            alert('Please select a course and students');
            return;
        }
        
        try {
            const response = await axios.post(`${API_URL}/${selectedCourse}/add-students`, {
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

    const downloadCSV = () => {
        const exportData = filteredStudents.map(student => ({
            'Name': student.name,
            'Email': student.email,
            'Program': student.program,
            'AG Number': student.agNumber || 'N/A',
            'Enrollment Number': student.enrollmentNumber || 'N/A',
            'Phone': student.phone || 'N/A',
            'Address': student.address || 'N/A',
            'Department': student.department,
            'Verification Status': student.isVerified ? 'Verified' : (student.verificationStatus === 'pending' ? 'Pending' : 'Not Verified'),
            'UG Form Status': student.ugForm?.status || 'Not Submitted',
            'Father Name': student.ugForm?.fatherName || 'N/A',
            'Registration Number': student.ugForm?.registrationNumber || 'N/A',
            'Section': student.ugForm?.section || 'N/A',
            'Date of Enrollment': student.ugForm?.dateOfFirstEnrollment ? new Date(student.ugForm.dateOfFirstEnrollment).toLocaleDateString() : 'N/A'
        }));
        
        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Students');
        XLSX.writeFile(wb, `students_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    const programs = ['all', 'BS Computer Science', 'BS Information Technology', 'BS Software Engineering', 'BS Data Science', 'BS Artificial Intelligence'];

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
                    <h2 className="text-2xl font-bold text-gray-800">Student Management</h2>
                    <p className="text-gray-600 mt-1">View and manage all students</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowEnrollModal(true)}
                        className="px-4 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
                    >
                        <UserPlus className="h-5 w-5" />
                        Enroll Students
                    </button>
                    <button
                        onClick={downloadCSV}
                        className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
                    >
                        <Download className="h-5 w-5" />
                        Download CSV
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Total Students</p>
                            <p className="text-2xl font-bold text-gray-800 mt-2">{students.length}</p>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center">
                            <Users className="h-6 w-6 text-white" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Verified Students</p>
                            <p className="text-2xl font-bold text-gray-800 mt-2">{students.filter(s => s.isVerified).length}</p>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-green-500 flex items-center justify-center">
                            <CheckCircle className="h-6 w-6 text-white" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Pending Verification</p>
                            <p className="text-2xl font-bold text-gray-800 mt-2">{students.filter(s => s.verificationStatus === 'pending').length}</p>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-yellow-500 flex items-center justify-center">
                            <Clock className="h-6 w-6 text-white" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">UG Forms Submitted</p>
                            <p className="text-2xl font-bold text-gray-800 mt-2">{students.filter(s => s.ugForm?.status === 'submitted' || s.ugForm?.status === 'approved').length}</p>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-purple-500 flex items-center justify-center">
                            <FileText className="h-6 w-6 text-white" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[200px]">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name, email, or AG number..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
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
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AG Number</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">UG Form</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredStudents.map((student) => (
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
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900">{student.program}</div>
                                        <div className="text-xs text-gray-500">{student.department}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {student.agNumber || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4">
                                        {student.isVerified ? (
                                            <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                                                <CheckCircle className="h-3 w-3 mr-1" />
                                                Verified
                                            </span>
                                        ) : student.verificationStatus === 'pending' ? (
                                            <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                                                <Clock className="h-3 w-3 mr-1" />
                                                Pending
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                                                <X className="h-3 w-3 mr-1" />
                                                Not Verified
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {student.ugForm ? (
                                            <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${
                                                student.ugForm.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                student.ugForm.status === 'submitted' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                                <FileText className="h-3 w-3 mr-1" />
                                                {student.ugForm.status === 'approved' ? 'Approved' :
                                                 student.ugForm.status === 'submitted' ? 'Submitted' : 'Draft'}
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                                                Not Submitted
                                            </span>
                                        )}
                                    </td>
                                    
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
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
                                    {students.map(student => (
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
                                                <div className="text-sm text-gray-500">{student.email} - {student.program}</div>
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
                            {/* Basic Info */}
                            <div className="flex items-center gap-4 mb-6">
                                <div className="h-20 w-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-2xl">
                                    {showStudentDetails.name?.charAt(0) || 'S'}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-800">{showStudentDetails.name}</h3>
                                    <p className="text-gray-500">{showStudentDetails.email}</p>
                                    <p className="text-sm text-gray-500">AG Number: {showStudentDetails.agNumber || 'N/A'}</p>
                                </div>
                            </div>
                            
                            {/* Personal Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                        <User className="h-4 w-4 text-indigo-600" />
                                        Personal Information
                                    </h4>
                                    <div className="space-y-2">
                                        <p className="text-sm"><span className="font-medium">Phone:</span> {showStudentDetails.phone || 'N/A'}</p>
                                        <p className="text-sm"><span className="font-medium">Address:</span> {showStudentDetails.address || 'N/A'}</p>
                                        <p className="text-sm"><span className="font-medium">Program:</span> {showStudentDetails.program}</p>
                                        <p className="text-sm"><span className="font-medium">Department:</span> {showStudentDetails.department}</p>
                                    </div>
                                </div>
                                
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-indigo-600" />
                                        UG Form Details
                                    </h4>
                                    {showStudentDetails.ugForm ? (
                                        <div className="space-y-2">
                                            <p className="text-sm"><span className="font-medium">Father Name:</span> {showStudentDetails.ugForm.fatherName}</p>
                                            <p className="text-sm"><span className="font-medium">Registration Number:</span> {showStudentDetails.ugForm.registrationNumber}</p>
                                            <p className="text-sm"><span className="font-medium">Section:</span> {showStudentDetails.ugForm.section}</p>
                                            <p className="text-sm"><span className="font-medium">Enrollment Date:</span> {new Date(showStudentDetails.ugForm.dateOfFirstEnrollment).toLocaleDateString()}</p>
                                            <p className="text-sm"><span className="font-medium">Status:</span> {showStudentDetails.ugForm.status}</p>
                                        </div>
                                    ) : (
                                        <p className="text-gray-500">No UG form submitted</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeacherStudentsManagement;