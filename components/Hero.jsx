import '@components/FeatureCard';
import FeatureCard from '@components/FeatureCard';


export default function Hero({ onCreateProfile }) {
    return (
        <section className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50 opacity-50" />

            <div className="max-w-7xl mx-auto relative">
                <div className="text-center animate-slide-up">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-6">
                        Create Your Professional Profile in Minutes
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                        Generate a beautiful, personalized profile page that showcases your professional journey.
                        Share your unique URL with potential employers, clients, or your network.
                    </p>
                    <button
                        onClick={onCreateProfile}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                    >
                        Create Your Profile
                    </button>
                </div>

                {/* Feature Cards */}
                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <FeatureCard
                        title="Easy to Use"
                        description="Fill out a simple form and get your professional profile in minutes."
                        icon="✨"
                    />
                    <FeatureCard
                        title="Customizable"
                        description="Choose from various themes and layouts to match your style."
                        icon="🎨"
                    />
                    <FeatureCard
                        title="Share Anywhere"
                        description="Get a unique URL to share your profile across platforms."
                        icon="🔗"
                    />
                </div>
            </div>
        </section>
    );
}
