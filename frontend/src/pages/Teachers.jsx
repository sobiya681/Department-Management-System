import React, { useState, useEffect } from 'react';
import {
    ChevronLeft,
    ChevronRight,
    Mail,
    Phone,
    BookOpen,
    Award,
    GraduationCap,
    MapPin,
    Search,
    Filter,
    X,
    ChevronsLeft,
    ChevronsRight
} from 'lucide-react';

const TeachersPage = () => {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(9);

    // Sample faculty data based on UAF CS department
    const facultyData = [
        {
            id: 1,
            name: "Dr. Muhammad Ahmad Mateen",
            designation: "Professor & Head of Department",
            qualification: "Ph.D. Computer Science",
            specialization: "Artificial Intelligence, Machine Learning",
            email: "m.ahmad@uaf.edu.pk",
            phone: "+92-41-9200161",
            office: "Room #201, CS Block",
            research: "Published 45+ research papers in HEC recognized journals",
            awards: "Best University Teacher Award 2022",
            experience: "18+ years",
            education: "Ph.D. from University of Cambridge",
            image: "https://web.uaf.edu.pk/UploadFiles/StaffPic/16969c84-4ef9-4d0f-85a3-87e91d179c05.jpg",
            department: "Computer Science"
        },
        {
            id: 2,
            name: "Dr. Syed Mushhad Mustuzhar Gilanir",
            designation: "Associate Professor",
            qualification: "Ph.D. Data Science",
            specialization: "Data Mining, Big Data Analytics",
            email: "saima.zafar@uaf.edu.pk",
            phone: "+92-41-9200162",
            office: "Room #105, CS Block",
            research: "Leading research group in Data Analytics",
            awards: "Research Productivity Award 2021, 2023",
            experience: "12+ years",
            education: "Ph.D. from University of Manchester",
            image: "https://web.uaf.edu.pk/UploadFiles/StaffPic/61b81298-9c73-448f-a4e8-2eca24353b28.jpg",
            department: "Computer Science"
        },
        {
            id: 3,
            name: "Dr. Imran Mumtaz",
            designation: "Associate Professor",
            qualification: "Ph.D. Software Engineering",
            specialization: "Software Architecture, Agile Methodologies",
            email: "khalid.mahmood@uaf.edu.pk",
            phone: "+92-41-9200163",
            office: "Room #308, CS Block",
            research: "20+ years of industry and academic experience",
            awards: "HEC Best Researcher Award 2020",
            experience: "20+ years",
            education: "Ph.D. from University of Oxford",
            image: "https://web.uaf.edu.pk/UploadFiles/StaffPic/6309586f-22ff-44f9-94af-e7c1c4fd4bb7.JPG",
            department: "Computer Science"
        },
        {
            id: 4,
            name: "Mr. Ahsan Raza Sattar",
            designation: "Assistant Professor",
            qualification: "M.S. Cybersecurity",
            specialization: "Network Security, Cryptography",
            email: "fatima.tariq@uaf.edu.pk",
            phone: "+92-41-9200164",
            office: "Room #112, CS Block",
            research: "Published in top cybersecurity journals",
            awards: "Young Researcher Award 2023",
            experience: "8+ years",
            education: "M.S. from National University of Sciences and Technology",
            image: "https://web.uaf.edu.pk/UploadFiles/StaffPic/47ab2e1d-22ac-45e2-acd9-6b2d3358ed99.jpg",
            department: "Computer Science"
        },
        {
            id: 5,
            name: "Dr. Qamar Nawaz",
            designation: "Assistant Professor",
            qualification: "Ph.D. Computer Vision",
            specialization: "Image Processing, Deep Learning",
            email: "usman.akram@uaf.edu.pk",
            phone: "+92-41-9200165",
            office: "Room #205, CS Block",
            research: "Collaborated with international research labs",
            awards: "Best Paper Award at ICML 2022",
            experience: "10+ years",
            education: "Ph.D. from Stanford University",
            image: "https://web.uaf.edu.pk/UploadFiles/StaffPic/1abd6c48-32de-4af3-b154-29ecfb5fe69c.jpg",
            department: "Computer Science"
        },
        {
            id: 6,
            name: "Dr. Nayyar Iqbal",
            designation: "Assistant Professor",
            qualification: "Ph.D. Human-Computer Interaction",
            specialization: "UX Design, Accessibility",
            email: "ayesha.naeem@uaf.edu.pk",
            phone: "+92-41-9200166",
            office: "Room #109, CS Block",
            research: "Focus on inclusive technology design",
            awards: "Women in Tech Award 2023",
            experience: "7+ years",
            education: "Ph.D. from University of Melbourne",
            image: "https://web.uaf.edu.pk/UploadFiles/StaffPic/58783632-08fa-4711-a6dd-d6f61bae1104.jpg",
            department: "Computer Science"
        },
        {
            id: 7,
            name: "Dr. Hassan Tariq",
            designation: "Professor",
            qualification: "Ph.D. Cloud Computing",
            specialization: "Distributed Systems, Cloud Architecture",
            email: "rizwan.ahmed@uaf.edu.pk",
            phone: "+92-41-9200167",
            office: "Room #301, CS Block",
            research: "Cloud security and scalability research",
            awards: "Research Excellence Award 2021",
            experience: "16+ years",
            education: "Ph.D. from University of California",
            image: "https://ui-avatars.com/api/?name=Dr.+Hassan+Tariq&background=2563EB&color=fff&size=200",
            department: "Computer Science"
        },
        {
            id: 8,
            name: "Dr. Muhammad Milhan Afzal Khan",
            designation: "Associate Professor",
            qualification: "Ph.D. Bioinformatics",
            specialization: "Computational Biology, Genomics",
            email: "nadia.khan@uaf.edu.pk",
            phone: "+92-41-9200168",
            office: "Room #107, CS Block",
            research: "Computational approaches for drug discovery",
            awards: "Best Researcher Award 2022",
            experience: "11+ years",
            education: "Ph.D. from University of Cambridge",
            image: "https://ui-avatars.com/api/?name=Dr.+Muhammad+Milhan&background=8B5CF6&color=fff&size=200",
            department: "Computer Science"
        },
        {
            id: 9,
            name: "Dr. Muhammad Azam Zia",
            designation: "Assistant Professor",
            qualification: "Ph.D. Robotics",
            specialization: "Autonomous Systems, Control Theory",
            email: "hassan.raza@uaf.edu.pk",
            phone: "+92-41-9200169",
            office: "Room #203, CS Block",
            research: "Developing autonomous navigation systems",
            awards: "Young Scientist Award 2023",
            experience: "6+ years",
            education: "Ph.D. from ETH Zurich",
            image: "https://ui-avatars.com/api/?name=Dr.+Muhammad+Azam&background=EA580C&color=fff&size=200",
            department: "Computer Science"
        },
        {
            id: 10,
            name: "Dr. Sana Akram",
            designation: "Professor",
            qualification: "Ph.D. Machine Learning",
            specialization: "Deep Learning, Neural Networks",
            email: "sana.akram@uaf.edu.pk",
            phone: "+92-41-9200170",
            office: "Room #305, CS Block",
            research: "Developing AI solutions for healthcare",
            awards: "Presidential Award for Excellence 2023",
            experience: "15+ years",
            education: "Ph.D. from MIT",
            image: "https://ui-avatars.com/api/?name=Dr.+Sana+Akram&background=DC2626&color=fff&size=200",
            department: "Computer Science"
        },
        {
            id: 11,
            name: "Dr. Usman Khalid",
            designation: "Associate Professor",
            qualification: "Ph.D. Internet of Things",
            specialization: "IoT, Embedded Systems",
            email: "usman.khalid@uaf.edu.pk",
            phone: "+92-41-9200171",
            office: "Room #208, CS Block",
            research: "Smart city solutions and IoT applications",
            awards: "Best Innovation Award 2022",
            experience: "9+ years",
            education: "Ph.D. from NUS Singapore",
            image: "https://ui-avatars.com/api/?name=Dr.+Usman+Khalid&background=059669&color=fff&size=200",
            department: "Computer Science"
        },
        {
            id: 12,
            name: "Dr. Fatima Zafar",
            designation: "Assistant Professor",
            qualification: "Ph.D. Blockchain Technology",
            specialization: "Cryptocurrency, Smart Contracts",
            email: "fatima.zafar@uaf.edu.pk",
            phone: "+92-41-9200172",
            office: "Room #115, CS Block",
            research: "Blockchain applications in finance",
            awards: "Young Researcher Award 2023",
            experience: "5+ years",
            education: "Ph.D. from ETH Zurich",
            image: "https://ui-avatars.com/api/?name=Dr.+Fatima+Zafar&background=7C3AED&color=fff&size=200",
            department: "Computer Science"
        }
    ];

    // Simulate API fetch
    useEffect(() => {
        setTimeout(() => {
            setTeachers(facultyData);
            setLoading(false);
        }, 1000);
    }, []);

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedDepartment]);

    // Filter teachers based on search and department
    const filteredTeachers = teachers.filter(teacher => {
        const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            teacher.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
            teacher.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
            teacher.qualification.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDepartment = selectedDepartment === 'all' || teacher.department === selectedDepartment;
        return matchesSearch && matchesDepartment;
    });

    // Pagination calculations
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentTeachers = filteredTeachers.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);

    // Generate page numbers to display
    const getPageNumbers = () => {
        const delta = 2; // Number of pages to show on each side of current page
        const range = [];
        const rangeWithDots = [];
        let l;

        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
                range.push(i);
            }
        }

        range.forEach((i) => {
            if (l) {
                if (i - l === 2) {
                    rangeWithDots.push(l + 1);
                } else if (i - l !== 1) {
                    rangeWithDots.push('...');
                }
            }
            rangeWithDots.push(i);
            l = i;
        });

        return rangeWithDots;
    };

    const paginate = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
            // Scroll to top of the grid
            document.getElementById('teachers-grid')?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    // Department options
    const departments = ['all', ...new Set(teachers.map(t => t.department).filter(Boolean))];

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
                    <p className="mt-4 text-gray-600">Loading faculty members...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <GraduationCap className="h-16 w-16 mx-auto mb-4 opacity-90" />
                        <h1 className="text-4xl sm:text-5xl font-bold mb-4">Our Distinguished Faculty</h1>
                        <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
                            Meet the brilliant minds behind our Computer Science department -
                            world-class educators, researchers, and industry experts
                        </p>
                    </div>
                </div>
            </div>

            {/* Search and Filter Section */}
            <div className="sticky top-0 bg-white shadow-md z-20 py-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                        {/* Search Bar */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name, designation, or specialization..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                }}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                >
                                    <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                                </button>
                            )}
                        </div>

                        {/* Department Filter */}
                        <div className="flex items-center gap-2">
                            <Filter className="h-5 w-5 text-gray-500" />
                            <select
                                value={selectedDepartment}
                                onChange={(e) => setSelectedDepartment(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                                <option value="all">All Departments</option>
                                {departments.filter(d => d !== 'all').map(dept => (
                                    <option key={dept} value={dept}>{dept}</option>
                                ))}
                            </select>
                        </div>

                        {/* Items Per Page Selector */}
                        <div className="flex items-center gap-2">
                            <label className="text-sm text-gray-600">Show:</label>
                            <select
                                value={itemsPerPage}
                                onChange={handleItemsPerPageChange}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value={6}>6</option>
                                <option value={9}>9</option>
                                <option value={12}>12</option>
                                <option value={18}>18</option>
                                <option value={24}>24</option>
                            </select>
                        </div>

                        {/* Results Count */}
                        <div className="text-sm text-gray-600">
                            Showing {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredTeachers.length)} of {filteredTeachers.length} faculty members
                        </div>
                    </div>
                </div>
            </div>

            {/* Teachers Grid */}
            <div id="teachers-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {filteredTeachers.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No faculty members found matching your criteria.</p>
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setSelectedDepartment('all');
                            }}
                            className="mt-4 text-indigo-600 hover:text-indigo-700 font-semibold"
                        >
                            Clear filters
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {currentTeachers.map((teacher) => (
                                <div
                                    key={teacher.id}
                                    className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2"
                                >
                                    {/* Teacher Image */}
                                    <div className="relative">
                                        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-indigo-600 to-purple-600" />
                                        <div className="relative pt-8 pb-4 flex justify-center">
                                            <div className="relative">
                                                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-75 blur-md group-hover:opacity-100 transition-opacity" />
                                                <img
                                                    src={teacher.image}
                                                    alt={teacher.name}
                                                    className="relative h-32 w-32 rounded-full border-4 border-white object-cover shadow-lg"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Teacher Info */}
                                    <div className="p-6">
                                        <div className="text-center mb-4">
                                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                                                {teacher.name}
                                            </h3>
                                            <p className="text-indigo-600 font-semibold text-sm">
                                                {teacher.designation}
                                            </p>
                                            <div className="flex items-center justify-center gap-1 mt-2">
                                                <Award className="h-3 w-3 text-yellow-500" />
                                                <p className="text-xs text-gray-500">{teacher.qualification}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-3 mb-4">
                                            <div className="flex items-start gap-2 text-sm">
                                                <BookOpen className="h-4 w-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                                                <span className="text-gray-700">
                                                    <span className="font-semibold">Specialization:</span> {teacher.specialization}
                                                </span>
                                            </div>

                                            <div className="flex items-start gap-2 text-sm">
                                                <Mail className="h-4 w-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                                                <a href={`mailto:${teacher.email}`} className="text-gray-600 hover:text-indigo-600 transition-colors break-all">
                                                    {teacher.email}
                                                </a>
                                            </div>

                                            <div className="flex items-start gap-2 text-sm">
                                                <Phone className="h-4 w-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                                                <span className="text-gray-600">{teacher.phone}</span>
                                            </div>

                                            <div className="flex items-start gap-2 text-sm">
                                                <MapPin className="h-4 w-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                                                <span className="text-gray-600">{teacher.office}</span>
                                            </div>
                                        </div>

                                        {/* Research & Awards */}
                                        <div className="bg-gray-50 rounded-lg p-3 mb-4">
                                            <p className="text-xs text-gray-600 mb-2">
                                                <span className="font-semibold">Research:</span> {teacher.research}
                                            </p>
                                            <p className="text-xs text-gray-600">
                                                <span className="font-semibold">Awards:</span> {teacher.awards}
                                            </p>
                                        </div>

                                        {/* Additional Info */}
                                        <div className="flex justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
                                            <span>Experience: {teacher.experience || 'N/A'}</span>
                                            <span>{teacher.education ? teacher.education.split('from')[0] : 'Qualification'}</span>
                                        </div>

                                        {/* View Details Button */}
                                        <button className="w-full mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all duration-300">
                                            View Full Profile
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Enhanced Pagination */}
                        {totalPages > 1 && (
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-12">
                                {/* Page Info */}
                                <div className="text-sm text-gray-600">
                                    Page {currentPage} of {totalPages}
                                </div>

                                {/* Pagination Controls */}
                                <div className="flex items-center gap-2">
                                    {/* First Page Button */}
                                    <button
                                        onClick={() => paginate(1)}
                                        disabled={currentPage === 1}
                                        className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                                        title="First Page"
                                    >
                                        <ChevronsLeft className="h-5 w-5" />
                                    </button>

                                    {/* Previous Button */}
                                    <button
                                        onClick={() => paginate(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                                        title="Previous Page"
                                    >
                                        <ChevronLeft className="h-5 w-5" />
                                    </button>

                                    {/* Page Numbers */}
                                    <div className="flex gap-2">
                                        {getPageNumbers().map((number, index) => (
                                            number === '...' ? (
                                                <span key={`dots-${index}`} className="px-3 py-2 text-gray-500">
                                                    ...
                                                </span>
                                            ) : (
                                                <button
                                                    key={number}
                                                    onClick={() => paginate(number)}
                                                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${currentPage === number
                                                            ? 'bg-indigo-600 text-white shadow-md transform scale-105'
                                                            : 'border border-gray-300 hover:bg-gray-50 hover:scale-105'
                                                        }`}
                                                >
                                                    {number}
                                                </button>
                                            )
                                        ))}
                                    </div>

                                    {/* Next Button */}
                                    <button
                                        onClick={() => paginate(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                                        title="Next Page"
                                    >
                                        <ChevronRight className="h-5 w-5" />
                                    </button>

                                    {/* Last Page Button */}
                                    <button
                                        onClick={() => paginate(totalPages)}
                                        disabled={currentPage === totalPages}
                                        className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                                        title="Last Page"
                                    >
                                        <ChevronsRight className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Statistics Footer */}
            <div className="bg-indigo-900 text-white py-8 mt-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        <div>
                            <div className="text-3xl font-bold">{teachers.length}+</div>
                            <div className="text-sm text-indigo-200">Faculty Members</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold">89%</div>
                            <div className="text-sm text-indigo-200">PhD Qualified</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold">500+</div>
                            <div className="text-sm text-indigo-200">Research Papers</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold">20+</div>
                            <div className="text-sm text-indigo-200">International Awards</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeachersPage;