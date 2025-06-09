/* src/pages/SearchTagsCount.jsx */
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CountChip from '../components/CountChip';
import ErrorModal from '../components/ErrorModal';
import {useToast} from '../contexts/ToastContext';
import {Link} from 'react-router-dom';
import {ArrowLeftIcon} from '@heroicons/react/24/solid';
import TagCountPickerInline from '../components/TagCountPickerInline';
import OriginalFetcher from '../components/ImageManagementTool';

const API_BASE = import.meta.env.VITE_API_BASE;

export default function SearchTagsCount() {
    /* ----------------------------- state ----------------------------- */
    const [allTags, setAllTags] = useState([]);
    const [selected, setSelected] = useState({});     // { tag: count }
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState([]);         // URL[]
    const [error, setError] = useState('');
    const {showToast} = useToast();

    /* --------------------------- fetch tags -------------------------- */
    useEffect(() => {
        axios
            .get(`${API_BASE}/list-tags`)
            .then((r) => setAllTags(r.data.tags || []))
            .catch(() => setError('FAILED TO GET TAG'));
    }, []);

    /* ----------------------- tag helpers ----------------------------- */
    const toggle = (t) => setSelected((p) => (t in p ? p : {...p, [t]: 1}));
    const inc = (t) => setSelected((p) => ({...p, [t]: p[t] + 1}));
    const dec = (t) => setSelected((p) => ({...p, [t]: Math.max(1, p[t] - 1)}));
    const remove = (t) => setSelected(({[t]: _, ...rest}) => rest);

    /* ---------------------------- query ------------------------------ */
    const queryByTags = async (payload) => {
        if (!Object.keys(payload).length) {
            setResult([]);
            return;
        }

        setLoading(true);
        try {
            const qs = Object.entries(payload)
                .map(([t, c], i) => `tag${i + 1}=${encodeURIComponent(t)}&count${i + 1}=${c}`)
                .join('&');

            const res = await axios.get(`${API_BASE}/query-by-tags?${qs}`);
            const links = [...new Set(res.data.links)];
            setResult(links);
            showToast(`Returns ${links.length} files`, 'success');
        } catch (e) {
            setError(e.message || 'QUERY FAILED');
        } finally {
            setLoading(false);
        }
    };

    /* 每次选择变动自动查询 */
    useEffect(() => {
        queryByTags(selected);
    }, [selected]);

    /* --------------------------- render ------------------------------ */
    return (
        <div className = "flex flex-col min-h-screen">
            <Header/>

            <main className = "flex-1 bg-gray-50 py-12">
                {/* ------- 内层统一宽度容器 ------- */}
                <div className = "max-w-2xl mx-auto px-4">
                    {/* 返回按钮（左） */}
                    <Link
                        to = "/"
                        className = "inline-flex items-center gap-1 w-fit mb-4 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 shadow hover:bg-blue-100 transition"
                    >
                        <ArrowLeftIcon className = "h-5 w-5"/>
                        Back
                    </Link>

                    {/* 页面标题（居中） */}
                    <h1 className = "text-2xl font-bold text-center mb-6">
                        Search by tag • amount
                    </h1>

                    {/* 标签选择器 */}
                    <TagCountPickerInline
                        allTags = {allTags}
                        selected = {selected}
                        toggle = {toggle}
                    />

                    {/* 已选标签 Chip 区 */}
                    {Object.keys(selected).length > 0 && (
                        <div className = "flex flex-wrap gap-2 mt-5 justify-center">
                            {Object.entries(selected).map(([tag, cnt]) => (
                                <CountChip
                                    key = {tag}
                                    tag = {tag}
                                    count = {cnt}
                                    inc = {() => inc(tag)}
                                    dec = {() => dec(tag)}
                                    remove = {() => remove(tag)}
                                />
                            ))}
                        </div>
                    )}

                    {/* 加载与提示 */}
                    {loading && (
                        <p className = "mt-6 text-center text-gray-500 animate-pulse">
                            Querying...
                        </p>
                    )}

                    {!loading && result.length === 0 && (
                        <p className = "mt-6 text-center text-gray-500">
                            {Object.keys(selected).length ? 'No matching file found' : 'Please select the tag and set the quantity'}
                        </p>
                    )}

                    {/* 匹配结果（可垂直滚动，布局与 SearchByFile 保持一致） */}
                    {result.length > 0 && (
                        <div className = "mt-8">
                            <h2 className = "font-semibold mb-1 text-center">Match files:</h2>
                            <div className = "max-h-80 overflow-auto border rounded p-3 bg-white">
                                <ul className = "list-disc list-inside space-y-2 text-blue-700">
                                    {result.map((url) => (
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
