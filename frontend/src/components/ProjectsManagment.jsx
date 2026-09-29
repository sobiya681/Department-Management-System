// src/components/Admin/ProjectsManagement.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Plus,
    Edit,
    Trash2,
    Eye,
    X,
    Image as ImageIcon,
    Link as LinkIcon,
    Code,
    Calendar,
    Tag,
    Heart,
    MessageSquare,
    Search,
    Star,
    XCircle,
    CheckCircle,
    Clock
} from 'lucide-react';

const ProjectsManagement = ({ token }) => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [stats, setStats] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        projectLink: '',
        developedBy: '',
        developedByEmail: '',
        technologies: '',
        category: 'Web Development',
        year: new Date().getFullYear(),
        status: 'completed',
        featured: false
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');

    const API_URL = 'http://localhost:8000/api/projects';

    useEffect(() => {
        fetchProjects();
        fetchStats();
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

    const fetchStats = async () => {
        try {
            const response = await axios.get(`${API_URL}/stats/overview`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStats(response.data.stats);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append('title', formData.title);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('projectLink', formData.projectLink);
        formDataToSend.append('developedBy', formData.developedBy);
        formDataToSend.append('developedByEmail', formData.developedByEmail);
        formDataToSend.append('category', formData.category);
        formDataToSend.append('technologies', formData.technologies);
        formDataToSend.append('year', formData.year);
        formDataToSend.append('status', formData.status);
        formDataToSend.append('featured', formData.featured);

        if (imageFile) {
            formDataToSend.append('image', imageFile);
        }

        try {
            if (editingProject) {
                await axios.put(`${API_URL}/${editingProject._id}`, formDataToSend, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
            } else {
                await axios.post(API_URL, formDataToSend, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
            }

            fetchProjects();
            fetchStats();
            resetForm();
            setShowModal(false);
        } catch (error) {
            console.error('Error saving project:', error);
            alert(error.response?.data?.message || 'Error saving project');
        }
    };

    const handleDelete = async (projectId) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                await axios.delete(`${API_URL}/${projectId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchProjects();
                fetchStats();
            } catch (error) {
                console.error('Error deleting project:', error);
                alert('Error deleting project');
            }
        }
    };

    const handleEdit = (project) => {
        setEditingProject(project);
        setFormData({
            title: project.title,
            description: project.description,
            projectLink: project.projectLink,
            developedBy: project.developedBy,
            developedByEmail: project.developedByEmail,
            technologies: project.technologies.join(', '),
            category: project.category,
            year: project.year,
            status: project.status,
            featured: project.featured
        });
        setImagePreview(project.imageUrl);
        setShowModal(true);
    };

    const resetForm = () => {
        setEditingProject(null);
        setFormData({
            title: '',
            description: '',
            projectLink: '',
            developedBy: '',
            developedByEmail: '',
            technologies: '',
            category: 'Web Development',
            year: new Date().getFullYear(),
            status: 'completed',
            featured: false
        });
        setImageFile(null);
        setImagePreview('');
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const getStatusBadge = (status) => {
        const config = {
            completed: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
            ongoing: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
            proposed: { color: 'bg-blue-100 text-blue-800', icon: Star }
        };
        const { color, icon: Icon } = config[status];
        return (
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${color}`}>
                <Icon className="h-3 w-3" />
                {status.toUpperCase()}
            </span>
        );
    };

    const filteredProjects = projects.filter(project => {
        const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.developedBy.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !selectedCategory || project.category === selectedCategory;
        const matchesStatus = !selectedStatus || project.status === selectedStatus;
        return matchesSearch && matchesCategory && matchesStatus;
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
            {/* Header with Add Button */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Projects Management</h2>
                    <p className="text-gray-600 mt-1">Manage and showcase student projects</p>
                </div>
                <button
                    onClick={() => {
                        resetForm();
                        setShowModal(true);
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
                >
                    <Plus className="h-5 w-5" />
                    Add New Project
                </button>
            </div>

            {/* Stats Section */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <StatCard title="Total Projects" value={stats.totalProjects} icon={Code} color="bg-blue-500" />
                    <StatCard title="Completed" value={stats.completedProjects} icon={CheckCircle} color="bg-green-500" />
                    <StatCard title="Ongoing" value={stats.ongoingProjects} icon={Clock} color="bg-yellow-500" />
                    <StatCard title="Featured" value={stats.featuredProjects} icon={Star} color="bg-purple-500" />
                </div>
            )}

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[200px]">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search projects..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="">All Categories</option>
                        <option value="Web Development">Web Development</option>
                        <option value="Mobile App">Mobile App</option>
                        <option value="AI/ML">AI/ML</option>
                        <option value="Game Development">Game Development</option>
                        <option value="IoT">IoT</option>
                        <option value="Blockchain">Blockchain</option>
                        <option value="Other">Other</option>
                    </select>

                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="">All Status</option>
                        <option value="completed">Completed</option>
                        <option value="ongoing">Ongoing</option>
                        <option value="proposed">Proposed</option>
                    </select>
                </div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                    <div key={project._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                        <div className="relative h-48">
                            <img
                                src={project.imageUrl}
                                alt={project.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2 right-2 flex gap-2">
                                <button
                                    onClick={() => handleEdit(project)}
                                    className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-100"
                                >
                                    <Edit className="h-4 w-4 text-blue-600" />
                                </button>
                                <button
                                    onClick={() => handleDelete(project._id)}
                                    className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-100"
                                >
                                    <Trash2 className="h-4 w-4 text-red-600" />
                                </button>
                            </div>
                            <div className="absolute bottom-2 left-2 flex gap-2">
                                {getStatusBadge(project.status)}
                                {project.featured && (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-500 text-white">
                                        <Star className="h-3 w-3" />
                                        FEATURED
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">{project.title}</h3>
                            <p className="text-gray-600 text-sm mb-2 line-clamp-2">{project.description}</p>

                            <div className="mb-2">
                                <p className="text-sm text-gray-500">
                                    <span className="font-semibold">Developed by:</span> {project.developedBy}
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

                            {project.technologies.length > 0 && (
                                <div className="mb-4">
                                    <div className="flex flex-wrap gap-1">
                                        {project.technologies.slice(0, 3).map((tech, idx) => (
                                            <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                                                {tech}
                                            </span>
                                        ))}
                                        {project.technologies.length > 3 && (
                                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                                                +{project.technologies.length - 3}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                                <div className="flex gap-3 text-sm text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <Eye className="h-4 w-4" />
                                        {project.views}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Heart className="h-4 w-4" />
                                        {project.likes?.length || 0}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <MessageSquare className="h-4 w-4" />
                                        {project.comments?.length || 0}
                                    </span>
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

            {filteredProjects.length === 0 && (
                <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                    <Code className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600">No projects found</h3>
                    <p className="text-gray-500 mt-2">Click "Add New Project" to get started</p>
                </div>
            )}

            {/* Add/Edit Project Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-gray-800">
                                {editingProject ? 'Edit Project' : 'Add New Project'}
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
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Left Column */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Project Title *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                            placeholder="Enter project title"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Description *
                                        </label>
                                        <textarea
                                            required
                                            rows="4"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                            placeholder="Describe your project..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Project Link *
                                        </label>
                                        <input
                                            type="url"
                                            required
                                            value={formData.projectLink}
                                            onChange={(e) => setFormData({ ...formData, projectLink: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                            placeholder="https://..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Developed By *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.developedBy}
                                            onChange={(e) => setFormData({ ...formData, developedBy: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                            placeholder="Name of developer/team"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Developer Email *
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.developedByEmail}
                                            onChange={(e) => setFormData({ ...formData, developedByEmail: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                            placeholder="email@example.com"
                                        />
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Project Image *
                                        </label>
                                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-indigo-500 transition">
                                            <div className="space-y-1 text-center">
                                                {imagePreview ? (
                                                    <div className="relative">
                                                        <img src={imagePreview} alt="Preview" className="h-32 w-full object-cover rounded-lg" />
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setImagePreview('');
                                                                setImageFile(null);
                                                            }}
                                                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                                                        <div className="flex text-sm text-gray-600">
                                                            <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                                                                <span>Upload a file</span>
                                                                <input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    onChange={handleImageChange}
                                                                    className="sr-only"
                                                                />
                                                            </label>
                                                            <p className="pl-1">or drag and drop</p>
                                                        </div>
                                                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Technologies (comma-separated)
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.technologies}
                                            onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                            placeholder="React, Node.js, MongoDB, etc."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Category *
                                        </label>
                                        <select
                                            required
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        >
                                            <option value="Web Development">Web Development</option>
                                            <option value="Mobile App">Mobile App</option>
                                            <option value="AI/ML">AI/ML</option>
                                            <option value="Game Development">Game Development</option>
                                            <option value="IoT">IoT</option>
                                            <option value="Blockchain">Blockchain</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Year
                                            </label>
                                            <input
                                                type="number"
                                                value={formData.year}
                                                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Status
                                            </label>
                                            <select
                                                value={formData.status}
                                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                            >
                                                <option value="completed">Completed</option>
                                                <option value="ongoing">Ongoing</option>
                                                <option value="proposed">Proposed</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={formData.featured}
                                                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                            />
                                            <span className="text-sm font-medium text-gray-700">Feature this project (show on top)</span>
                                        </label>
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
                                    {editingProject ? 'Update Project' : 'Create Project'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectsManagement;