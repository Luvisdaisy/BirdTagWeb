import React, {useState} from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import QueryFileUploader from '../components/QueryFileUploader';
import ErrorModal from '../components/ErrorModal';
import {useToast} from '../contexts/ToastContext';
import {Link} from 'react-router-dom';
import {ArrowLeftIcon} from '@heroicons/react/24/solid';
import OriginalFetcher from "../components/ImageManagementTool";

const API_BASE = import.meta.env.VITE_API_BASE

export default function SearchByFile() {
    const [tags, setTags] = useState([]);   // 检测出的标签
    const [links, setLinks] = useState([]); // 匹配文件 URL
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const {showToast} = useToast();

    /** 上传完成回调：{ base64, type } */
    const handleUpload = async ({base64, type}) => {
        setLoading(true);
        try {
            const res = await axios.post(`${API_BASE}/query-by-file`, {
                base64File: base64.split(',')[1],          // 去掉 data:mime;base64,
                fileType: type.startsWith('image')
                    ? 'image'
                    : type.startsWith('audio')
                        ? 'audio'
                        : 'video',
            });

            setTags(Object.keys(res.data.detected_tags || {}));
            setLinks(res.data.links || []);
            showToast('Query successful', 'success');
        } catch (e) {
            setError(e.message || 'Query failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className = "flex flex-col min-h-screen">
            <Header/>
            <main className = "flex-1 bg-gray-50 py-12">
                <div className = "max-w-2xl mx-auto px-4 ">
                    {/* 返回按钮 */}
                    <Link
                        to = "/"
                        className = "inline-flex items-center gap-1 w-fit mb-4 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 shadow hover:bg-blue-100 transition"
                    >
                        <ArrowLeftIcon className = "h-5 w-5"/>
                        Back
                    </Link>

                    <h1 className = "text-2xl font-bold text-center mb-6">
                        Upload files • Search the same tags with medias
                    </h1>

                    {/* 上传：单文件 ≤20 MB，可拖拽 */}
                    <QueryFileUploader maxSize = {20} multiple = {false} onDone = {handleUpload}/>
                </div>

                {/* 结果展示 */}
                {loading && (
                    <p className = "text-center mt-6 text-gray-500">Analysing…</p>
                )}

                {!loading && (tags.length > 0 || links.length > 0) && (
                    <div className = "max-w-3xl mx-auto mt-8 px-4 text-center">
                        {tags.length > 0 && (
                            <div className = "mb-4">
                                <h2 className = "font-semibold mb-1">Detected tags:</h2>
                                <p className = "text-blue-700 flex justify-center flex-wrap gap-2">
                                    {tags.map((t) => (
                                        <span
                                            key = {t}
                                            className = "bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm"
                                        >
                      {t}
                    </span>
                                    ))}
                                </p>
                            </div>
                        )}

                        {links.length > 0 && (
                            <div>
                                <h2 className = "font-semibold mb-1">Match files:</h2>
                                {/* 限高滚动容器 */}
                                <div className = "max-h-80 overflow-auto border rounded p-3 bg-white">
                                    <ul className = "list-disc list-inside space-y-2 text-blue-700">
                                        {links.map((url) => (
                                            <li key = {url} className = "break-all">
                                                <a
                                                    href = {url}
                                                    target = "_blank"
                                                    rel = "noopener noreferrer"
                                                    className = "hover:underline"
                                                >
                                                    {url}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>
            <Footer/>
            <ErrorModal message = {error} onClose = {() => setError('')}/>
            <OriginalFetcher/>
        </div>
    );
}
