import React, { useState } from 'react';
import axios from 'axios';
import {
    User,
    Mail,
    Lock,
    Eye,
    EyeOff,
    Building2,
    CheckCircle,
    AlertCircle,
    ArrowRight,
    UserPlus,
    Shield,
    Users,
    GraduationCap
} from 'lucide-react';

const SignUp = () => {
    const [formData, setFormData] = useState({
        username: '',  // Changed from 'name' to 'username' to match API
        email: '',
        password: '',
        confirmPassword: '',
        role: 'student'
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [apiError, setApiError] = useState('');

    // API base URL
    const API_URL = 'http://localhost:8000/api/user';

    // Validation functions
    const validateUsername = (username) => {
        if (!username) return 'Username is required';
        if (username.length < 3) return 'Username must be at least 3 characters';
        if (!/^[a-zA-Z0-9_]+$/.test(username)) return 'Username can only contain letters, numbers, and underscore';
        return '';
    };

    const validateEmail = (email) => {
        if (!email) return 'Email is required';
        const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
        if (!emailRegex.test(email)) return 'Please enter a valid email address';
        return '';
    };

    const validatePassword = (password) => {
        if (!password) return 'Password is required';
        if (password.length < 6) return 'Password must be at least 6 characters';
        return '';
    };

    const validateConfirmPassword = (confirmPassword, password) => {
        if (!confirmPassword) return 'Please confirm your password';
        if (confirmPassword !== password) return 'Passwords do not match';
        return '';
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
        if (apiError) setApiError('');
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        let error = '';

        switch (name) {
            case 'username':
                error = validateUsername(value);
                break;
            case 'email':
                error = validateEmail(value);
                break;
            case 'password':
                error = validatePassword(value);
                break;
            case 'confirmPassword':
                error = validateConfirmPassword(value, formData.password);
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
        const emailError = validateEmail(formData.email);
        const passwordError = validatePassword(formData.password);
        const confirmPasswordError = validateConfirmPassword(formData.confirmPassword, formData.password);

        const newErrors = {
            username: usernameError,
            email: emailError,
            password: passwordError,
            confirmPassword: confirmPasswordError
        };

        setErrors(newErrors);

        // Check if there are any errors
        const hasErrors = Object.values(newErrors).some(error => error !== '');

        if (!hasErrors) {
            setIsSubmitting(true);
            setApiError('');

            try {
                // Prepare data for API
                const signupData = {
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    role: formData.role
                };

                console.log('Sending signup data:', signupData);

                const response = await axios.post(`${API_URL}/sign-up`, signupData);

                if (response.data.success) {
                    setSuccessMessage(response.data.message);

                    // Store token and user data in localStorage
                    localStorage.setItem('token', response.data.token);
                    localStorage.setItem('user', JSON.stringify(response.data.user));

                    // Redirect based on role after 2 seconds
                    setTimeout(() => {
                        const userRole = response.data.user.role;
                        if (userRole === 'teacher') {
                            window.location.href = '/teacher/dashboard';
                        } else if (userRole === 'admin') {
                            window.location.href = '/admin/dashboard';
                        } else {
                            window.location.href = '/student/dashboard';
                        }
                    }, 2000);
                }
            } catch (error) {
                console.error('Signup error:', error);
                if (error.response && error.response.data) {
                    setApiError(error.response.data.message);
                } else {
                    setApiError('Registration failed. Please try again.');
                }
                setIsSubmitting(false);
            }
        }
    };

    // Password strength indicator (simplified for 6 characters)
    const getPasswordStrength = () => {
        const password = formData.password;
        if (!password) return 0;

        let strength = 0;
        if (password.length >= 6) strength++;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;

        return Math.min(strength, 5);
    };

    const passwordStrength = getPasswordStrength();

    const getStrengthText = () => {
        if (passwordStrength === 0) return '';
        if (passwordStrength <= 2) return 'Weak';
        if (passwordStrength <= 3) return 'Fair';
        if (passwordStrength <= 4) return 'Good';
        return 'Strong';
    };

    const getStrengthColor = () => {
        if (passwordStrength === 0) return 'bg-gray-200';
        if (passwordStrength <= 2) return 'bg-red-500';
        if (passwordStrength <= 3) return 'bg-yellow-500';
        if (passwordStrength <= 4) return 'bg-blue-500';
        return 'bg-green-500';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {/* Logo and Header */}
                <div className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-3 shadow-lg">
                            <Building2 className="h-10 w-10 text-white" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900">
                        Create an Account
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Join the Department Management System to get started
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
                {apiError && (
                    <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                        <div className="flex items-center">
                            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                            <span className="text-sm text-red-700">{apiError}</span>
                        </div>
                    </div>
                )}

                {/* Sign Up Form */}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {/* Role Selection Dropdown */}
                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                            I am a
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                {formData.role === 'student' ? (
                                    <Users className="h-5 w-5 text-gray-400" />
                                ) : (
                                    <GraduationCap className="h-5 w-5 text-gray-400" />
                                )}
                            </div>
                            <select
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="appearance-none rounded-lg relative block w-full px-3 py-2 pl-10 pr-10 border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none focus:ring-2 sm:text-sm bg-white cursor-pointer"
                            >
                                <option value="student">📚 Student</option>
                                <option value="teacher">👨‍🏫 Teacher / Faculty Member</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                            Select whether you're a student or teacher/faculty member
                        </p>
                    </div>

                    {/* Username Field */}
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                            Username
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-gray-400" />
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
                                className={`appearance-none rounded-lg relative block w-full px-3 py-2 pl-10 border ${errors.username ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'} focus:outline-none focus:ring-2 focus:border-transparent sm:text-sm`}
                                placeholder="Choose a username"
                            />
                        </div>
                        {errors.username && (
                            <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                {errors.username}
                            </p>
                        )}
                    </div>

                    {/* Email Field */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`appearance-none rounded-lg relative block w-full px-3 py-2 pl-10 border ${errors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'} focus:outline-none focus:ring-2 focus:border-transparent sm:text-sm`}
                                placeholder="you@uaf.edu.pk"
                            />
                        </div>
                        {errors.email && (
                            <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                {errors.email}
                            </p>
                        )}
                        <p className="mt-1 text-xs text-gray-500">
                            Use your university email for verification
                        </p>
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
                                autoComplete="new-password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`appearance-none rounded-lg relative block w-full px-3 py-2 pl-10 pr-10 border ${errors.password ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'} focus:outline-none focus:ring-2 focus:border-transparent sm:text-sm`}
                                placeholder="Create a password (min 6 characters)"
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

                        {/* Password Strength Indicator */}
                        {formData.password && (
                            <div className="mt-2">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs text-gray-500">Password strength:</span>
                                    <span className={`text-xs font-semibold ${passwordStrength <= 2 ? 'text-red-600' :
                                        passwordStrength <= 3 ? 'text-yellow-600' :
                                            passwordStrength <= 4 ? 'text-blue-600' :
                                                'text-green-600'
                                        }`}>
                                        {getStrengthText()}
                                    </span>
                                </div>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((level) => (
                                        <div
                                            key={level}
                                            className={`h-1 flex-1 rounded-full transition-all duration-300 ${level <= passwordStrength ? getStrengthColor() : 'bg-gray-200'
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {errors.password && (
                            <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                {errors.password}
                            </p>
                        )}
                        <p className="mt-1 text-xs text-gray-500">
                            Password must be at least 6 characters
                        </p>
                    </div>

                    {/* Confirm Password Field */}
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Shield className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                autoComplete="new-password"
                                required
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`appearance-none rounded-lg relative block w-full px-3 py-2 pl-10 pr-10 border ${errors.confirmPassword ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'} focus:outline-none focus:ring-2 focus:border-transparent sm:text-sm`}
                                placeholder="Confirm your password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                ) : (
                                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                )}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                {errors.confirmPassword}
                            </p>
                        )}
                    </div>

                    {/* Terms and Conditions */}
                    <div className="flex items-center">
                        <input
                            id="terms"
                            name="terms"
                            type="checkbox"
                            required
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                            I agree to the{' '}
                            <a href="#" className="text-indigo-600 hover:text-indigo-500 font-medium">
                                Terms of Service
                            </a>{' '}
                            and{' '}
                            <a href="#" className="text-indigo-600 hover:text-indigo-500 font-medium">
                                Privacy Policy
                            </a>
                        </label>
                    </div>

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <div className="flex items-center gap-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                    Creating Account...
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <UserPlus className="h-4 w-4" />
                                    Sign Up as {formData.role === 'student' ? 'Student' : 'Teacher'}
                                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                            )}
                        </button>
                    </div>

                    {/* Sign In Link */}
                    <div className="text-center">
                        <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                                Sign in here
                            </a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignUp;