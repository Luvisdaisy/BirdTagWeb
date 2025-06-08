import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TagSidebar from '../components/TagSidebar';
import MixedGrid from '../components/MixedGrid';
import ErrorModal from '../components/ErrorModal';
import {useToast} from '../contexts/ToastContext';
import {Link} from "react-router-dom";
import {ArrowLeftIcon} from "@heroicons/react/24/solid";

const MOCK = true;

/* ---------- Mock 数据 ---------- */
const mockTags = [
    'crow', 'pigeon', 'eagle', 'sparrow', 'owl', 'parrot', 'seagull',
    'falcon', 'albatross', 'woodpecker', 'robin', 'swallow', 'crane',
    'kingfisher', 'magpie', 'duck', 'goose', 'swan', 'turkey', 'peacock'
];
const mockResult = (selected) =>
    selected.map((tg, i) => ({
        id: `${tg}-${i}`,
        type: 'image',
        thumb: `https://placehold.co/200x140?text=${tg}`,
        original: `https://placehold.co/800x560?text=${tg}`,
    }));
/* -------------------------------- */

const SearchTags = () => {
    const [allTags, setAllTags] = useState([]);
    const [selected, setSelected] = useState([]);
    const [result, setResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const {showToast} = useToast();

    /* 拉取标签 */
    useEffect(() => {
        if (MOCK) setAllTags(mockTags);
        else axios.get('/api/all-tags').then(r => setAllTags(r.data))
            .catch(() => setError('获取标签失败'));
    }, []);

    /* 切换标签 & 查询 */
    const toggleTag = (tag) => {
        const newSel = selected.includes(tag)
            ? selected.filter((t) => t !== tag)
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
        } catch (err) {
            setError(err.message || '查询失败');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className = "flex flex-col min-h-screen">
            <Header/>

            {/* ===== 主体 ===== */}
            <main className = "flex-1 bg-gray-50">
                <div className = "flex w-full">
                    {/* 左侧标签栏 */}
                    <TagSidebar tags = {allTags} selected = {selected} toggle = {toggleTag}/>

                    {/* 右侧结果区 */}
                    <section className = "basis-3/4 flex-1 p-8">
                        {/* 返回主页按钮 */}
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
                            选中标签：{selected.length}
                        </h1>

                        {/* 结果 */}
                        {loading && <p className = "text-gray-500">查询中...</p>}
                        {(!loading && result.length === 0) && (
                            <p className = "text-gray-500">暂无结果，请选择标签</p>
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

export default SearchTags;
