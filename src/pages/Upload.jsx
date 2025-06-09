/* src/pages/Upload.jsx */
import React from 'react';
import {Link} from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FileUploader from '../components/FileUploader';
import {ArrowLeftIcon} from '@heroicons/react/24/solid';   // ← Heroicons

const Upload = () => (
    <div className = "flex flex-col min-h-screen">
        <Header/>

        <main className = "flex-1 bg-gray-50 py-12">
            <div className = "max-w-2xl mx-auto px-4">
                {/* === 新增返回按钮 === */}
                <Link
                    to = "/"
                    className = "inline-flex items-center gap-1
                            rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700
                            shadow hover:bg-blue-100 active:bg-blue-200
                            transition focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                    <ArrowLeftIcon className = "h-5 w-5"/>
                    Back
                </Link>

                <h1 className = "text-2xl font-bold text-gray-800 mb-6 text-center">
                    Upload file
                </h1>

                <FileUploader/>
            </div>
        </main>

        <Footer/>
    </div>
);

export default Upload;
