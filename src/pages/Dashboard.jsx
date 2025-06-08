/* src/pages/Dashboard.jsx （卡片区已更新）*/
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Card from '../components/Card';

import {
    CloudArrowUpIcon, MagnifyingGlassIcon, PhotoIcon, TagIcon,
} from '@heroicons/react/24/solid';

const Dashboard = () => {
    return (<div className = "flex flex-col min-h-screen">
        <Header/>

        <main className = "flex-1 bg-gray-50 py-12">
            <div className = "max-w-xl mx-auto px-4 mb-8">
                <h1 className = "text-3xl font-bold text-gray-800 text-center">
                    BirdTag 工具面板
                </h1>
                <p className = "text-center text-gray-500 mt-2">
                    请选择所需的功能开始操作
                </p>
            </div>

            {/* 垂直卡片列表 */}
            <section className = "max-w-lg mx-auto px-4 flex flex-col gap-6">
                <Card
                    to = "/upload"
                    icon = {CloudArrowUpIcon}
                    title = "上传文件"
                    desc = "将图片、音频或视频上传到云端并自动标注"
                />
                <Card
                    to = "/search-tags-count"
                    icon = {MagnifyingGlassIcon}
                    title = "按标签查找"
                    desc = "基于标签和出现次数检索图片及视频"
                />
                <Card
                    to = "/search-tags"
                    icon = {TagIcon}
                    title = "按种类查找"
                    desc = "基于鸟类种类检索图片及视频"
                />
                <Card
                    to = "/search-by-file"
                    icon = {PhotoIcon}
                    title = "以图搜图 (标签集)"
                    desc = "上传一份文件，查找同一组标签的所有文件"
                />
            </section>
        </main>

        <Footer/>
    </div>);
};

export default Dashboard;
