import React from 'react';
import { FaClock, FaHammer, FaCode } from 'react-icons/fa';

const UpdateSoon = ({ 
  title, 
  description, 
  icon: Icon = FaClock, 
  expectedDate = "Coming Soon",
  userType = "User" 
}) => {
  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#1a2a33' }}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="text-center">
            {/* Icon */}
            <div className="mb-8 flex justify-center">
              <div className="p-6 bg-[#232b3a] rounded-full border border-white/10">
                <Icon className="text-[#D6A647] text-6xl" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {title}
            </h1>

            {/* Description */}
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              {description}
            </p>

            {/* Expected Date */}
            <div className="bg-[#232b3a] backdrop-blur-md rounded-xl border border-white/10 p-6 mb-8 max-w-md mx-auto">
              <div className="flex items-center justify-center gap-3 mb-3">
                <FaClock className="text-[#D6A647]" />
                <span className="text-white font-medium">Expected Launch</span>
              </div>
              <p className="text-2xl font-bold text-[#D6A647]">{expectedDate}</p>
            </div>

            {/* Features Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-8">
              <div className="bg-[#232b3a] backdrop-blur-md rounded-xl border border-white/10 p-6">
                <FaHammer className="text-[#D6A647] text-2xl mb-3 mx-auto" />
                <h3 className="text-white font-medium mb-2">In Development</h3>
                <p className="text-gray-400 text-sm">Our team is actively working on this feature</p>
              </div>
              
              <div className="bg-[#232b3a] backdrop-blur-md rounded-xl border border-white/10 p-6">
                <FaCode className="text-[#10b981] text-2xl mb-3 mx-auto" />
                <h3 className="text-white font-medium mb-2">Modern Design</h3>
                <p className="text-gray-400 text-sm">Built with latest technologies and best practices</p>
              </div>
              
              <div className="bg-[#232b3a] backdrop-blur-md rounded-xl border border-white/10 p-6">
                <FaClock className="text-[#06b6d4] text-2xl mb-3 mx-auto" />
                <h3 className="text-white font-medium mb-2">Regular Updates</h3>
                <p className="text-gray-400 text-sm">We'll keep you informed about the progress</p>
              </div>
            </div>

            {/* User Role Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-[#232b3a] border border-white/10 rounded-full">
              <span className="text-[#D6A647] font-medium">{userType} Dashboard</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateSoon; 