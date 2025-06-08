import React from 'react';
import {Link} from 'react-router-dom';
import LogoutButton from './LogoutButton';


const Header = () => {

    return (
        <header className = "bg-blue-600 text-white shadow-md">
            <div className = "max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                {/* Logo / Brand */}
                <Link to = "/" className = "text-xl font-bold tracking-wide">
                    BirdTag🐦
                </Link>

                {/* Right-side */}
                <div className = "flex items-center gap-4">
                    <LogoutButton/>
                </div>
            </div>
        </header>
    );
};

export default Header;
