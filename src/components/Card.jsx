import React from 'react';
import {Link} from 'react-router-dom';

const Card = ({to, icon: Icon, title, desc, bg}) => (
    <Link
        to = {to}
        className = {`relative rounded-xl border bg-white ${bg} p-4 shadow-sm transition 
                hover:shadow-lg hover:-translate-y-1 focus:outline-none flex flex-col`}
    >
        {/* 角标图标 */}
        <div className = "absolute -top-3 -left-3">
            <div className = "h-10 w-10 rounded-xl bg-white shadow flex items-center justify-center">
                <Icon className = "h-5 w-5 text-blue-600"/>
            </div>
        </div>

        <div className = "flex-1 mt-6">
            <h3 className = "text-lg font-semibold text-gray-800 mb-1">{title}</h3>
            <p className = "text-sm text-gray-500 leading-snug">{desc}</p>
        </div>
    </Link>
);

export default Card;
