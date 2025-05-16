"use client"
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useRouter } from 'next/navigation'

export default function Header({ onCreateProfile }) { // Keep onCreateProfile prop if needed elsewhere, otherwise remove

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const router = useRouter(); // Correctly initialize useRouter

    return (
        <header className="fixed top-0 left-0 right-0 glass-effect z-50">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <a href="/" className="cursor-pointer text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            ProfileGen
                        </a>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-4"> {/* Use space-x-4 or adjust as needed */}
                        <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
                            Features
                        </a>
                        <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
                            Pricing
                        </a>
                        {/* Signup Button */}
                        <button
                            onClick={() => router.push('/core/signup')} // Navigate to signup
                            className="text-indigo-600 border border-indigo-600 px-5 py-2 rounded-full hover:bg-indigo-50 transition-all duration-200"
                        >
                            Sign Up
                        </button>
                        {/* Login Button */}
                        <button
                            onClick={() => router.push('/core/login')}
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-full hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                        >
                            Login
                        </button>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 rounded-md text-gray-600 hover:text-gray-900"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Menu (Dropdown) */}
                {isMenuOpen && (
                    <div className="md:hidden animate-fade-in">
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            <a
                                href="#features"
                                onClick={() => setIsMenuOpen(false)} // Close menu on click
                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                            >
                                Features
                            </a>
                            <a
                                href="#pricing"
                                onClick={() => setIsMenuOpen(false)} // Close menu on click
                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                            >
                                Pricing
                            </a>
                            {/* Signup Button (Mobile) */}
                            <button
                                onClick={() => { router.push('/core/signup'); setIsMenuOpen(false); }}
                                className="w-full mt-2 text-center text-indigo-600 border border-indigo-600 px-6 py-2 rounded-full hover:bg-indigo-50"
                            >
                                Sign Up
                            </button>
                            {/* Login Button (Mobile) */}
                            <button
                                onClick={() => { router.push('/core/login'); setIsMenuOpen(false); }}
                                className="w-full mt-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-full"
                            >
                                Login
                            </button>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}