import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import QueryFileUploader from '../components/QueryFileUploader';
import {Link} from 'react-router-dom';
import {ArrowLeftIcon} from '@heroicons/react/24/solid';

const SearchByFile = () => (
    <div className = "flex flex-col min-h-screen">
        <Header/>

        <main className = "flex-1 bg-gray-50 py-12">
            <div className = "max-w-xl mx-auto px-4">
                {/* 返回主页 */}
                <Link
                    to = "/"
                    className = "inline-flex items-center gap-1 w-fit mb-2
                            rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700
                            shadow hover:bg-blue-100 active:bg-blue-200
                            transition focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                    <ArrowLeftIcon className = "h-5 w-5"/>
                    返回主页
                </Link>

                <h1 className = "text-2xl font-bold text-gray-800 mb-6 text-center">
                    上传文件进行相似标签搜索
                </h1>

                <QueryFileUploader/>
            </div>
        </main>

        <Footer/>
    </div>
);

export default SearchByFile;
