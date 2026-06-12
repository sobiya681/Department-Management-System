// src/components/Student/StudentCourses.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    BookOpen,
    Clock,
    GraduationCap,
    User,
    Bell,
    CheckCircle,
    X
} from 'lucide-react';

const StudentCourses = ({ token }) => {
    const [courses, setCourses] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showNotifications, setShowNotifications] = useState(false);

    const API_URL = 'http://localhost:8000/api/courses';

    useEffect(() => {
        fetchData();
        // Poll for new notifications every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchData = async () => {
        try {
            await Promise.all([fetchCourses(), fetchNotifications()]);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCourses = async () => {
        const response = await axios.get(`${API_URL}/student/my-courses`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setCourses(response.data.courses);
    };

    const fetchNotifications = async () => {
        const response = await axios.get(`${API_URL}/notifications`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setNotifications(response.data.notifications);
        setUnreadCount(response.data.unreadCount);
    };

    const markAsRead = async (notificationId) => {
        try {
            await axios.put(`${API_URL}/notifications/${notificationId}/read`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchNotifications();
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header with Notifications */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">My Courses</h2>
                    <p className="text-gray-600 mt-1">View all your enrolled courses</p>
                </div>
                <div className="relative">
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="relative p-2 rounded-lg bg-white shadow-lg hover:shadow-xl transition-all"
                    >
                        <Bell className="h-6 w-6 text-gray-600" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                {unreadCount}
                            </span>
                        )}
                    </button>
                    
                    {/* Notifications Dropdown */}
                    {showNotifications && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)}></div>
                            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50 border border-gray-200">
                                <div className="p-4 border-b border-gray-200">
                                    <h3 className="font-semibold text-gray-800">Notifications</h3>
                                </div>
                                <div className="max-h-96 overflow-y-auto">
                                    {notifications.length > 0 ? (
                                        notifications.map(notification => (
                                            <div
                                                key={notification._id}
                                                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${!notification.isRead ? 'bg-blue-50' : ''}`}
                                                onClick={() => markAsRead(notification._id)}
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

            {/* Courses Grid */}
            {courses.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {courses.map((course) => (
                        <div key={course._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4">
                                <h3 className="text-xl font-bold text-white">{course.courseName}</h3>
                                <p className="text-indigo-100 text-sm">{course.courseCode}</p>
                            </div>
                            
                            <div className="p-6">
                                <h4 className="text-lg font-semibold text-gray-800 mb-2">{course.title}</h4>
                                <p className="text-gray-600 text-sm mb-4">{course.description}</p>
                                
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
                                        <span className="text-gray-600">Instructor: <span className="font-semibold">{course.teacher?.name}</span></span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        <span className="text-gray-600">Status: <span className="font-semibold text-green-600">Enrolled</span></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                    <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600">No Courses Enrolled</h3>
                    <p className="text-gray-500 mt-2">You haven't been enrolled in any courses yet.</p>
                    <p className="text-gray-500">You will receive a notification when a teacher adds you to a course.</p>
                </div>
            )}
        </div>
    );
};

export default StudentCourses;