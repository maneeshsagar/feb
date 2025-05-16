// /app/core/login/page.jsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Cookies from 'js-cookie';
import { signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';
import Header from '@/components/Header'; //
import Footer from '@/components/Footer'; //
import { Mail, Lock, LogIn, Loader2, AlertCircle } from 'lucide-react';

export default function LoginPage() {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [dottedTransform, setDottedTransform] = useState({});
    const router = useRouter();


    // Check authentication state and redirect if not logged in.
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                router.push("/core/dashboard");
            } 
        });
        return () => unsubscribe();
    }, [router]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (!credentials.email || !credentials.password) {
            setError('Please enter both email and password');
            setIsLoading(false);
            return;
        }

        try {
            // Call the external API to login and receive a custom token
            const response = await axios.post('https://910fkqei24.execute-api.ap-south-1.amazonaws.com/api/auth/login', credentials, {
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.status === 200 && response.data.custom_token) {
                const { custom_token } = response.data;
                // Sign in with Firebase using the custom token
                const userCredential = await signInWithCustomToken(auth, custom_token);
                const idToken = await userCredential.user.getIdToken();
                const refreshToken = userCredential.user.refreshToken;

                Cookies.set('idToken', idToken, { expires: 1, secure: true, sameSite: 'strict' });
                Cookies.set('refreshToken', refreshToken, { expires: 7, secure: true, sameSite: 'strict' });
                // Redirect to the dashboard
                router.push('/core/dashboard');
            } else {
                setError('Login failed: Invalid response from server.');
            }
        } catch (err) {
            console.error('Login error:', err);
            if (err.response && err.response.data) {
                setError(err.response.data.message || 'Login failed: Invalid credentials.');
            } else {
                setError('Network error, please try again later.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Update dotted background transform on cursor movement
    const handleMouseMove = (e) => {
        const { clientX } = e;
        const xOffset = ((clientX / window.innerWidth) - 0.5) * 20;
        const yOffset = Math.sin(clientX / 50) * 20;
        setDottedTransform({ transform: `translate(${xOffset}px, ${yOffset}px)` });
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50"> {/* Added bg-gray-50 here */}
            <Header /> {/* Header remains fixed at the top */}

            {/* Main content area with padding-top to account for fixed header */}
            {/* Adjusted flex properties for centering below header */}
            <main className="flex-grow flex flex-col items-center justify-center px-4 pt-20 pb-8 sm:pt-24"> {/* Increased pt, added pb, removed items-center/justify-center */}

                 {/* Login Card Container */}
                <div className="w-full max-w-4xl bg-white rounded-xl shadow-xl overflow-hidden md:flex">
            
                    {/* Left Side (Illustration/Branding) */}
                    <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-indigo-500 to-purple-600 p-12 text-white flex flex-col justify-center items-center">
                         <LogIn size={80} className="mb-6 opacity-80" />
                         <h2 className="text-3xl font-bold mb-4 text-center">Welcome Back!</h2>
                         <p className="text-center text-indigo-100">
                            Log in to access your personalized profile dashboard.
                         </p>
                    </div>

                    {/* Right Side (Login Form) */}
                    <div className="w-full md:w-1/2 p-8 sm:p-12">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">
                            Login to ProfileGen
                        </h1>

                        {/* Error Display */}
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
                                <AlertCircle size={20} className="mr-2"/>
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                             {/* Email Input */}
                             <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <div className="relative">
                                     <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                         <Mail className="h-5 w-5 text-gray-400" />
                                     </span>
                                    <input
                                        type="email" id="email" name="email"
                                        value={credentials.email} onChange={handleChange}
                                        placeholder="you@example.com" disabled={isLoading}
                                        className={`w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition ${isLoading ? 'bg-gray-100' : 'border-gray-300'}`}
                                        required
                                    />
                                </div>
                            </div>

                             {/* Password Input */}
                             <div>
                                 <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <div className="relative">
                                     <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                         <Lock className="h-5 w-5 text-gray-400" />
                                     </span>
                                    <input
                                        type="password" id="password" name="password"
                                        value={credentials.password} onChange={handleChange}
                                        placeholder="••••••••" disabled={isLoading}
                                        className={`w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition ${isLoading ? 'bg-gray-100' : 'border-gray-300'}`}
                                        required
                                    />
                                </div>
                                 <div className="text-right mt-2">
                                    <Link href="/core/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-500 hover:underline">
                                        Forgot Password?
                                    </Link>
                                </div>
                            </div>

                             {/* Submit Button */}
                            <button type="submit" disabled={isLoading} className={/* ... button classes ... */ `w-full flex justify-center items-center text-white py-3 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${ isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 shadow-md'}`}>
                                 {isLoading ? ( <><Loader2 className="animate-spin mr-2" size={20} /> Logging in...</> ) : ( 'Login' )}
                            </button>
                        </form>

                         {/* Link to Sign Up */}
                        <p className="mt-6 text-center text-sm text-gray-600">
                             Don't have an account?{' '}
                            <Link href="/core/signup" className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline"> Sign up </Link>
                        </p>
                    </div> {/* End Right Side */}
                </div> {/* End Login Card Container */}
            </main> {/* End Main Content Area */}

            <Footer /> {/* Footer remains */}
        </div> /* End Root Container */
    );
}