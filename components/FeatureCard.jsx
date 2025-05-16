export default function FeatureCard({ title, description, icon }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 transform hover:-translate-y-2 transition-all duration-200">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}