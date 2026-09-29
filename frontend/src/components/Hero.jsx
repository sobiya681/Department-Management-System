import React from 'react';
import { 
  ArrowRight, 
  GraduationCap, 
  Users, 
  Trophy, 
  Code2,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import campusImage from '../assets/campus.jpg';

const Hero = () => {
  // Department statistics
  const stats = [
    { 
      icon: Users, 
      value: "2,500+", 
      label: "Active Students",
      description: "Enrolled in various programs"
    },
    { 
      icon: GraduationCap, 
      value: "95%", 
      label: "Placement Rate",
      description: "Graduates placed in top companies"
    },
    { 
      icon: Trophy, 
      value: "50+", 
      label: "Industry Awards",
      description: "Recognitions and achievements"
    },
    { 
      icon: Code2, 
      value: "30+", 
      label: "Research Labs",
      description: "State-of-the-art facilities"
    }
  ];

  // Core programs
  const programs = [
    "B.Tech in Computer Science",
    "M.Tech in AI & Machine Learning",
    "PhD in Computational Sciences",
    "Diploma in Data Analytics"
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url(${campusImage})`,
            backgroundAttachment: 'fixed'
          }}
        />
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-slate-900/95" />
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/30 to-purple-900/30" />
        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 opacity-20" 
             style={{
               backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 1px)`,
               backgroundSize: '40px 40px'
             }}
        />
      </div>

      {/* Floating Animated Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32 lg:pt-32 lg:pb-40">
        
        {/* Badge */}
        <div className="flex justify-center lg:justify-start mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 backdrop-blur-sm border border-indigo-500/20">
            <Sparkles className="h-4 w-4 text-indigo-400 animate-pulse" />
            <span className="text-sm font-medium text-indigo-300">
              Excellence in Computer Science Education Since 1985
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column - Main Content */}
          <div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent">
                Department of
              </span>
              <br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Computer Science
              </span>
            </h1>
            
            <p className="text-lg text-slate-300 mb-8 leading-relaxed">
              Shaping the future of technology through innovative education, 
              cutting-edge research, and industry collaboration. Our department 
              is at the forefront of computing education, preparing the next 
              generation of tech leaders and innovators.
            </p>

            {/* Key Highlights */}
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm text-slate-300">NAAC A++ Accredited</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="h-2 w-2 bg-blue-400 rounded-full animate-pulse" />
                <span className="text-sm text-slate-300">NBA Accredited Programs</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="h-2 w-2 bg-purple-400 rounded-full animate-pulse" />
                <span className="text-sm text-slate-300">Top 10 NIRF Ranking</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <button className="group relative px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-lg text-white font-semibold overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/25">
                <span className="relative z-10 flex items-center gap-2">
                  Explore Programs
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-indigo-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </button>
              
              <button className="px-6 py-3 bg-white/10 backdrop-blur-sm rounded-lg text-white font-semibold border border-white/20 hover:bg-white/20 transition-all duration-300">
                Virtual Tour
              </button>
              
              <button className="px-6 py-3 bg-transparent rounded-lg text-indigo-300 font-semibold border border-indigo-500/50 hover:bg-indigo-500/10 transition-all duration-300 flex items-center gap-2">
                Apply Now
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-8 border-t border-white/10">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center lg:text-left group">
                    <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                      <Icon className="h-5 w-5 text-indigo-400 group-hover:scale-110 transition-transform" />
                      <span className="text-2xl font-bold text-white">{stat.value}</span>
                    </div>
                    <p className="text-sm font-medium text-slate-300">{stat.label}</p>
                    <p className="text-xs text-slate-500 mt-1">{stat.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column - Program Cards & Info */}
          <div className="space-y-6">
            {/* Vision Card */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-indigo-500/30 transition-all duration-300">
              <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-indigo-400" />
                Our Vision
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                To be a globally recognized center of excellence in computer science education 
                and research, fostering innovation and producing leaders who drive technological 
                advancement and societal transformation.
              </p>
            </div>

            {/* Programs Card */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-4">Academic Programs</h3>
              <div className="space-y-3">
                {programs.map((program, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200 group cursor-pointer"
                  >
                    <span className="text-slate-300 text-sm group-hover:text-white transition-colors">
                      {program}
                    </span>
                    <ChevronRight className="h-4 w-4 text-indigo-400 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                  </div>
                ))}
              </div>
            </div>

            {/* Research Highlights */}
            <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 backdrop-blur-md rounded-2xl p-6 border border-indigo-500/20">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                  <Code2 className="h-5 w-5 text-indigo-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Research Excellence</h4>
                  <p className="text-sm text-slate-300">
                    500+ research papers published in top-tier journals, 15+ patents filed, 
                    and collaborations with industry giants like Google, Microsoft, and IBM.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave Decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto opacity-20">
          <path fill="#ffffff" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
        </svg>
      </div>
    </div>
  );
};

export default Hero;