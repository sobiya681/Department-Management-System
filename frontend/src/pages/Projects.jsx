// src/components/ProjectsShowcase.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Eye,
    Heart,
    MessageSquare,
    Link as LinkIcon,
    Calendar,
    Search,
    Filter,
    Star,
    X,
    Send,
    User,
    Mail,
    Code,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

const ProjectsShowcase = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedProject, setSelectedProject] = useState(null);
    const [comment, setComment] = useState('');
    const [likedProjects, setLikedProjects] = useState(new Set());
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(9);

    const API_URL = 'http://localhost:8000/api/projects';
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await axios.get(API_URL, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProjects(response.data.projects);
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async (projectId) => {
        try {
            const response = await axios.post(`${API_URL}/${projectId}/like`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (response.data.success) {
                setProjects(projects.map(project => 
                    project._id === projectId 
                        ? { ...project, likes: response.data.isLiked 
                            ? [...project.likes, { _id: 'temp' }]
                            : project.likes.filter(like => like._id !== 'temp') }
                        : project
                ));
                
                if (response.data.isLiked) {
                    likedProjects.add(projectId);
                } else {
                    likedProjects.delete(projectId);
                }
                setLikedProjects(new Set(likedProjects));
            }
        } catch (error) {
            console.error('Error liking project:', error);
        }
    };

    const handleComment = async (projectId) => {
        if (!comment.trim()) return;
        
        try {
            const response = await axios.post(`${API_URL}/${projectId}/comment`, 
                { comment },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            if (response.data.success) {
                setProjects(projects.map(project =>
                    project._id === projectId
                        ? { ...project, comments: response.data.comments }
                        : project
                ));
                setComment('');
            }
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const categories = ['All', 'Web Development', 'Mobile App', 'AI/ML', 'Game Development', 'IoT', 'Blockchain', 'Other'];

    const filteredProjects = projects.filter(project => {
        const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              project.developedBy.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !selectedCategory || selectedCategory === 'All' || project.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProjects = filteredProjects.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading projects...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <Code className="h-16 w-16 mx-auto mb-4 opacity-90" />
                    <h1 className="text-4xl sm:text-5xl font-bold mb-4">Student Projects Showcase</h1>
                    <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
                        Explore innovative projects created by our talented students
                    </p>
                </div>
            </div>

            {/* Search and Filter Section */}
            <div className="sticky top-0 bg-white shadow-md z-20 py-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by title, description, or developer..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        
                        <select
                            value={selectedCategory}
                            onChange={(e) => {
                                setSelectedCategory(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Projects Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {currentProjects.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No projects found matching your criteria.</p>
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setSelectedCategory('');
                            }}
                            className="mt-4 text-indigo-600 hover:text-indigo-700 font-semibold"
                        >
                            Clear filters
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {currentProjects.map((project) => (
                                <div
                                    key={project._id}
                                    className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2"
                                >
                                    <div className="relative h-48 cursor-pointer" onClick={() => setSelectedProject(project)}>
                                        <img
                                            src={project.imageUrl}
                                            alt={project.title}
                                            className="w-full h-full object-cover"
                                        />
                                        {project.featured && (
                                            <div className="absolute top-2 left-2">
                                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-500 text-white">
                                                    <Star className="h-3 w-3" />
                                                    Featured
                                                </span>
                                            </div>
                                        )}
                                        <div className="absolute bottom-2 right-2">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                project.status === 'completed' ? 'bg-green-500' :
                                                project.status === 'ongoing' ? 'bg-yellow-500' : 'bg-blue-500'
                                            } text-white`}>
                                                {project.status.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-gray-800 mb-2">{project.title}</h3>
                                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{project.description}</p>
                                        
                                        <div className="mb-3">
                                            <p className="text-sm text-gray-500">
                                                <span className="font-semibold">By:</span> {project.developedBy}
                                            </p>
                                        </div>
                                        
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs">
                                                {project.category}
                                            </span>
                                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                                                <Calendar className="h-3 w-3 inline mr-1" />
                                                {project.year}
                                            </span>
                                        </div>
                                        
                                        {project.technologies?.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mb-4">
                                                {project.technologies.slice(0, 3).map((tech, idx) => (
                                                    <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        
                                        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                                            <div className="flex gap-4">
                                                <button
                                                    onClick={() => handleLike(project._id)}
                                                    className={`flex items-center gap-1 transition-colors ${
                                                        likedProjects.has(project._id) 
                                                            ? 'text-red-500' 
                                                            : 'text-gray-500 hover:text-red-500'
                                                    }`}
                                                >
                                                    <Heart className={`h-5 w-5 ${likedProjects.has(project._id) ? 'fill-current' : ''}`} />
                                                    <span className="text-sm">{project.likes?.length || 0}</span>
                                                </button>
                                                <button
                                                    onClick={() => setSelectedProject(project)}
                                                    className="flex items-center gap-1 text-gray-500 hover:text-indigo-600"
                                                >
                                                    <MessageSquare className="h-5 w-5" />
                                                    <span className="text-sm">{project.comments?.length || 0}</span>
                                                </button>
                                                <div className="flex items-center gap-1 text-gray-500">
                                                    <Eye className="h-5 w-5" />
                                                    <span className="text-sm">{project.views || 0}</span>
                                                </div>
                                            </div>
                                            <a
                                                href={project.projectLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center gap-1"
                                            >
                                                View Project
                                                <LinkIcon className="h-3 w-3" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2 mt-12">
                                <button
                                    onClick={() => paginate(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </button>
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    let pageNum;
                                    if (totalPages <= 5) {
                                        pageNum = i + 1;
                                    } else if (currentPage <= 3) {
                                        pageNum = i + 1;
                                    } else if (currentPage >= totalPages - 2) {
                                        pageNum = totalPages - 4 + i;
                                    } else {
                                        pageNum = currentPage - 2 + i;
                                    }
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => paginate(pageNum)}
                                            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                                                currentPage === pageNum
                                                    ? 'bg-indigo-600 text-white'
                                                    : 'border border-gray-300 hover:bg-gray-50'
                                            }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                                <button
                                    onClick={() => paginate(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Project Details Modal */}
            {selectedProject && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-gray-800">{selectedProject.title}</h2>
                            <button
                                onClick={() => setSelectedProject(null)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        
                        <div className="p-6">
                            <img
                                src={selectedProject.imageUrl}
                                alt={selectedProject.title}
                                className="w-full h-64 object-cover rounded-lg mb-6"
                            />
                            
                            <div className="prose max-w-none mb-6">
                                <p className="text-gray-700">{selectedProject.description}</p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-2">Project Details</h3>
                                    <p className="text-sm text-gray-600 mb-1">
                                        <strong>Developed by:</strong> {selectedProject.developedBy}
                                    </p>
                                    <p className="text-sm text-gray-600 mb-1">
                                        <strong>Email:</strong> {selectedProject.developedByEmail}
                                    </p>
                                    <p className="text-sm text-gray-600 mb-1">
                                        <strong>Category:</strong> {selectedProject.category}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <strong>Year:</strong> {selectedProject.year}
                                    </p>
                                </div>
                                
                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-2">Technologies Used</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedProject.technologies?.map((tech, idx) => (
                                            <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            
                            {/* Comments Section */}
                            <div className="border-t border-gray-200 pt-6">
                                <h3 className="font-semibold text-gray-800 mb-4">Comments ({selectedProject.comments?.length || 0})</h3>
                                
                                <div className="space-y-4 mb-4 max-h-64 overflow-y-auto">
                                    {selectedProject.comments?.map((comment, idx) => (
                                        <div key={idx} className="bg-gray-50 rounded-lg p-3">
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="font-medium text-sm text-gray-800">
                                                    {comment.user?.name || comment.user?.username}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {new Date(comment.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-700">{comment.comment}</p>
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="Add a comment..."
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        onKeyPress={(e) => e.key === 'Enter' && handleComment(selectedProject._id)}
                                    />
                                    <button
                                        onClick={() => handleComment(selectedProject._id)}
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                                    >
                                        <Send className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                            
                            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                                <button
                                    onClick={() => handleLike(selectedProject._id)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                                        likedProjects.has(selectedProject._id)
                                            ? 'bg-red-50 text-red-500'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    <Heart className={`h-5 w-5 ${likedProjects.has(selectedProject._id) ? 'fill-current' : ''}`} />
                                    Like ({selectedProject.likes?.length || 0})
                                </button>
                                <a
                                    href={selectedProject.projectLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                                >
                                    <LinkIcon className="h-4 w-4" />
                                    Visit Project
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectsShowcase;