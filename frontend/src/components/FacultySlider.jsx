import React, { useState, useEffect } from 'react';
import {
    ChevronLeft,
    ChevronRight,
    Mail,
    Phone,
    BookOpen,
    Award,
    User,
    GraduationCap,
    Quote
} from 'lucide-react';

const FacultySlider = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [cardsPerView, setCardsPerView] = useState(3);

    // Faculty data based on UAF CS department
    const facultyMembers = [
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
            image: "https://web.uaf.edu.pk/UploadFiles/StaffPic/16969c84-4ef9-4d0f-85a3-87e91d179c05.jpg",
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
            image: "https://web.uaf.edu.pk/UploadFiles/StaffPic/61b81298-9c73-448f-a4e8-2eca24353b28.jpg",
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
            image: "https://web.uaf.edu.pk/UploadFiles/StaffPic/6309586f-22ff-44f9-94af-e7c1c4fd4bb7.JPG",
        },
        {
            id: 4,
            name: "Mr. Ahsan Raza Sattar",
            designation: "Assistant Professor",
            qualification: "Ph.D. Cybersecurity",
            specialization: "Network Security, Cryptography",
            email: "fatima.tariq@uaf.edu.pk",
            phone: "+92-41-9200164",
            office: "Room #112, CS Block",
            research: "Published in top cybersecurity journals",
            awards: "Young Researcher Award 2023",
            image: "https://web.uaf.edu.pk/UploadFiles/StaffPic/47ab2e1d-22ac-45e2-acd9-6b2d3358ed99.jpg",
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
            image: "https://web.uaf.edu.pk/UploadFiles/StaffPic/1abd6c48-32de-4af3-b154-29ecfb5fe69c.jpg",
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
            image: "https://web.uaf.edu.pk/UploadFiles/StaffPic/58783632-08fa-4711-a6dd-d6f61bae1104.jpg",
        }
    ];

    // Update cards per view based on screen size
    useEffect(() => {
        const updateCardsPerView = () => {
            if (window.innerWidth < 640) {
                setCardsPerView(1);
            } else if (window.innerWidth < 1024) {
                setCardsPerView(2);
            } else {
                setCardsPerView(3);
            }
        };

        updateCardsPerView();
        window.addEventListener('resize', updateCardsPerView);
        return () => window.removeEventListener('resize', updateCardsPerView);
    }, []);

    const totalSlides = Math.ceil(facultyMembers.length / cardsPerView);
    const maxIndex = totalSlides - 1;

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
    };

    const getVisibleFaculty = () => {
        const start = currentIndex * cardsPerView;
        return facultyMembers.slice(start, start + cardsPerView);
    };

    return (
        <div className="py-16 bg-gradient-to-br from-slate-50 to-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 mb-4">
                        <GraduationCap className="h-4 w-4 text-indigo-600" />
                        <span className="text-sm font-semibold text-indigo-600">Our Faculty</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                        Meet Our Distinguished <span className="text-indigo-600">Faculty Members</span>
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        World-class educators and researchers dedicated to shaping the future of computer science
                    </p>
                </div>

                {/* Slider Container */}
                <div className="relative">
                    {/* Navigation Buttons */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-6 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-indigo-50 group"
                    >
                        <ChevronLeft className="h-6 w-6 text-gray-600 group-hover:text-indigo-600" />
                    </button>

                    <button
                        onClick={nextSlide}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-6 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-indigo-50 group"
                    >
                        <ChevronRight className="h-6 w-6 text-gray-600 group-hover:text-indigo-600" />
                    </button>

                    {/* Cards Grid */}
                    <div className="overflow-hidden">
                        <div
                            className="flex transition-transform duration-500 ease-in-out"
                            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                        >
                            {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                                <div
                                    key={slideIndex}
                                    className="w-full flex-shrink-0"
                                >
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
                                        {facultyMembers
                                            .slice(slideIndex * cardsPerView, slideIndex * cardsPerView + cardsPerView)
                                            .map((faculty) => (
                                                <div
                                                    key={faculty.id}
                                                    className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2"
                                                >
                                                    {/* Card Header with Image */}
                                                    <div className="relative">
                                                        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-indigo-600 to-purple-600" />
                                                        <div className="relative pt-8 pb-4 flex justify-center">
                                                            <div className="relative">
                                                                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-75 blur-md group-hover:opacity-100 transition-opacity" />
                                                                <img
                                                                    src={faculty.image}
                                                                    alt={faculty.name}
                                                                    className="relative h-32 w-32 rounded-full border-4 border-white object-cover shadow-lg"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-1.5 shadow-md">
                                                            <Quote className="h-4 w-4 text-indigo-600" />
                                                        </div>
                                                    </div>

                                                    {/* Card Content */}
                                                    <div className="p-6">
                                                        <div className="text-center mb-4">
                                                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                                                                {faculty.name}
                                                            </h3>
                                                            <p className="text-indigo-600 font-semibold text-sm">
                                                                {faculty.designation}
                                                            </p>
                                                            <div className="flex items-center justify-center gap-1 mt-2">
                                                                <Award className="h-3 w-3 text-yellow-500" />
                                                                <p className="text-xs text-gray-500">{faculty.qualification}</p>
                                                            </div>
                                                        </div>

                                                        <div className="space-y-3 mb-4">
                                                            <div className="flex items-start gap-2 text-sm">
                                                                <BookOpen className="h-4 w-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                                                                <span className="text-gray-700">
                                                                    <span className="font-semibold">Specialization:</span> {faculty.specialization}
                                                                </span>
                                                            </div>

                                                            <div className="flex items-start gap-2 text-sm">
                                                                <Mail className="h-4 w-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                                                                <a href={`mailto:${faculty.email}`} className="text-gray-600 hover:text-indigo-600 transition-colors">
                                                                    {faculty.email}
                                                                </a>
                                                            </div>

                                                            <div className="flex items-start gap-2 text-sm">
                                                                <Phone className="h-4 w-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                                                                <span className="text-gray-600">{faculty.phone}</span>
                                                            </div>
                                                        </div>

                                                        {/* Research & Awards */}
                                                        <div className="bg-gray-50 rounded-lg p-3 mb-4">
                                                            <p className="text-xs text-gray-600 mb-1">
                                                                <span className="font-semibold">Research:</span> {faculty.research}
                                                            </p>
                                                            <p className="text-xs text-gray-600">
                                                                <span className="font-semibold">Awards:</span> {faculty.awards}
                                                            </p>
                                                        </div>


                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Dots Indicator */}
                    <div className="flex justify-center mt-8 gap-2">
                        {Array.from({ length: totalSlides }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`transition-all duration-300 rounded-full ${currentIndex === index
                                    ? "w-8 h-2 bg-indigo-600"
                                    : "w-2 h-2 bg-gray-300 hover:bg-gray-400"
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                {/* View All Faculty Button */}
                <div className="text-center mt-12">
                    <button className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                        View All Faculty Members
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FacultySlider;