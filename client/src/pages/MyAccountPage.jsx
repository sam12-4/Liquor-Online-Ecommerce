import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserIcon } from '@heroicons/react/24/outline';
import AnimatedSection from '../components/home/AnimatedSection';

// Import banner image
import bannerImg from '../assets/images/Slide1.jpg';

const MyAccountPage = () => {
  useEffect(() => {
    document.title = 'My Account - Liquor Online';
  }, []);

  return (
    <div>
      {/* Hero Banner */}
      <div className="relative bg-black flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={bannerImg}
            alt="Account Banner"
            className="w-full h-full object-cover opacity-50"
          />
        </div>
        <div className="relative z-10 text-center py-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            My Account
          </h1>
          <div className="flex items-center justify-center text-white/80">
            <Link to="/" className="hover:text-white">Home</Link>
            <span className="mx-2">›</span>
            <span className="font-medium">My Account</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Login Form */}
          <div className="bg-white p-6 border border-gray-200">
            <div className="flex items-center justify-center mb-6">
              <UserIcon className="h-6 w-6 mr-2" />
              <h2 className="text-xl font-medium">Login</h2>
            </div>
            <div className="border-b border-gray-200 mb-6"></div>
            
            <form>
              <div className="mb-4">
                <label className="block text-gray-600 mb-2">
                  Username or email address <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  className="w-full p-3 border border-gray-300 focus:border-[#c0a483] focus:outline-none"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-600 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <input 
                  type="password"
                  className="w-full p-3 border border-gray-300 focus:border-[#c0a483] focus:outline-none"
                />
              </div>
              
              <div className="flex justify-between items-center mb-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-[#c0a483]" />
                  <span className="text-gray-600">Remember me</span>
                </label>
                
                <Link to="/forgot-password" className="text-[#c0a483] hover:underline text-sm">
                  Lost your password?
                </Link>
              </div>
              
              <button
                type="submit"
                className="w-full bg-black hover:bg-gray-800 text-white py-3 uppercase font-medium transition-colors"
              >
                LOGIN
              </button>
            </form>
          </div>
          
          {/* Register Form */}
          <div className="bg-white p-6 border border-gray-200">
            <div className="flex items-center justify-center mb-6">
              <UserIcon className="h-6 w-6 mr-2" />
              <h2 className="text-xl font-medium">Register</h2>
            </div>
            <div className="border-b border-gray-200 mb-6"></div>
            
            <form>
              <div className="mb-4">
                <label className="block text-gray-600 mb-2">
                  Email address <span className="text-red-500">*</span>
                </label>
                <input 
                  type="email"
                  className="w-full p-3 border border-gray-300 focus:border-[#c0a483] focus:outline-none"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-600 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <input 
                  type="password"
                  className="w-full p-3 border border-gray-300 focus:border-[#c0a483] focus:outline-none"
                />
              </div>
              
              <div className="mb-6 text-sm text-gray-600">
                <p>Your personal data will be used to support your experience throughout this website, to manage access to your account, and for other purposes described in our <a href="#" className="text-[#c0a483] hover:underline">privacy policy</a>.</p>
              </div>
              
              <button
                type="submit"
                className="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 uppercase font-medium transition-colors"
              >
                REGISTER
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAccountPage; 