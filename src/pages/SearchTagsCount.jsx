import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TagCountSidebar from '../components/TagCountSidebar';
import CountChip from '../components/CountChip';
import MixedGrid from '../components/MixedGrid';
import ErrorModal from '../components/ErrorModal';
import {useToast} from '../contexts/ToastContext';
import {Link} from "react-router-dom";
import {ArrowLeftIcon} from "@heroicons/react/24/solid";

const MOCK = true;

/* ===== Mock 数据 ===== */
const mockTags = [
    'crow', 'pigeon', 'eagle', 'sparrow', 'owl', 'parrot', 'seagull',
    'falcon', 'albatross', 'woodpecker', 'robin', 'swallow', 'crane'
];
const mockResult = (payload) =>
    Object.entries(payload).map(([tag, n]) => ({
        id: `${tag}-${n}`,
        type: 'image',
        thumb: `https://placehold.co/200x140?text=${tag}+${n}`,
        original: `https://placehold.co/800x560?text=${tag}+${n}`,
    }));
/* ===================== */

const SearchTagsCount = () => {
    const [allTags, setAllTags] = useState([]);
    const [selected, setSelected] = useState({});   // { tag: count }
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState([]);
    const [error, setError] = useState('');
    const {showToast} = useToast();

    /* 拉取所有标签 */
    useEffect(() => {
        if (MOCK) setAllTags(mockTags);
        else axios.get('/api/all-tags').then(r => setAllTags(r.data))
            .catch(() => setError('获取标签失败'));
    }, []);

    /* 选/取消标签 */
    const toggle = (tag) =>
        setSelected((p) => (tag in p ? p : {...p, [tag]: 1}));

    /* 改数量/删除 */
    const inc = (t) => setSelected((p) => ({...p, [t]: p[t] + 1}));
    const dec = (t) => setSelected((p) => ({...p, [t]: Math.max(1, p[t] - 1)}));
    const remove = (t) => setSelected(({[t]: _, ...rest}) => rest);

    /* 查询函数 */
    const query = async (payload) => {
        if (!Object.keys(payload).length) {
            setResult([]);
            return;
        }
        setLoading(true);
        try {
            let data;
            if (MOCK) {
                await new Promise(r => setTimeout(r, 400));
                data = mockResult(payload);
            } else {
                const res = await axios.post('/api/search-tags-count', payload);
                data = res.data.links;
            }
            setResult(data);
            showToast(`返回 ${data.length} 条文件`, 'success');
        } catch (err) {
            setError(err.message || '查询失败');
        } finally {
            setLoading(false);
        }
    };

    /* selected 改动自动查询 */
    useEffect(() => {
        query(selected);
    }, [selected]);

    return (
        <div className = "flex flex-col min-h-screen">
            <Header/>

            <main className = "flex-1 bg-gray-50">
                <div className = "flex w-full">
                    <TagCountSidebar
                        allTags = {allTags}
                        selected = {selected}
                        toggle = {toggle}
                    />

                    {/* 右侧 */}
                    <section className = "basis-2/3 flex-1 p-8">
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
                        <h1 className = "text-2xl font-bold text-gray-800 mb-4">
                            按标签 + 数量 检索
                        </h1>

                        {/* Chip 列表 */}
                        <div className = "flex flex-wrap gap-2">
                            {Object.entries(selected).map(([tag, count]) => (
                                <CountChip
                                    key = {tag} tag = {tag} count = {count}
                                    inc = {() => inc(tag)} dec = {() => dec(tag)}
                                    remove = {() => remove(tag)}
                                />
                            ))}
                        </div>

                        {/* 结果 / 提示 */}
                        {loading && <p className = "mt-6 text-gray-500">查询中...</p>}
                        {!loading && result.length === 0 && (
                            <p className = "mt-6 text-gray-500">请选择标签并设定数量</p>
                        )}
                        {result.length > 0 && <MixedGrid list = {result}/>}
                    </section>
                </div>
            </main>

            <Footer/>
            <ErrorModal message = {error} onClose = {() => setError('')}/>
        </div>
    );
};

export default SearchTagsCount;
