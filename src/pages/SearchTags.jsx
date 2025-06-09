import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TagSidebar from '../components/TagSidebar';
import MediaCard from '../components/MediaCard';
import ErrorModal from '../components/ErrorModal';
import {useToast} from '../contexts/ToastContext';
import {Link} from 'react-router-dom';
import {ArrowLeftIcon} from '@heroicons/react/24/solid';
import {deleteApi, updateTagsApi} from "../api/media";

const MOCK = true;

/* Mock */
const mockTags = [
    'crow', 'pigeon', 'eagle', 'sparrow', 'owl', 'parrot', 'seagull',
    'falcon', 'albatross', 'woodpecker', 'robin', 'swallow', 'crane'
];
const mockResult = (selected) =>
    selected.map((tg, i) => ({
        id: `${tg}-${i}`,
        type: 'image',
        thumbnail_url: `https://placehold.co/200x140?text=${tg}`,
        file_url: `https://placehold.co/800x560?text=${tg}`,
        tags: [tg]
    }));

const SearchTags = () => {
    const [allTags, setAllTags] = useState([]);
    const [selected, setSelected] = useState([]);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState([]);
    const [error, setError] = useState('');
    const {showToast} = useToast();

    useEffect(() => {
        if (MOCK) setAllTags(mockTags);
        else axios.get('/api/all-tags').then(r => setAllTags(r.data))
            .catch(() => setError('获取标签失败'));
    }, []);

    const toggleTag = (tag) => {
        const newSel = selected.includes(tag)
            ? selected.filter(t => t !== tag)
            : [...selected, tag];
        setSelected(newSel);
        fetchResult(newSel);
    };

    const fetchResult = async (tagsArr) => {
        if (!tagsArr.length) {
            setResult([]);
            return;
        }
        setLoading(true);
        try {
            let data;
            if (MOCK) {
                await new Promise(r => setTimeout(r, 400));
                data = mockResult(tagsArr);
            } else {
                const res = await axios.post('/api/search-tags', {tags: tagsArr});
                data = res.data;
            }
            setResult(data);
            showToast(`获取 ${data.length} 条文件`, 'success');
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
                    <TagSidebar tags = {allTags} selected = {selected} toggle = {toggleTag}/>
                    <section className = "basis-3/4 flex-1 p-8">
                        <Link to = "/" className = "inline-flex items-center gap-1 w-fit mb-2
                rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700
                shadow hover:bg-blue-100 active:bg-blue-200 transition">
                            <ArrowLeftIcon className = "h-5 w-5"/> 返回主页
                        </Link>
                        <h1 className = "text-2xl font-bold mb-4">选中标签：{selected.length}</h1>

                        {loading && <p className = "text-gray-500">查询中...</p>}
                        {!loading && result.length === 0 &&
                            <p className = "text-gray-500">暂无结果，请选择标签</p>}
                        {result.length > 0 &&
                            <div className = "grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                                {result.map(m => (
                                    <MediaCard key = {m.id} media = {m}
                                               onUpdateTags = {(tags) => updateTagsApi(m.id, tags)}
                                               onDelete = {() => deleteApi(m.id)}/>
                                ))}
                            </div>}
                    </section>
                </div>
            </main>
            <Footer/>
            <ErrorModal message = {error} onClose = {() => setError('')}/>
        </div>
    );
};

export default SearchTags;
