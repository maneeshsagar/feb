// app/components/ProfileForm.js
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, CheckCircle, Eye, EyeOff } from 'lucide-react';

export default function ProfileForm() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        profession: ''
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });
    const [passwordStrength, setPasswordStrength] = useState(0);

    const validateField = (name, value) => {
        switch (name) {
            case 'username':
                if (!value.trim()) return 'Username is required';
                if (value.length < 3) return 'Username must be at least 3 characters';
                if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
                    return 'Username can only contain letters, numbers, underscores, and hyphens';
                }
                break;
            case 'email':
                if (!value) return 'Email is required';
                if (!/\S+@\S+\.\S+/.test(value)) return 'Please enter a valid email address';
                break;
            case 'password':
                if (!value) return 'Password is required';
                if (value.length < 8) return 'Password must be at least 8 characters';
                if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
                    return 'Password must contain uppercase, lowercase, and number';
                }
                break;
            case 'confirmPassword':
                if (value !== formData.password) return 'Passwords do not match';
                break;
            case 'fullName':
                if (!value.trim()) return 'Full name is required';
                if (value.trim().length < 2) return 'Full name is too short';
                break;
            case 'profession':
                if (!value.trim()) return 'Profession is required';
                break;
            default:
                return '';
        }
        return '';
    };

    const checkPasswordStrength = (password) => {
        let score = 0;
        if (password.length >= 8) score += 20;
        if (password.length >= 12) score += 20;
        if (/[A-Z]/.test(password)) score += 20;
        if (/[a-z]/.test(password)) score += 20;
        if (/[0-9]/.test(password)) score += 20;
        return score;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (name === 'password') {
            setPasswordStrength(checkPasswordStrength(value));
        }

        const error = validateField(name, value);
        setErrors(prev => ({
            ...prev,
            [name]: error
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        Object.keys(formData).forEach(key => {
            const error = validateField(key, formData[key]);
            if (error) newErrors[key] = error;
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitStatus({ type: '', message: '' });

        if (!validateForm()) {
            setSubmitStatus({
                type: 'error',
                message: 'Please fix the errors in the form'
            });
            return;
        }

        setLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            const profileId = Math.random().toString(36).substring(2, 15);
            setSubmitStatus({
                type: 'success',
                message: 'Profile created successfully! Redirecting...'
            });

            setTimeout(() => {
                router.push(`/${profileId}`);
            }, 1500);
        } catch (error) {
            setSubmitStatus({
                type: 'error',
                message: error.message || 'An error occurred while creating your profile'
            });
        } finally {
            setLoading(false);
        }
    };

    return (

        <section id="profile-form" className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
            <div className="max-w-md mx-auto">
                <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-2xl shadow-xl animate-slide-up">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            Create Account
                        </h2>
                        <p className="mt-2 text-gray-600">Join our professional community</p>
                    </div>

                    {submitStatus.message && (
                        <div
                            className={`p-4 rounded-lg flex items-center ${submitStatus.type === 'error'
                                    ? 'bg-red-50 text-red-700'
                                    : 'bg-green-50 text-green-700'
                                }`}
                        >
                            {submitStatus.type === 'error' ? (
                                <AlertTriangle className="mr-2" size={20} />
                            ) : (
                                <CheckCircle className="mr-2" size={20} />
                            )}
                            {submitStatus.message}
                        </div>
                    )}

                    {/* Form Fields */}
                    <div className="space-y-4">
                        {/* Username Field */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 rounded-lg border ${errors.username ? 'border-red-500' : 'border-gray-300'
                                    } focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200`}
                                placeholder="johndoe123"
                            />
                            {errors.username && (
                                <p className="text-red-500 text-sm mt-1 flex items-center">
                                    <AlertTriangle size={16} className="mr-1" />
                                    {errors.username}
                                </p>
                            )}
                        </div>

                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'
                                    } focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200`}
                                placeholder="john@example.com"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1 flex items-center">
                                    <AlertTriangle size={16} className="mr-1" />
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300'
                                        } focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200`}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {passwordStrength > 0 && (
                                <div className="mt-2">
                                    <div className="h-2 w-full bg-gray-200 rounded-full">
                                        <div
                                            className={`h-full rounded-full transition-all duration-300 ${passwordStrength <= 40 ? 'bg-red-500' :
                                                    passwordStrength <= 80 ? 'bg-yellow-500' :
                                                        'bg-green-500'
                                                }`}
                                            style={{ width: `${passwordStrength}%` }}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-600 mt-1">
                                        Password strength: {
                                            passwordStrength <= 40 ? 'Weak' :
                                                passwordStrength <= 80 ? 'Medium' :
                                                    'Strong'
                                        }
                                    </p>
                                </div>
                            )}
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1 flex items-center">
                                    <AlertTriangle size={16} className="mr-1" />
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 rounded-lg border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                    } focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200`}
                                placeholder="••••••••"
                            />
                            {errors.confirmPassword && (
                                <p className="text-red-500 text-sm mt-1 flex items-center">
                                    <AlertTriangle size={16} className="mr-1" />
                                    {errors.confirmPassword}
                                </p>
                            )}
                        </div>

                        {/* Full Name Field */}
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 rounded-lg border ${errors.fullName ? 'border-red-500' : 'border-gray-300'
                                    } focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200`}
                                placeholder="John Doe"
                            />
                            {errors.fullName && (
                                <p className="text-red-500 text-sm mt-1 flex items-center">
                                    <AlertTriangle size={16} className="mr-1" />
                                    {errors.fullName}
                                </p>
                            )}
                        </div>

                        {/* Profession Field */}
                        <div>
                            <label htmlFor="profession" className="block text-sm font-medium text-gray-700 mb-1">
                                Profession
                            </label>
                            <input
                                type="text"
                                id="profession"
                                name="profession"
                                value={formData.profession}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 rounded-lg border ${errors.profession ? 'border-red-500' : 'border-gray-300'
                                    } focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200`}
                                placeholder="Software Engineer"
                            />
                            {errors.profession && (
                                <p className="text-red-500 text-sm mt-1 flex items-center">
                                    <AlertTriangle size={16} className="mr-1" />
                                    {errors.profession}
                                </p>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                Creating Account...
                            </div>
                        ) : (
                            'Create Account'
                        )}
                    </button>
                </form>
            </div>
        </section>
    );
}