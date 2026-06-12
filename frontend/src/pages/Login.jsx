import React, { useState } from 'react';
import axios from 'axios';
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    Building2,
    CheckCircle,
    AlertCircle,
    LogIn,
    ArrowRight,
    Shield,
    Fingerprint
} from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({
        username: '',  // Changed from email to username to match API
        password: '',
        rememberMe: false
    });

    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // API base URL
    const API_URL = 'http://localhost:8000/api/user';

    // Validation functions
    const validateUsername = (username) => {
        if (!username) return 'Username is required';
        if (username.length < 3) return 'Username must be at least 3 characters';
        return '';
    };

    const validatePassword = (password) => {
        if (!password) return 'Password is required';
        if (password.length < 6) return 'Password must be at least 6 characters';
        return '';
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
        // Clear general error message
        if (errorMessage) {
            setErrorMessage('');
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        let error = '';

        switch (name) {
            case 'username':
                error = validateUsername(value);
                break;
            case 'password':
                error = validatePassword(value);
                break;
            default:
                break;
        }

        if (error) {
            setErrors(prev => ({ ...prev, [name]: error }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate all fields
        const usernameError = validateUsername(formData.username);
        const passwordError = validatePassword(formData.password);

        const newErrors = {
            username: usernameError,
            password: passwordError
        };

        setErrors(newErrors);

        // Check if there are any errors
        const hasErrors = Object.values(newErrors).some(error => error !== '');

        if (!hasErrors) {
            setIsSubmitting(true);
            setErrorMessage('');

            try {
                // Prepare login data
                const loginData = {
                    username: formData.username,
                    password: formData.password
                };

                console.log('Sending login request for:', formData.username);

                // Call the sign-in API
                const response = await axios.post(`${API_URL}/sign-in`, loginData);

                if (response.data.success) {
                    setSuccessMessage('Login successful! Redirecting...');
                    
                    // Store auth data based on remember me
                    if (formData.rememberMe) {
                        localStorage.setItem('token', response.data.token);
                        localStorage.setItem('user', JSON.stringify({
                            id: response.data.id,
                            username: response.data.username,
                            role: response.data.role
                        }));
                    } else {
                        sessionStorage.setItem('token', response.data.token);
                        sessionStorage.setItem('user', JSON.stringify({
                            id: response.data.id,
                            username: response.data.username,
                            role: response.data.role
                        }));
                    }
                    
                    // Redirect based on role after 1.5 seconds
                    setTimeout(() => {
                        const userRole = response.data.role;
                        
                        // Role-based redirection
                        switch(userRole) {
                            case 'admin':
                                window.location.href = '/admin/dashboard';
                                break;
                            case 'teacher':
                                window.location.href = '/teacher/dashboard';
                                break;
                            case 'student':
                                window.location.href = '/student/dashboard';
                                break;
                            default:
                                window.location.href = '/dashboard';
                        }
                    }, 1500);
                }
            } catch (error) {
                console.error('Login error:', error);
                if (error.response && error.response.data) {
                    setErrorMessage(error.response.data.message || 'Invalid credentials');
                } else {
                    setErrorMessage('Login failed. Please check your connection.');
                }
                setIsSubmitting(false);
            }
        }
    };

    // Demo credentials helper for testing
    const fillDemoCredentials = (role) => {
        if (role === 'student') {
            setFormData({
                username: 'john_doe',
                password: 'password123',
                rememberMe: false
            });
        } else if (role === 'teacher') {
            setFormData({
                username: 'dr_ahmad',
                password: 'teacher123',
                rememberMe: false
            });
        } else if (role === 'admin') {
            setFormData({
                username: 'admin',
                password: 'admin123',
                rememberMe: false
            });
        }
        setErrors({});
        setErrorMessage('');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">

                {/* Logo and Header */}
                <div className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-3 shadow-lg animate-pulse">
                            <Building2 className="h-10 w-10 text-white" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900">
                        Welcome Back
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Sign in to access the Department Management System
                    </p>
                </div>

                {/* Success Message */}
                {successMessage && (
                    <div className="rounded-lg bg-green-50 border border-green-200 p-4">
                        <div className="flex items-center">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                            <span className="text-sm text-green-700">{successMessage}</span>
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {errorMessage && (
                    <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                        <div className="flex items-center">
                            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                            <span className="text-sm text-red-700">{errorMessage}</span>
                        </div>
                    </div>
                )}

                {/* Login Form */}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {/* Username Field */}
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                            Username
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                autoComplete="username"
                                required
                                value={formData.username}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`appearance-none rounded-lg relative block w-full px-3 py-2 pl-10 border ${
                                    errors.username ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'
                                } focus:outline-none focus:ring-2 focus:border-transparent sm:text-sm`}
                                placeholder="Enter your username"
                            />
                        </div>
                        {errors.username && (
                            <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                {errors.username}
                            </p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="current-password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`appearance-none rounded-lg relative block w-full px-3 py-2 pl-10 pr-10 border ${
                                    errors.password ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'
                                } focus:outline-none focus:ring-2 focus:border-transparent sm:text-sm`}
                                placeholder="Enter your password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                ) : (
                                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                )}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                {errors.password}
                            </p>
                        )}
                    </div>

                    {/* Remember Me */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="rememberMe"
                                name="rememberMe"
                                type="checkbox"
                                checked={formData.rememberMe}
                                onChange={handleChange}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                                Remember me
                            </label>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                        >
                            {isSubmitting ? (
                                <div className="flex items-center gap-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                    Signing in...
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <LogIn className="h-4 w-4" />
                                    Sign In
                                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                            )}
                        </button>
                    </div>

                    {/* Demo Credentials Section */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-gray-50 text-gray-500">Demo Credentials</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                        <button
                            type="button"
                            onClick={() => fillDemoCredentials('student')}
                            className="px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200"
                        >
                            🎓 Student Demo
                        </button>
                        <button
                            type="button"
                            onClick={() => fillDemoCredentials('teacher')}
                            className="px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200"
                        >
                            👨‍🏫 Teacher Demo
                        </button>
                        <button
                            type="button"
                            onClick={() => fillDemoCredentials('admin')}
                            className="px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200"
                        >
                            👑 Admin Demo
                        </button>
                    </div>

                    <div className="text-xs text-center text-gray-400">
                        <p>Demo Student: john_doe / password123</p>
                        <p className="mt-1">Demo Teacher: dr_ahmad / teacher123</p>
                        <p className="mt-1">Demo Admin: admin / admin123</p>
                    </div>

                    {/* Sign Up Link */}
                    <div className="text-center">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{' '}
                            <a href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                                Create an account
                            </a>
                        </p>
                    </div>
                </form>

                {/* Features Section */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <div className="text-indigo-600 text-xs font-semibold">Secure</div>
                            <div className="text-xs text-gray-500 mt-1">SSL Encrypted</div>
                        </div>
                        <div>
                            <div className="text-indigo-600 text-xs font-semibold">24/7</div>
                            <div className="text-xs text-gray-500 mt-1">Support</div>
                        </div>
                        <div>
                            <div className="text-indigo-600 text-xs font-semibold">Fast</div>
                            <div className="text-xs text-gray-500 mt-1">Access</div>
                        </div>
                    </div>
                </div>

                {/* Security Notice */}
                <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                    <Shield className="h-3 w-3" />
                    <span>Your data is protected with industry-standard encryption</span>
                </div>
            </div>
        </div>
    );
};

export default Login;