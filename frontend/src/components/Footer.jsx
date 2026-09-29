import React from "react";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  Clock,
  Calendar,
  BookOpen,
  Users,
  Award,
  ChevronRight,
  Heart,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Quick links
  const quickLinks = [
    { name: "About Us", href: "/about" },
    { name: "Academic Programs", href: "/programs" },
    { name: "Faculty", href: "/faculty" },
    { name: "Research", href: "/research" },
    { name: "Admissions", href: "/admissions" },
    { name: "Contact Us", href: "/contact" },
  ];

  const programs = [
    { name: "BS Computer Science", href: "/programs/bscs" },
    { name: "BS Software Engineering", href: "/programs/bssE" },
    { name: "BS Data Science", href: "/programs/bsds" },
    { name: "BS Artificial Intelligence", href: "/programs/bsai" },
    { name: "BS Bioinformatics", href: "/programs/bsbioinfo" },
    { name: "MS/M.Sc. Computer Science", href: "/programs/mscs" },
  ];

  const contactInfo = {
    address:
      "Department of Computer Science, University of Agriculture, Faisalabad, Pakistan",
    phone: "+92-41-9200161-70",
    email: "info@cs.uaf.edu.pk",
    website: "www.uaf.edu.pk/cs",
  };

  const officeHours = {
    weekdays: "8:00 AM - 4:00 PM",
    friday: "8:00 AM - 12:30 PM",
    saturday: "9:00 AM - 1:00 PM",
  };

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        {/* Top Section with Logo and Social Links */}
        <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start gap-8 pb-12 border-b border-slate-700">
          {/* Logo and Brand */}
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start space-x-3 mb-4">
              <div className="bg-indigo-600 rounded-lg p-2">
                <Building2 className="h-7 w-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  DeptFlow
                </h2>
                <p className="text-xs text-slate-400">
                  Department of Computer Science
                </p>
              </div>
            </div>
            <p className="text-slate-400 max-w-md text-sm">
              Pioneering computer science education and research since 1975,
              shaping the future of technology and innovation.
            </p>
          </div>

          {/* Social Links */}
        </div>

        {/* Middle Section - Links and Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-12">
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <ChevronRight className="h-4 w-4 text-indigo-400" />
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-slate-400 hover:text-indigo-400 transition-colors duration-200 flex items-center gap-2 text-sm group"
                  >
                    <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-indigo-400" />
              Programs
            </h3>
            <ul className="space-y-2">
              {programs.map((program, index) => (
                <li key={index}>
                  <a
                    href={program.href}
                    className="text-slate-400 hover:text-indigo-400 transition-colors duration-200 text-sm block"
                  >
                    {program.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-indigo-400" />
              Contact Info
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                <span className="text-slate-400 text-sm">
                  {contactInfo.address}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-indigo-400 flex-shrink-0" />
                <a
                  href={`tel:${contactInfo.phone}`}
                  className="text-slate-400 hover:text-indigo-400 text-sm transition-colors"
                >
                  {contactInfo.phone}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-indigo-400 flex-shrink-0" />
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="text-slate-400 hover:text-indigo-400 text-sm transition-colors break-all"
                >
                  {contactInfo.email}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="h-4 w-4 text-indigo-400 flex-shrink-0" />
                <a
                  href={`https://${contactInfo.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-indigo-400 text-sm transition-colors"
                >
                  {contactInfo.website}
                </a>
              </div>
            </div>
          </div>

          {/* Office Hours */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Clock className="h-4 w-4 text-indigo-400" />
              Office Hours
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Monday - Thursday:</span>
                <span className="text-white">{officeHours.weekdays}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Friday:</span>
                <span className="text-white">{officeHours.friday}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Saturday:</span>
                <span className="text-white">{officeHours.saturday}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Sunday:</span>
                <span className="text-white">Closed</span>
              </div>
            </div>

            {/* Accreditation Badges */}
            <div className="mt-6 pt-4 border-t border-slate-700">
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-600/20 rounded-full text-xs">
                  <Award className="h-3 w-3 text-indigo-400" />
                  HEC Recognized
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-600/20 rounded-full text-xs">
                  <Users className="h-3 w-3 text-indigo-400" />
                  NAAC A++ Grade
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="py-8 border-t border-slate-700">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-lg font-semibold mb-2">
                Subscribe to Our Newsletter
              </h3>
              <p className="text-slate-400 text-sm">
                Get the latest updates about admissions, events, and research
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors w-full sm:w-72"
              />
              <button className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-700">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-slate-400 text-sm">
                © {currentYear} Department of Computer Science, University of
                Agriculture, Faisalabad. All rights reserved.
              </p>
            </div>
            <div className="flex gap-6 text-sm">
              <a
                href="#"
                className="text-slate-400 hover:text-indigo-400 transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-indigo-400 transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-indigo-400 transition-colors"
              >
                Accessibility
              </a>
            </div>
          </div>

          {/* Developer Credit */}
          <div className="text-center mt-6">
            <p className="text-slate-500 text-xs flex items-center justify-center gap-1">
              Made by Sobia Fayyaz{" "}
              <Heart className="h-3 w-3 text-red-500 fill-red-500" /> for the CS
              Department • UAF
            </p>
          </div>
        </div>
      </div>

      {/* Decorative Bottom Gradient */}
      <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
    </footer>
  );
};

export default Footer;
