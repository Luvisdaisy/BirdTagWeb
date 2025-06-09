import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TagSidebar from '../components/TagSidebar';
import ErrorModal from '../components/ErrorModal';
import {useToast} from '../contexts/ToastContext';
import {Link} from 'react-router-dom';
import {ArrowLeftIcon} from '@heroicons/react/24/solid';
import OriginalFetcher from "../components/ImageManagementTool";

const API_BASE =
    import.meta.env.VITE_API_BASE ||
    'https://0bltz7gw14.execute-api.us-east-1.amazonaws.com/prod/api';

export default function SearchTags() {
    const [allTags, setAllTags] = useState([]);
    const [current, setCurrent] = useState(''); // 单选种类
    const [loading, setLoading] = useState(false);
    const [links, setLinks] = useState([]);
    const [error, setError] = useState('');
    const {showToast} = useToast();

    /* 拉取所有标签 */
    useEffect(() => {

        axios
            .get(`${API_BASE}/list-tags`)
            .then((r) => setAllTags(r.data.tags || []))
            .catch(() => setError('获取标签失败'));
    }, []);

    /* 选择一个种类 */
    const chooseTag = (tag) => {
        const next = tag === current ? '' : tag; // 再次点击取消选择
        setCurrent(next);
        query(next);
    };

    /* 查询单个标签 */
    const query = async (tag) => {
        if (!tag) return setLinks([]);

        setLoading(true);
        try {
            let data;

            // {"crow"} 按说明使用 POST body
            const res = await axios.get(`${API_BASE}/query-by-tags`, {
                tags: [tag],
            });
            data = [...new Set(res.data.links)];
            setLinks(data);
            showToast(`返回 ${data.length} 条文件`, 'success');
        } catch (e) {
            setError(e.message || '查询失败');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className = "flex flex-col min-h-screen">
            <Header/>
            <main className = "flex-1 bg-gray-50">
                <div className = "flex w-full">
                    <TagSidebar tags = {allTags} selected = {[current]} toggle = {chooseTag}/>

                    <section className = "basis-3/4 flex-1 p-8">
                        {/* 返回主页 */}
                        <Link
                            to = "/"
                            className = "inline-flex items-center gap-1 mb-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 shadow hover:bg-blue-100 transition"
                        >
                            <ArrowLeftIcon className = "h-5 w-5"/>
                            返回主页
                        </Link>

                        <h1 className = "text-2xl font-bold mb-4">选择一个鸟类种类</h1>

                        {current && (
                            <p className = "text-sm text-gray-600 mb-4">
                                当前选择：<span className = "font-semibold">{current}</span>
                            </p>
                        )}

                        {/* 结果列表 */}
                        {loading && <p className = "mt-6 text-gray-500">查询中...</p>}
                        {!loading && !current && (
                            <p className = "mt-6 text-gray-500">请在左侧选择一种鸟类</p>
                        )}
                        {!loading && current && links.length === 0 && (
                            <p className = "mt-6 text-gray-500">未找到匹配文件</p>
                        )}
                        {links.length > 0 && (
                            <ul className = "list-disc list-inside mt-6 space-y-2 text-blue-700">
                                {links.map((url) => (
                                    <li key = {url}>
                                        <a
                                            href = {url}
                                            target = "_blank"
                                            rel = "noopener noreferrer"
                                            className = "hover:underline break-all"
                                        >
                                            {url}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>
                </div>
            </main>
            <Footer/>
            <ErrorModal message = {error} onClose = {() => setError('')}/>
            <OriginalFetcher/>
        </div>
    );
}
