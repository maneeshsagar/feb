// /app/core/forgot-password/page.jsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {auth, sendPasswordResetEmail } from "@/lib/firebase"; //
import Link from 'next/link';
import Header from '@/components/Header'; // [cite: feb/components/Header.jsx]
import Footer from '@/components/Footer'; // [cite: feb/components/Footer.jsx]
import { Mail, Send, Loader2, AlertCircle, CheckCircle } from 'lucide-react'; // Added icons

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' }); // 'success', 'error', ''
    const router = useRouter();

    const handleChange = (e) => {
        setEmail(e.target.value);
        setStatus({ type: '', message: '' }); // Clear status on change
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: '', message: '' });

        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            setStatus({ type: 'error', message: 'Please enter a valid email address.' });
            return;
        }

        setIsLoading(true);
        try {
            // Call Firebase function directly
            await sendPasswordResetEmail(auth, email); //

            // If the above doesn't throw an error, it's successful
            setStatus({ type: 'success', message: 'Password reset instructions sent. Please check your email (including spam folder).' });
            setEmail(''); // Clear the input field on success

        } catch (err) {
            console.error('Forgot password error:', err);
            let errorMessage = 'An error occurred. Please try again.';
            // Handle common Firebase errors
            if (err.code === 'auth/user-not-found') {
                errorMessage = 'No user found with this email address.';
            } else if (err.code === 'auth/invalid-email') {
                 errorMessage = 'Please enter a valid email address.';
            } else if (err.code === 'auth/too-many-requests'){
                 errorMessage = 'Too many requests. Please try again later.';
            }
            // Add more specific Firebase error checks if needed

            setStatus({ type: 'error', message: errorMessage });
        } finally {
            setIsLoading(false);
        }
    };
     // *** END UPDATED handleSubmit ***

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header /> {/* Header */}

            {/* Main content area */}
            <main className="flex-grow flex flex-col items-center justify-center px-4 pt-20 pb-8 sm:pt-24">

                {/* Forgot Password Card */}
                <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden p-8 sm:p-10">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 text-center">
                        Forgot Your Password?
                    </h1>
                    <p className="text-center text-gray-600 mb-6 text-sm">
                        No problem! Enter your email address below and we'll send you instructions to reset it.
                    </p>

                    {/* Status Message Display */}
                    {status.message && (
                        <div className={`p-4 rounded-md flex items-center mb-4 text-sm ${
                            status.type === 'error' ? 'bg-red-100 text-red-700' :
                            status.type === 'success' ? 'bg-green-100 text-green-700' :
                            'bg-blue-100 text-blue-700' // Default/info
                        }`}>
                            {status.type === 'error' ? <AlertCircle className="mr-2 flex-shrink-0" size={20} /> :
                             status.type === 'success' ? <CheckCircle className="mr-2 flex-shrink-0" size={20} /> :
                             null /* Or an info icon */
                            }
                            <span>{status.message}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email Input */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 sr-only"> {/* Screen reader only label */}
                                Email Address
                            </label>
                            <div className="relative">
                                 <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                     <Mail className="h-5 w-5 text-gray-400" />
                                 </span>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={email}
                                    onChange={handleChange}
                                    placeholder="Enter your email address"
                                    disabled={isLoading}
                                    className={`w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition ${isLoading ? 'bg-gray-100' : 'border-gray-300'}`}
                                    required
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full flex justify-center items-center text-white py-3 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                                isLoading
                                    ? 'bg-indigo-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 shadow-md'
                            }`}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin mr-2" size={20} />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <Send className="mr-2" size={18} />
                                    Send Reset Instructions
                                </>
                            )}
                        </button>
                    </form>

                    {/* Link back to Login */}
                    <p className="mt-6 text-center text-sm text-gray-600">
                        Remembered your password?{' '}
                        <Link href="/core/login" className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline">
                            Log in
                        </Link>
                    </p>
                </div> {/* End Card */}
            </main> {/* End Main */}

            <Footer /> {/* Footer */}
        </div> /* End Root */
    );
}