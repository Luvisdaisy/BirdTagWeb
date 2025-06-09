import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TagCountSidebar from '../components/TagCountSidebar';
import CountChip from '../components/CountChip';
import MediaCard from '../components/MediaCard';
import ErrorModal from '../components/ErrorModal';
import {useToast} from '../contexts/ToastContext';
import {Link} from 'react-router-dom';
import {ArrowLeftIcon} from '@heroicons/react/24/solid';
import {updateTagsApi, deleteApi} from '../api/media';

const API_BASE = import.meta.env.VITE_API_BASE

export default function SearchTagsCount() {
    const [allTags, setAllTags] = useState([]);
    const [selected, setSelected] = useState({}); // {tag: count}
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState([]);
    const [error, setError] = useState('');
    const {showToast} = useToast();

    /* 获取全部标签 */
    useEffect(() => {
        axios
            .get(`${API_BASE}/list-tags`)
            .then((r) => setAllTags(r.data.tags || []))
            .catch(() => setError('获取标签失败'));
    }, []);

    /* 选/改标签 */
    const toggle = (tag) => setSelected((p) => (tag in p ? p : {...p, [tag]: 1}));
    const inc = (t) => setSelected((p) => ({...p, [t]: p[t] + 1}));
    const dec = (t) => setSelected((p) => ({...p, [t]: Math.max(1, p[t] - 1)}));
    const remove = (t) => setSelected(({[t]: _, ...rest}) => rest);

    /* 查询 */
    const queryByTags = async (payload) => {
        if (!Object.keys(payload).length) return setResult([]);

        setLoading(true);
        try {
            let data;

            // 拼 queryString: tag1=aa&count1=2&tag2=bb&count2=1
            const qs = Object.entries(payload)
                .map(([t, c], i) => `tag${i + 1}=${encodeURIComponent(t)}&count${i + 1}=${c}`)
                .join('&');
            const res = await axios.get(`${API_BASE}/query-by-tags?${qs}`);
            data = (res.data.links || []).map((url, idx) => ({
                id: `${idx}`,
                type: url.match(/\.mp4$|\.mov$/) ? 'video' : url.match(/\.mp3$|\.wav$/) ? 'audio' : 'image',
                thumbnail_url: url,
                file_url: url.replace('-thumb', ''),
                tags: Object.keys(payload),
            }));
            setResult(data);
            showToast(`返回 ${data.length} 条文件`, 'success');
        } catch (e) {
            setError(e.message || '查询失败');
        } finally {
            setLoading(false);
        }
    };

    /* 监听 selected */
    useEffect(() => {
        queryByTags(selected);
    }, [selected]);

    return (
        <div className = "flex flex-col min-h-screen">
            <Header/>

            <main className = "flex-1 bg-gray-50">
                <div className = "flex w-full">
                    <TagCountSidebar allTags = {allTags} selected = {selected} toggle = {toggle}/>

                    <section className = "basis-2/3 flex-1 p-8">
                        <Link
                            to = "/"
                            className = "inline-flex items-center gap-1 mb-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 shadow hover:bg-blue-100 transition"
                        >
                            <ArrowLeftIcon className = "h-5 w-5"/> 返回主页
                        </Link>

                        <h1 className = "text-2xl font-bold mb-4">按标签 + 数量 检索</h1>

                        {/* 选中 Chip */}
                        <div className = "flex flex-wrap gap-2">
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

                        {/* 结果 */}
                        {loading && <p className = "mt-6 text-gray-500">查询中...</p>}
                        {!loading && result.length === 0 &&
                            <p className = "mt-6 text-gray-500">请选择标签并设定数量</p>}
                        {result.length > 0 && (
                            <div className = "grid gap-4 sm:grid-cols-2 md:grid-cols-3 mt-6">
                                {result.map((m) => (
                                    <MediaCard
                                        key = {m.id}
                                        media = {m}
                                        onUpdateTags = {(tags) => updateTagsApi(m.id, tags)}
                                        onDelete = {() =>
                                            deleteApi(m.id).then(() => setResult((r) => r.filter((x) => x.id !== m.id)))
                                        }
                                    />
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </main>

            <Footer/>
            <ErrorModal message = {error} onClose = {() => setError('')}/>
        </div>
    );
}
