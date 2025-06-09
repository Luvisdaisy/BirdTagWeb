/* src/pages/Dashboard.jsx （卡片区已更新）*/
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Card from '../components/Card';

import {CloudArrowUpIcon, MagnifyingGlassIcon, PhotoIcon, TagIcon,} from '@heroicons/react/24/solid';

const Dashboard = () => {
    return (<div className = "flex flex-col min-h-screen">
        <Header/>

        <main className = "flex-1 bg-gray-50 py-12">
            <div className = "max-w-xl mx-auto px-4 mb-8">
                <h1 className = "text-3xl font-bold text-gray-800 text-center">
                    BirdTag Tool Panel
                </h1>
                <p className = "text-center text-gray-500 mt-2">
                    Please select the required function to start operation
                </p>
            </div>

            {/* 垂直卡片列表 */}
            <section className = "max-w-lg mx-auto px-4 flex flex-col gap-6">
                <Card
                    to = "/upload"
                    icon = {CloudArrowUpIcon}
                    title = "Upload file"
                    desc = "Upload pictures, audio or video to the cloud and automatically label them"
                />
                <Card
                    to = "/search-tags-count"
                    icon = {MagnifyingGlassIcon}
                    title = "Search by tag"
                    desc = "Search pictures and videos based on labels and occurrences"
                />
                <Card
                    to = "/search-tags"
                    icon = {TagIcon}
                    title = "Search by type"
                    desc = "Search pictures and videos based on bird species"
                />
                <Card
                    to = "/search-by-file"
                    icon = {PhotoIcon}
                    title = "Search for files with the same tag"
                    desc = "Upload a file and find all files in the same set of tags"
                />
            </section>
        </main>

        <Footer/>
    </div>);
};

export default Dashboard;
