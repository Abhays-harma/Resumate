import React from 'react';
import { Youtube, Linkedin, Instagram } from 'lucide-react';

const Footer = () => {
    const navigationItems = {
        'AI Writer': [
            'Writer',
            'Editor',
            { name: 'Cover Letter', badge: 'New' },
            'Summary',
            'Resignation Letter'
        ],
        'Examples': [
            'Resumes',
            'Cover Letters',
            'Resignation Letters'
        ],
        'Resources': [
            'Pricing',
            'Linkedin Extension',
            { name: 'White Label', badge: 'New' }
        ],
        'Content': [
            'Rezi Blog',
            'Case Studies',
            'User Reviews',
            'User Guides'
        ],
        'Company': [
            'About us',
            'Authors',
            'Editorial Process',
            'Contact Rezi'
        ]
    };

    return (
        <footer className="w-full mx-auto px-4 py-8 font-sans">
            {/* Top Section */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2">Rezi</h2>
                <p className="text-gray-600 mb-4">
                    Join over 2,934,574 job seekers<br />
                    helped since September 2019
                </p>
                <button className="text-blue-500 hover:text-blue-600 font-medium">
                    Create Free Account
                </button>
            </div>

            {/* Navigation Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-4">
                {Object.entries(navigationItems).map(([category, items]) => (
                    <div key={category}>
                        <h3 className="text-gray-500 font-medium mb-4">{category}</h3>
                        <ul className="space-y-3">
                            {items.map((item, index) => (
                                <li key={index}>
                                    <a href="#" className="flex items-center text-gray-600 hover:text-gray-900">
                                        {typeof item === 'string' ? item : (
                                            <>
                                                {item.name}
                                                {item.badge && (
                                                    <span className="ml-2 px-2 py-0.5 text-xs text-green-700 bg-green-100 rounded-full">
                                                        {item.badge}
                                                    </span>
                                                )}
                                            </>
                                        )}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            {/* Bottom Section */}
            <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-200">
                <div className="flex items-center space-x-6 mb-4 md:mb-0">
                    <span className="text-gray-500">© 2024 Rezi</span>
                    <a href="#" className="text-gray-500 hover:text-gray-700">Terms & Privacy</a>
                    <a href="#" className="text-gray-500 hover:text-gray-700">Product Changelog</a>
                    <a href="#" className="text-gray-500 hover:text-gray-700">Resumatic</a>
                    <a href="#" className="text-gray-500 hover:text-gray-700">Resumai</a>
                </div>

                <div className="flex items-center space-x-6">
                    <a href="#" className="text-gray-500 hover:text-gray-700">
                        <Linkedin className="w-5 h-5" />
                    </a>
                    <a href="#" className="text-gray-500 hover:text-gray-700">
                        <Instagram className="w-5 h-5" />
                    </a>
                    <a href="#" className="text-gray-500 hover:text-gray-700">
                        <Youtube />
                    </a>
                    <a href="#" className="text-gray-500 hover:text-gray-700">
                        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                            <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 8.2 11.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.6-4-1.6-.5-1.4-1.2-1.8-1.2-1.8-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 1.7 2.6 1.2 3.2.9.1-.7.4-1.2.7-1.5-2.6-.3-5.4-1.3-5.4-5.9 0-1.3.5-2.4 1.1-3.2-.1-.3-.5-1.5.1-3.2 0 0 .9-.3 3 1.1a10.4 10.4 0 0 1 5.5 0c2.1-1.4 3-1.1 3-1.1.6 1.7.2 2.9.1 3.2.7.8 1.1 1.9 1.1 3.2 0 4.6-2.8 5.6-5.4 5.9.4.3.7 1 .7 2v3c0 .3.2.7.8.6A12 12 0 0 0 24 12 12 12 0 0 0 12 0z" />
                        </svg>
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
