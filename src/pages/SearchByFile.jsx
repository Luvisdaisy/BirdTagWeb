import React, {useState} from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import QueryFileUploader from '../components/QueryFileUploader';
import MediaCard from '../components/MediaCard';
import {Link} from 'react-router-dom';
import {ArrowLeftIcon} from '@heroicons/react/24/solid';
import {deleteApi, updateTagsApi} from "../api/media";

const SearchByFile = () => {
    const [results, setResults] = useState([]);

    return (
        <div className = "flex flex-col min-h-screen">
            <Header/>
            <main className = "flex-1 bg-gray-50 py-12">
                <div className = "max-w-xl mx-auto px-4">
                    <Link to = "/" className = "inline-flex items-center gap-1 w-fit mb-2
                rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700
                shadow hover:bg-blue-100 active:bg-blue-200 transition">
                        <ArrowLeftIcon className = "h-5 w-5"/> 返回主页
                    </Link>
                    <h1 className = "text-2xl font-bold text-center mb-6">
                        上传文件进行相似标签搜索
                    </h1>

                    {/* uploader 把结果回调上来 */}
                    <QueryFileUploader onDone = {(arr) => setResults(arr)}/>
                </div>

                {results.length > 0 &&
                    <div className = "max-w-4xl mx-auto grid gap-4 sm:grid-cols-2 md:grid-cols-3 mt-10">
                        {results.map(m => (
                            <MediaCard
                                key = {m.id}
                                media = {m}
                                onUpdateTags = {(tags) => updateTagsApi(m.id, tags)}
                                onDelete = {() => deleteApi(m.id)}
                            />
                        ))}
                    </div>}
            </main>
            <Footer/>
        </div>
    );
};
export default SearchByFile;
