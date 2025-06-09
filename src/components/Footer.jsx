import React from 'react';

const Footer = () => (
    <footer className = "bg-gray-100 text-gray-600 text-sm">
        <div className = "max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between gap-2">
            <p>&copy; {new Date().getFullYear()} Monash Birdy Buddies · BirdTag</p>
            <p>
                ContactUs<a href = "mailto:mbb@monash.com"
                            className = "text-blue-600 hover:underline">mbb@monash.com</a>
            </p>
        </div>
    </footer>
);

export default Footer;
