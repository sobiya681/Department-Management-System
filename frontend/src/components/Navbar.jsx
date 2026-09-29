import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  LayoutDashboard,
  Users,
  Briefcase,
  LogIn,
  UserPlus,
  Building2,
  UserCircle,
  LogOut,
  Settings,
  ChevronDown,
  GraduationCap,
  BookOpen
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Navigation items
  const navItems = [
    { name: 'About Us', href: '/about-us', icon: LayoutDashboard },
    { name: 'Teachers', href: '/teachers', icon: Users },
    { name: 'Projects', href: '/projects', icon: Briefcase },
  ];

  // Check if user is logged in on component mount
  useEffect(() => {
    checkAuthStatus();
    
    // Listen for storage changes (in case user logs in/out in another tab)
    window.addEventListener('storage', checkAuthStatus);
    
    return () => {
      window.removeEventListener('storage', checkAuthStatus);
    };
  }, []);

  const checkAuthStatus = () => {
    // Check localStorage and sessionStorage for token
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
        setIsLoggedIn(false);
        setUser(null);
      }
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  };

  const handleLogout = () => {
    // Clear all auth data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    
    // Close dropdown
    setIsProfileDropdownOpen(false);
    
    // Redirect to home page
    window.location.href = '/';
  };

  const getProfileUrl = () => {
    if (!user) return '/login';
    
    switch(user.role) {
      case 'admin':
        return '/admin/profile';
      case 'teacher':
        return '/teacher/profile';
      case 'student':
        return '/student/profile';
      default:
        return '/profile';
    }
  };

  const getDashboardUrl = () => {
    if (!user) return '/login';
    
    switch(user.role) {
      case 'admin':
        return '/admin/dashboard';
      case 'teacher':
        return '/teacher/dashboard';
      case 'student':
        return '/student/dashboard';
      default:
        return '/dashboard';
    }
  };

  const getRoleIcon = () => {
    if (!user) return <UserCircle className="h-5 w-5" />;
    
    switch(user.role) {
      case 'admin':
        return <Settings className="h-5 w-5" />;
      case 'teacher':
        return <GraduationCap className="h-5 w-5" />;
      case 'student':
        return <BookOpen className="h-5 w-5" />;
      default:
        return <UserCircle className="h-5 w-5" />;
    }
  };

  const getRoleBadgeColor = () => {
    if (!user) return 'bg-gray-500';
    
    switch(user.role) {
      case 'admin':
        return 'bg-red-500';
      case 'teacher':
        return 'bg-purple-500';
      case 'student':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <>
      <nav className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Logo and Brand */}
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="bg-indigo-600 rounded-lg p-1.5">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="hidden md:block">
                <Link to='/' className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  DeptFlow
                </Link>
                <p className="text-xs text-slate-400">Department Management System</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all duration-200 group"
                >
                  <item.icon className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                  {item.name}
                </a>
              ))}
            </div>

            {/* Right side buttons - Conditional rendering based on login status */}
            <div className="flex items-center space-x-3">
              {isLoggedIn && user ? (
                /* Profile Dropdown for Logged In Users */
                <div className="relative">
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center space-x-2 p-1 rounded-lg hover:bg-slate-700/50 transition-all duration-200 group"
                  >
                    <div className={`h-8 w-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center`}>
                      {getRoleIcon()}
                    </div>
                    <div className="hidden lg:block text-left">
                      <p className="text-sm font-medium text-white">{user.username || 'User'}</p>
                      <div className="flex items-center gap-1">
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${getRoleBadgeColor()} text-white`}>
                          {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
                        </span>
                      </div>
                    </div>
                    <ChevronDown className="hidden lg:block h-4 w-4 text-slate-400 group-hover:text-white transition-colors" />
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileDropdownOpen && (
                    <>
                      {/* Click outside handler */}
                      <div 
                        className="fixed inset-0 z-40"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-64 bg-slate-800 rounded-lg shadow-xl border border-slate-700 overflow-hidden z-50">
                        {/* User Info Header */}
                        <div className="p-4 border-b border-slate-700 bg-slate-800/50">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                              {getRoleIcon()}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-white">{user.username || 'User'}</p>
                              <span className={`text-xs px-1.5 py-0.5 rounded-full ${getRoleBadgeColor()} text-white inline-block mt-1`}>
                                {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Menu Items */}
                        <div className="py-2">
                          <a
                            href={getDashboardUrl()}
                            className="flex items-center px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                            onClick={() => setIsProfileDropdownOpen(false)}
                          >
                            <LayoutDashboard className="h-4 w-4 mr-3" />
                            Dashboard
                          </a>
                          
                          <hr className="my-1 border-slate-700" />
                          <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-slate-700 hover:text-red-300 transition-colors"
                          >
                            <LogOut className="h-4 w-4 mr-3" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                /* Login/Signup Buttons for Logged Out Users */
                <>
                  <a
                    href="/login"
                    className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-indigo-400 border border-indigo-400 hover:bg-indigo-400/10 transition-all duration-200 group"
                  >
                    <LogIn className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    Login
                  </a>

                  <a
                    href="/signup"
                    className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-200 group shadow-lg hover:shadow-indigo-500/25"
                  >
                    <UserPlus className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    Sign Up
                  </a>
                </>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all duration-200"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            isMobileMenuOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="px-4 pt-2 pb-4 space-y-1 bg-slate-800/95 border-t border-slate-700">
            {/* Mobile Brand */}
            <div className="py-2 mb-2">
              <h1 className="text-lg font-bold text-white">DeptFlow</h1>
              <p className="text-xs text-slate-400">Department Management System</p>
            </div>

            {/* Mobile Navigation Links */}
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </a>
            ))}

            {/* Mobile User Section - Conditional */}
            {isLoggedIn && user ? (
              /* Mobile Logged In User Section */
              <div className="pt-4 mt-2 border-t border-slate-700">
                <div className="flex items-center px-3 py-2 mb-2 bg-slate-700/30 rounded-lg">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                    {getRoleIcon()}
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-white">{user.username || 'User'}</p>
                    <p className="text-xs text-slate-400">{user.email || 'No email'}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${getRoleBadgeColor()} text-white`}>
                    {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
                  </span>
                </div>
                
                <a
                  href={getDashboardUrl()}
                  className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition-all duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <LayoutDashboard className="h-5 w-5 mr-3" />
                  Dashboard
                </a>
                
                <a
                  href={getProfileUrl()}
                  className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition-all duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <UserCircle className="h-5 w-5 mr-3" />
                  My Profile
                </a>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-3 py-2 mt-2 text-sm text-red-400 hover:bg-slate-700 rounded-lg transition-all duration-200"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Sign Out
                </button>
              </div>
            ) : (
              /* Mobile Login/Signup Buttons for Logged Out Users */
              <div className="pt-4 mt-2 border-t border-slate-700 space-y-2">
                <a
                  href="/login"
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-indigo-400 border border-indigo-400 hover:bg-indigo-400/10 transition-all duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <LogIn className="h-4 w-4" />
                  Login
                </a>

                <a
                  href="/signup"
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <UserPlus className="h-4 w-4" />
                  Sign Up
                </a>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;