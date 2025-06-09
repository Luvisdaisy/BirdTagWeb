import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ErrorModal from '../components/ErrorModal';
import {useToast} from '../contexts/ToastContext';
import {Link} from 'react-router-dom';
import {ArrowLeftIcon} from '@heroicons/react/24/solid';
import TagPickerInline from '../components/TagPickerInline';
import OriginalFetcher from '../components/ImageManagementTool';

const API_BASE = import.meta.env.VITE_API_BASE;

export default function SearchTags() {
    const [allTags, setAllTags] = useState([]);
    const [current, setCurrent] = useState('');
    const [loading, setLoading] = useState(false);
    const [links, setLinks] = useState([]);
    const [error, setError] = useState('');
    const {showToast} = useToast();

    useEffect(() => {
        axios
            .get(`${API_BASE}/list-tags`)
            .then((r) => setAllTags(r.data.tags || []))
            .catch(() => setError('FAILED TO GET TAG'));
    }, []);

    const chooseTag = (tag) => {
        const next = tag === current ? '' : tag; // 再次点击取消
        setCurrent(next);
        query(next);
    };

    const query = async (tag) => {
        if (!tag) return setLinks([]);

        setLoading(true);
        try {
            const res = await axios.get(`${API_BASE}/query-by-tags`, {
                params: {tag},
            });
            const data = [...new Set(res.data.links)];
            setLinks(data);
            showToast(`Return ${data.length} files`, 'success');
        } catch (e) {
            setError(e.message || 'QUERY FAILED');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className = "flex flex-col min-h-screen">
            <Header/>

            <main className = "flex-1 bg-gray-50 py-12">
                <div className = "max-w-2xl mx-auto px-4">

                    <Link
                        to = "/"
                        className = "inline-flex items-center gap-1 w-fit mb-4 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 shadow hover:bg-blue-100 transition"
                    >
                        <ArrowLeftIcon className = "h-5 w-5"/>
                        Back
                    </Link>

                    <h1 className = "text-2xl font-bold text-center mb-6">
                        Search by bird type
                    </h1>

                    <TagPickerInline
                        tags = {allTags}
                        selected = {[current]}
                        toggle = {chooseTag}
                    />

                    {current && (
                        <p className = "text-sm text-gray-600 mt-5">
                            Current selection:<span className = "font-semibold">{current}</span>
                        </p>
                    )}

                    {loading && <p className = "mt-6 text-center text-gray-500 animate-pulse">Querying...</p>}

                    {!loading && !current && (
                        <p className = "mt-6 text-center text-gray-500">Please choose a bird first</p>
                    )}

                    {!loading && current && links.length === 0 && (
                        <p className = "mt-6 text-center text-gray-500">No matching file found</p>
                    )}

                    {links.length > 0 && (
                        <div className = "mt-8">
                            <h2 className = "font-semibold mb-1 text-center">Match files:</h2>
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
            </main>

            <Footer/>
            <ErrorModal message = {error} onClose = {() => setError('')}/>
            <OriginalFetcher/>
        </div>
    );
}
