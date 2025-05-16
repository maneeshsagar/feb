'use client';
import { useState,useEffect } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import ProfileForm from '@components/ProfileForm';
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';


export default function Home() {
    const [showForm, setShowForm] = useState(false);
    const router = useRouter();
  
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                router.push("/core/dashboard");
            } 
        });
        return () => unsubscribe();
    }, [router]);

    const scrollToForm = () => {
      setShowForm(true);
      setTimeout(() => {
        document.getElementById('profile-form')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    };
  
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Header onCreateProfile={scrollToForm} />
        {!showForm && <Hero onCreateProfile={scrollToForm} />}
        {showForm && <ProfileForm />}
        <Footer />
      </main>
    );
  }