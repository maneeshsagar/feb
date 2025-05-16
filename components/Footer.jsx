export default function Footer() {
    return (
        <footer className="bg-gray-50 border-t border-gray-200">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                            Product
                        </h3>
                        <ul className="mt-4 space-y-4">
                            <li>
                                <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                                    Features
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                                    Pricing
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                            Company
                        </h3>
                        <ul className="mt-4 space-y-4">
                            <li>
                                <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                                    About
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                                    Contact
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 border-t border-gray-200 pt-8">
                    <p className="text-base text-gray-400 text-center">
                        © 2025 ProfileGen. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}