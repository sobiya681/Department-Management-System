import React from 'react';
import {
    Calendar,
    Award,
    Computer,
    Brain,
    Database,
    Shield,
    BarChart3,
    Microscope,
    GraduationCap,
    Users,
    BookOpen,
    TrendingUp,
    Clock,
    Globe,
    Zap,
    CheckCircle,
    ArrowRight
} from 'lucide-react';
import campusImage from '../assets/campus.jpg';

const AboutUs = () => {
    // Programs offered
    const undergraduatePrograms = [
        { name: "BS Computer Science", duration: "4 Years", seats: 100, icon: Computer },
        { name: "BS Information Technology", duration: "4 Years", seats: 80, icon: Database },
        { name: "BS Software Engineering", duration: "4 Years", seats: 80, icon: Shield },
        { name: "BS Data Science", duration: "4 Years", seats: 60, icon: BarChart3 },
        { name: "BS Artificial Intelligence", duration: "4 Years", seats: 60, icon: Brain },
        { name: "BS Bioinformatics", duration: "4 Years", seats: 50, icon: Microscope }
    ];

    const graduatePrograms = [
        { name: "MS Computer Science", duration: "2 Years", specializations: "AI, SE, DS" },
        { name: "M.Sc. Computer Science", duration: "2 Years", specializations: "Core CS" },
        { name: "PhD Computer Science", duration: "5 Years", specializations: "Research Focus" }
    ];

    const researchAreas = [
        "Artificial Intelligence & Machine Learning",
        "Software Engineering & Architecture",
        "Data Science & Big Data Analytics",
        "Cybersecurity & Cryptography",
        "Computer Vision & Image Processing",
        "Cloud Computing & Distributed Systems",
        "Human-Computer Interaction",
        "Bioinformatics & Computational Biology"
    ];

    const milestones = [
        { year: "1975", event: "Started Computer Short Courses", icon: Clock },
        { year: "1992", event: "M.Sc. Computer Science Program Launched", icon: GraduationCap },
        { year: "1996", event: "Independent Department of CS Established", icon: Award },
        { year: "2000", event: "MS Computer Science Program Started", icon: TrendingUp },
        { year: "2010", event: "PhD Program Introduced", icon: Microscope },
        { year: "2015", event: "BS Programs Launched (CS, IT, SE)", icon: Computer },
        { year: "2020", event: "BS Data Science & AI Programs Added", icon: Brain },
        { year: "2023", event: "BS Bioinformatics Program Started", icon: Database }
    ];

    const facilities = [
        "State-of-the-art Computer Laboratories",
        "High-Performance Computing Cluster",
        "Specialized AI & Data Science Lab",
        "Software Development Center",
        "Cybersecurity Research Lab",
        "24/7 Access to Computing Facilities",
        "Industry-standard Software Licenses",
        "High-speed Internet Connectivity"
    ];

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Hero Section with Campus Image */}
            <div className="relative h-[500px] sm:h-[600px] overflow-hidden">
                {/* Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
                    style={{
                        backgroundImage: `url(${campusImage})`,
                    }}
                />

                {/* Overlay Gradients */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/40 to-purple-900/40" />

                {/* Animated Pattern Overlay */}
                <div className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                        backgroundSize: '40px 40px'
                    }}
                />

                {/* Hero Content */}
                <div className="relative h-full flex items-center">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <div className="animate-fade-in-up">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                                <GraduationCap className="h-4 w-4 text-indigo-300" />
                                <span className="text-sm font-semibold text-indigo-200">Established 1996</span>
                            </div>

                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
                                Department of
                                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent block mt-2">
                                    Computer Science
                                </span>
                            </h1>

                            <p className="text-lg sm:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
                                Pioneering Computer Science Education in Pakistan since 1975 —
                                Shaping the future through innovation, research, and excellence
                            </p>
                        </div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
                        <div className="w-1 h-2 bg-white/50 rounded-full mt-2 animate-pulse" />
                    </div>
                </div>
            </div>

            {/* History Section */}
            <div className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 mb-6">
                                <Calendar className="h-4 w-4 text-indigo-600" />
                                <span className="text-sm font-semibold text-indigo-600">Our History</span>
                            </div>

                            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                                A Legacy of <span className="text-indigo-600">Excellence</span> in Computing Education
                            </h2>

                            <div className="space-y-4 text-gray-600 leading-relaxed">
                                <p>
                                    The Computer Science education in the University was started in <span className="font-semibold text-indigo-600">1975</span> in the form of short courses
                                    with an objective to develop computer know-how. Over the years, the computational facilities were
                                    strengthened and updated to enable the University to initiate the <span className="font-semibold">M.Sc. Degree programs in Computer Science</span>
                                    during the year <span className="font-semibold text-indigo-600">1992</span> in the department of Mathematics and Statistics as part of its continuing
                                    computer education agenda.
                                </p>

                                <p>
                                    In the year <span className="font-semibold text-indigo-600">1996</span> an <span className="font-semibold">independent department of Computer Science</span> was established to perform
                                    all the functions related to Computer Science and especially to promote and develop computer education
                                    in the country. Currently, the department is offering multiple degree programs including M.Sc. Computer
                                    Science, M.S. Computer Science, and various BS programs.
                                </p>

                                <p>
                                    The curriculum of the Computer Science degree programs covers all aspects of computing, particularly
                                    Artificial Intelligence, Software Engineering, Databases, Numerical Analysis, Computer Architecture,
                                    Multimedia, Graphics, and other rapidly evolving areas in computer science.
                                </p>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 shadow-xl">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 rounded-full blur-3xl" />
                                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <Clock className="h-6 w-6 text-indigo-600" />
                                    Key Milestones
                                </h3>
                                <div className="space-y-4">
                                    {milestones.map((milestone, index) => (
                                        <div key={index} className="flex items-start gap-4 group cursor-pointer">
                                            <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                                                <milestone.icon className="h-5 w-5 text-indigo-600" />
                                            </div>
                                            <div>
                                                <div className="text-lg font-bold text-indigo-600">{milestone.year}</div>
                                                <div className="text-gray-700">{milestone.event}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Programs Section */}
            <div className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 mb-4">
                            <GraduationCap className="h-4 w-4 text-indigo-600" />
                            <span className="text-sm font-semibold text-indigo-600">Academic Programs</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                            Programs We <span className="text-indigo-600">Offer</span>
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Comprehensive programs designed to prepare students for successful careers in computing
                        </p>
                    </div>

                    {/* Undergraduate Programs */}
                    <div className="mb-12">
                        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <Computer className="h-6 w-6 text-indigo-600" />
                            Undergraduate Programs
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {undergraduatePrograms.map((program, index) => {
                                const Icon = program.icon;
                                return (
                                    <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="h-12 w-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <Icon className="h-6 w-6 text-white" />
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-semibold text-indigo-600">{program.duration}</div>
                                                <div className="text-xs text-gray-500">{program.seats} Seats</div>
                                            </div>
                                        </div>
                                        <h4 className="text-lg font-bold text-gray-900 mb-2">{program.name}</h4>
                                        <div className="flex items-center gap-1 text-sm text-gray-500">
                                            <CheckCircle className="h-3 w-3 text-green-500" />
                                            <span>HEC Recognized</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Graduate Programs */}
                    <div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <GraduationCap className="h-6 w-6 text-indigo-600" />
                            Graduate & Doctoral Programs
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {graduatePrograms.map((program, index) => (
                                <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                                    <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                                        <BookOpen className="h-6 w-6 text-purple-600" />
                                    </div>
                                    <h4 className="text-lg font-bold text-gray-900 mb-2">{program.name}</h4>
                                    <p className="text-sm text-gray-500 mb-2">Duration: {program.duration}</p>
                                    <p className="text-sm text-indigo-600">Specializations: {program.specializations}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Research Areas Section */}
            <div className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 mb-4">
                            <Brain className="h-4 w-4 text-indigo-600" />
                            <span className="text-sm font-semibold text-indigo-600">Research Excellence</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                            Research <span className="text-indigo-600">Areas</span>
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Pushing the boundaries of knowledge through cutting-edge research
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {researchAreas.map((area, index) => (
                            <div key={index} className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 hover:from-indigo-100 hover:to-purple-100 transition-all duration-300 group cursor-pointer">
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 bg-indigo-600 rounded-full group-hover:scale-150 transition-transform" />
                                    <span className="text-gray-700 group-hover:text-indigo-600 transition-colors">{area}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Research Emphasis */}
                    <div className="mt-12 bg-indigo-50 rounded-2xl p-8 border border-indigo-100">
                        <div className="flex items-start gap-4">
                            <Microscope className="h-8 w-8 text-indigo-600 flex-shrink-0" />
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Project & Research Focus</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    The main emphasis is on project/research ranging from practical problems of application development
                                    to deal with the abstract and philosophical issues of computer science and advanced computing.
                                    Students are encouraged to take courses and complete a project in an area of computer science,
                                    which interacts with Information Management, or other fields covered by the department.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Facilities Section */}
            <div className="py-20 bg-gradient-to-br from-gray-900 to-slate-900 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm mb-4">
                            <Zap className="h-4 w-4 text-indigo-300" />
                            <span className="text-sm font-semibold text-indigo-300">Infrastructure</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                            State-of-the-Art <span className="text-indigo-400">Facilities</span>
                        </h2>
                        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                            World-class computing facilities that compare favorably with any university in Pakistan
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {facilities.map((facility, index) => (
                            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-all duration-300">
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="h-5 w-5 text-indigo-400 flex-shrink-0" />
                                    <span className="text-sm">{facility}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Computing Facilities Highlight */}
                    <div className="mt-12 bg-white/5 rounded-2xl p-6 border border-white/10">
                        <p className="text-gray-300 leading-relaxed text-center">
                            The department has excellent computing facilities available for training, data analysis, programs development
                            and research. The laboratories are rich in both software and hardware installations. We hope to strengthen
                            our postgraduate programs, giving more emphasis on student's projects and making them more meaningful for
                            the software industry.
                        </p>
                    </div>
                </div>
            </div>

            {/* Statistics Section */}
            <div className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="text-4xl font-bold text-indigo-600 mb-2">1975</div>
                            <div className="text-gray-600">Year Founded</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-indigo-600 mb-2">500+</div>
                            <div className="text-gray-600">Active Students</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-indigo-600 mb-2">30+</div>
                            <div className="text-gray-600">Faculty Members</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-indigo-600 mb-2">8</div>
                            <div className="text-gray-600">Degree Programs</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Join Our Department</h2>
                    <p className="text-indigo-100 mb-8 text-lg">
                        Become part of a legacy of excellence in computer science education
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <button className="px-6 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 flex items-center gap-2">
                            Apply Now
                            <ArrowRight className="h-4 w-4" />
                        </button>
                        <button className="px-6 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-all duration-300">
                            Download Brochure
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;