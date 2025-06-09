import React, {useState} from 'react';
import axios from 'axios';
import {useToast} from '../contexts/ToastContext';
import {
    XMarkIcon,
    ArrowDownTrayIcon,
    PlusIcon,
    MinusIcon,
    TrashIcon,
} from '@heroicons/react/24/solid';

const API_BASE =
    import.meta.env.VITE_API_BASE ||
    'https://0bltz7gw14.execute-api.us-east-1.amazonaws.com/prod/api';

export default function ImageManagementTool() {
    /* ----------------- state ----------------- */
    const [thumbInput, setThumbInput] = useState('');
    const [origUrl, setOrigUrl] = useState('');
    const [loading, setLoading] = useState(false);

    const [bulkUrls, setBulkUrls] = useState('');
    const [tagString, setTagString] = useState('');
    const [op, setOp] = useState(1); // 1 add, 0 remove

    const {showToast} = useToast();

    /* -------------- 原图获取 ------------------ */
    const fetchOriginal = async () => {
        if (!thumbInput.trim()) return;
        setLoading(true);
        try {
            const {data} = await axios.get(`${API_BASE}/query-by-url`, {
                params: {url: thumbInput.trim()},
            });
            setOrigUrl(data.full_image_url);
            showToast('原图链接已获取', 'success');
        } catch (e) {
            showToast('获取原图失败', 'error');
        } finally {
            setLoading(false);
        }
    };

    const downloadOrig = () => {
        const a = document.createElement('a');
        a.href = origUrl;
        a.download = '';
        a.click();
    };

    /* -------------- 标签增删 ------------------ */
    const handleTagChange = async () => {
        const urls = bulkUrls
            .split('\n')
            .map((u) => u.trim())
            .filter(Boolean);
        if (!urls.length || !tagString.trim()) return;

        const tags = tagString
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean);

        try {
            await axios.post(`${API_BASE}/update-tags`, {
                url: urls,
                operation: op,
                tags,
            });
            showToast('标签操作已提交', 'success');
        } catch (e) {
            showToast('标签操作失败', 'error');
        }
    };

    /* -------------- 批量删除 ------------------ */
    const handleDelete = async () => {
        const urls = bulkUrls
            .split('\n')
            .map((u) => u.trim())
            .filter(Boolean);
        if (!urls.length) return;

        try {
            // ★ MODIFIED ── 按 Lambda 规范字段名 processed_urls
            await  axios.post(`${API_BASE}/delete`, {
                thumbnail_urls: urls,
            });
            showToast('删除请求已提交', 'success');
        } catch (e) {
            showToast('删除失败', 'error');
        }
    };

    /* -------------- UI ------------------ */
    return (
        <div className = "fixed bottom-6 right-6 z-50 w-80 rounded-xl shadow-lg bg-white p-4">
            {/* Header */}
            <div className = "flex justify-between items-center mb-2">
                <h2 className = "font-semibold">图像管理工具</h2>
                <button
                    onClick = {() => document.querySelector('#imgMgr').classList.add('hidden')}
                    className = "text-gray-500 hover:text-gray-700"
                >
                    <XMarkIcon className = "h-5 w-5"/>
                </button>
            </div>

            {/* 原图获取 */}
            <div className = "mb-4">
                <label className = "block text-xs mb-1 text-gray-600">缩略图 URL</label>
                <div className = "flex">
                    <input
                        className = "flex-1 border rounded-l px-2 py-1 text-xs"
                        value = {thumbInput}
                        onChange = {(e) => setThumbInput(e.target.value)}
                    />
                    {/* ★MODIFIED 清空按钮移到右侧 */}
                    <button
                        onClick = {() => {
                            setThumbInput('');
                            setOrigUrl('');
                        }}
                        className = "px-2 bg-gray-100 border-t border-b border-r rounded-r"
                        title = "清空"
                    >
                        <XMarkIcon className = "h-4 w-4"/>
                    </button>
                </div>
                <button
                    disabled = {!thumbInput.trim() || loading}
                    onClick = {fetchOriginal}
                    className = {`mt-2 w-full text-white py-1 rounded ${
                        !thumbInput.trim() || loading
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700'
                    } text-sm`}
                >
                    获取原图链接
                </button>

                {origUrl && (
                    <div className = "mt-2 text-xs break-all">
                        <a
                            href = {origUrl}
                            target = "_blank"
                            rel = "noreferrer"
                            className = "text-blue-700 hover:underline"
                        >
                            {origUrl}
                        </a>
                        <button
                            onClick = {downloadOrig}
                            className = "inline-flex items-center gap-1 ml-2 text-blue-600 hover:underline"
                        >
                            <ArrowDownTrayIcon className = "h-4 w-4"/>
                            下载
                        </button>
                    </div>
                )}
            </div>

            {/* 批量 URL 输入 */}
            <div className = "mb-3">
                <label className = "block text-xs mb-1 text-gray-600">
                    多个缩略图 URL（换行分隔）
                </label>
                <textarea
                    rows = {3}
                    className = "w-full border rounded px-2 py-1 text-xs"
                    value = {bulkUrls}
                    onChange = {(e) => setBulkUrls(e.target.value)}
                />
            </div>

            {/* 标签操作 */}
            <div className = "mb-3">
                <label className = "block text-xs mb-1 text-gray-600">标签,数量 (逗号分隔)</label>
                <input
                    className = "w-full border rounded px-2 py-1 text-xs"
                    placeholder = "crow,1 pigeon,2"
                    value = {tagString}
                    onChange = {(e) => setTagString(e.target.value)}
                />
                <div className = "flex items-center gap-2 mt-2">
                    <button
                        onClick = {() => {
                            setOp(1);
                            handleTagChange();
                        }}
                        className = "flex-1 inline-flex items-center justify-center gap-1 text-white bg-green-600 hover:bg-green-700 py-1 rounded text-xs"
                    >
                        <PlusIcon className = "h-4 w-4"/>
                        添加标签
                    </button>
                    <button
                        onClick = {() => {
                            setOp(0);
                            handleTagChange();
                        }}
                        className = "flex-1 inline-flex items-center justify-center gap-1 text-white bg-yellow-600 hover:bg-yellow-700 py-1 rounded text-xs"
                    >
                        <MinusIcon className = "h-4 w-4"/>
                        删除标签
                    </button>
                </div>
            </div>

            {/* 批量删除 */}
            <button
                onClick = {handleDelete}
                className = "w-full inline-flex items-center justify-center gap-1 bg-red-600 hover:bg-red-700 text-white py-1 rounded text-xs"
            >
                <TrashIcon className = "h-4 w-4"/>
                批量删除文件
            </button>
        </div>
    );
}
