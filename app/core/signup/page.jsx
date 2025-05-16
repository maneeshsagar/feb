// /app/core/signup/page.jsx
'use client';
import { useState, useEffect } from 'react'; // Added useEffect
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Cookies from 'js-cookie';
import { signInWithCustomToken, onAuthStateChanged } from 'firebase/auth'; // Added onAuthStateChanged
import { auth } from '@/lib/firebase';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AlertTriangle, CheckCircle, Eye, EyeOff, Loader2 } from 'lucide-react'; // Added Loader2

export default function SignupPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        fullName: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });
    const [passwordStrength, setPasswordStrength] = useState(0);

    // Redirect if already logged in
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                router.push("/core/dashboard");
            }
        });
        return () => unsubscribe();
    }, [router]);

    // --- Input Validation Logic (Keep as before) ---
    const validateField = (name, value) => {
         switch (name) {
            case 'username':
                if (!value.trim()) return 'Username is required';
                if (value.length < 3) return 'Username must be at least 3 characters';
                if (!/^[a-zA-Z0-9_-]+$/.test(value)) return 'Username can only contain letters, numbers, underscores, and hyphens';
                break;
            case 'email':
                if (!value) return 'Email is required';
                if (!/\S+@\S+\.\S+/.test(value)) return 'Please enter a valid email address';
                break;
            case 'password':
                if (!value) return 'Password is required';
                if (value.length < 8) return 'Password must be at least 8 characters';
                break;
            case 'confirmPassword':
                if (value !== formData.password) return 'Passwords do not match';
                break;
            case 'fullName':
                 if (!value.trim()) return 'Full name is required';
                 break;
            default: return '';
        }
        return '';
    };
    const checkPasswordStrength = (password) => {
         let score = 0;
         if (password.length >= 8) score += 25;
         if (password.length >= 12) score += 25;
         if (/[A-Z]/.test(password)) score += 25;
         if (/[a-z]/.test(password)) score += 25;
         if (/[0-9]/.test(password)) score += 25;
         if (/[^A-Za-z0-9]/.test(password)) score += 25;
         return Math.min(score, 100);
     };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
         if (name === 'password') {
            setPasswordStrength(checkPasswordStrength(value));
        }
        const error = validateField(name, value);
        setErrors(prev => ({ ...prev, [name]: error }));
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
    // --- End Validation Logic ---

    // **** MODIFIED handleSubmit ****
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitStatus({ type: '', message: '' });

        if (!validateForm()) {
            setSubmitStatus({ type: 'error', message: 'Please fix the errors.' });
            return;
        }

        setLoading(true);
        try {
            // 1. --- Call Signup API ---
            const signupPayload = {
                username: formData.username,
                email: formData.email,
                password: formData.password, // Send password for creation
                name: formData.fullName
            };
            // console.log("Calling Signup API..."); // Debug log
            const signupResponse = await axios.post('https://910fkqei24.execute-api.ap-south-1.amazonaws.com/api/auth/signup', signupPayload, {
                headers: { 'Content-Type': 'application/json' },
            });

            // Check if signup was successful (adjust status codes if needed)
            if (signupResponse.status === 200 || signupResponse.status === 201) {
                setSubmitStatus({ type: 'info', message: 'Signup successful! Logging in...' });

                // 2. --- Call Login API ---
                const loginPayload = {
                    email: formData.email,
                    password: formData.password, // Use the same password to login
                };
                // console.log("Calling Login API..."); // Debug log
                const loginResponse = await axios.post('https://910fkqei24.execute-api.ap-south-1.amazonaws.com/api/auth/login', loginPayload, { //
                    headers: { 'Content-Type': 'application/json' },
                });

                // Check if login was successful and returned a custom token
                if (loginResponse.status === 200 && loginResponse.data.custom_token) {
                    const { custom_token } = loginResponse.data;

                    // 3. --- Sign in with Firebase using the token from LOGIN API ---
                    // console.log("Signing in with Firebase token..."); // Debug log
                    const userCredential = await signInWithCustomToken(auth, custom_token); //
                    const idToken = await userCredential.user.getIdToken();
                    const refreshToken = userCredential.user.refreshToken;

                    Cookies.set('idToken', idToken, { expires: 1, secure: true, sameSite: 'strict' }); //
                    Cookies.set('refreshToken', refreshToken, { expires: 7, secure: true, sameSite: 'strict' }); //

                    // 4. --- Redirect to Dashboard ---
                    // console.log("Redirecting to dashboard..."); // Debug log
                    router.push('/core/dashboard'); //
                } else {
                    // Handle login API failure after successful signup
                    console.error("Login API failed after signup:", loginResponse.status, loginResponse.data); // Debug log
                    setSubmitStatus({ type: 'error', message: loginResponse.data?.message || 'Signup successful, but auto-login failed. Please log in manually.' });
                    setTimeout(() => router.push('/core/login'), 3000); // Redirect to login
                }

            } else {
                // Handle signup API failure
                 console.error("Signup API failed:", signupResponse.status, signupResponse.data); // Debug log
                setSubmitStatus({ type: 'error', message: signupResponse.data?.message || 'Signup failed.' });
            }
        } catch (err) {
            console.error('Signup/Login process error:', err.response || err); // Log response if available
            const errorMessage = err.response?.data?.message || 'An error occurred during the process.';
            setSubmitStatus({ type: 'error', message: errorMessage });
        } finally {
            setLoading(false);
        }
    };
     // **** END MODIFIED handleSubmit ****


    // --- JSX Structure (Including the submit button) ---
    return (
         <>
            <Header />
            <div className="min-h-screen flex items-center justify-center p-4 pt-24 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
                 <form onSubmit={handleSubmit} className="glass-effect p-8 rounded-2xl shadow-xl w-full max-w-md animate-slide-up">
                     <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
                         Create Account
                     </h2>

                     {/* Status Message Display */}
                     {submitStatus.message && (
                        <div className={`p-4 rounded-lg flex items-center mb-4 ${
                            submitStatus.type === 'error' ? 'bg-red-100 text-red-700' :
                            submitStatus.type === 'success' ? 'bg-green-100 text-green-700' :
                            'bg-blue-100 text-blue-700' // For info messages
                        }`}>
                            {submitStatus.type === 'error' ? <AlertTriangle className="mr-2" size={20} /> :
                             submitStatus.type === 'success' ? <CheckCircle className="mr-2" size={20} /> :
                             <AlertTriangle className="mr-2" size={20} /> /* Or an info icon */
                            }
                            {submitStatus.message}
                        </div>
                    )}

                     {/* Form Fields */}
                     <div className="space-y-4">
                         {/* Username */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                            <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} className={`w-full input-style ${errors.username ? 'border-red-500' : 'border-gray-300'}`} placeholder="Choose a username" />
                            {errors.username && <p className="text-red-500 text-sm mt-1 flex items-center"><AlertTriangle size={16} className="mr-1" />{errors.username}</p>}
                        </div>
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className={`w-full input-style ${errors.email ? 'border-red-500' : 'border-gray-300'}`} placeholder="your@email.com" />
                            {errors.email && <p className="text-red-500 text-sm mt-1 flex items-center"><AlertTriangle size={16} className="mr-1" />{errors.email}</p>}
                        </div>
                         {/* Full Name */}
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} className={`w-full input-style ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`} placeholder="Your Full Name" />
                            {errors.fullName && <p className="text-red-500 text-sm mt-1 flex items-center"><AlertTriangle size={16} className="mr-1" />{errors.fullName}</p>}
                        </div>
                        {/* Password */}
                        <div>
                             <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                             <div className="relative">
                                 <input type={showPassword ? 'text' : 'password'} id="password" name="password" value={formData.password} onChange={handleChange} className={`w-full input-style pr-10 ${errors.password ? 'border-red-500' : 'border-gray-300'}`} placeholder="Create a password" />
                                 <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                     {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                 </button>
                             </div>
                             {passwordStrength > 0 && (
                                <div className="mt-2">
                                    <div className="h-2 w-full bg-gray-200 rounded-full">
                                        <div className={`h-full rounded-full transition-all duration-300 ${passwordStrength < 50 ? 'bg-red-500' : passwordStrength < 80 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${passwordStrength}%` }} />
                                    </div>
                                </div>
                             )}
                             {errors.password && <p className="text-red-500 text-sm mt-1 flex items-center"><AlertTriangle size={16} className="mr-1" />{errors.password}</p>}
                        </div>
                         {/* Confirm Password */}
                         <div>
                             <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                             <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className={`w-full input-style ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`} placeholder="Re-enter password" />
                             {errors.confirmPassword && <p className="text-red-500 text-sm mt-1 flex items-center"><AlertTriangle size={16} className="mr-1" />{errors.confirmPassword}</p>}
                         </div>
                     </div>

                     {/* Submit Button is here */}
                     <button
                         type="submit"
                         disabled={loading}
                         className={`w-full mt-6 flex items-center justify-center text-white p-3 rounded-full transition-colors duration-200 ${
                             loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90'
                         }`}
                     >
                         {loading ? (
                             <>
                                 <Loader2 className="animate-spin mr-2" size={20} />
                                 Processing...
                             </>
                         ) : (
                             'Sign Up & Login' // Updated text to reflect action
                         )}
                     </button>

                      <p className="mt-4 text-center text-sm text-gray-600">
                          Already have an account?{' '}
                          <Link href="/core/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                              Log in
                          </Link>
                      </p>
                 </form>
            </div>
            <Footer />
             {/* Helper CSS */}
             <style jsx>{`
                 .input-style { /* ... */ }
                 .btn-primary { /* ... */ }
             `}</style>
         </>
    );
}