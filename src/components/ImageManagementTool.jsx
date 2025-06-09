import React, {useState} from 'react';
import axios from 'axios';
import {useToast} from '../contexts/ToastContext';
import {MinusIcon, PlusIcon, TrashIcon, XMarkIcon,} from '@heroicons/react/24/solid';

const API_BASE = import.meta.env.VITE_API_BASE

export default function ImageManagementTool() {
    const {showToast} = useToast();

    // 原图查询
    const [thumbInput, setThumbInput] = useState('');
    const [origUrl, setOrigUrl] = useState('');
    const [loadingOrig, setLoadingOrig] = useState(false);

    // 批量 URL 输入
    const [bulkUrls, setBulkUrls] = useState('');

    // 多行标签/数量
    const [tagCounts, setTagCounts] = useState([{tag: '', count: ''}]);

    // 原图查询
    const fetchOriginal = async () => {
        if (!thumbInput.trim()) return;
        setLoadingOrig(true);
        try {
            const {data} = await axios.get(`${API_BASE}/query-by-url`, {
                params: {url: thumbInput.trim()},
            });
            setOrigUrl(data.full_image_url);
            showToast('Original image link has been obtained', 'success');
        } catch {
            showToast('Failed to obtain the original image', 'error');
        } finally {
            setLoadingOrig(false);
        }
    };

    const downloadOrig = () => {
        const a = document.createElement('a');
        a.href = origUrl;
        a.download = '';
        a.click();
    };

    // 处理标签增删
    const handleTagChange = async (op) => {
        const urls = bulkUrls
            .split('\n')
            .map((u) => u.trim())
            .filter(Boolean);
        if (!urls.length) {
            showToast('Please enter the URL list first', 'error');
            return;
        }

        // 构造 tags 数组 "tag,count"
        const tags = tagCounts
            .map(({tag, count}) => `${tag.trim()},${count}`)
            .filter((s) => {
                const [t, c] = s.split(',');
                return t && /^\d+$/.test(c);
            });
        if (!tags.length) {
            showToast('Please fill in at least one valid tag and quantity', 'error');
            return;
        }

        try {
            await axios.post(`${API_BASE}/update-tags`, {
                url: urls, operation: op, tags,
            });
            showToast('Tag operation has been submitted', 'success');
        } catch {
            showToast('Tag operation failed', 'error');
        }
    };

    // 批量删除
    const handleDelete = async () => {
        const urls = bulkUrls
            .split('\n')
            .map((u) => u.trim())
            .filter(Boolean);
        if (!urls.length) {
            showToast('Please enter the URL list first', 'error');
            return;
        }
        try {
            await axios.post(`${API_BASE}/delete`, {
                processed_urls: urls,
            });
            showToast('Delete request has been submitted', 'success');
        } catch {
            showToast('Deletion failed', 'error');
        }
    };

    // 增删行
    const addRow = () => setTagCounts((prev) => [...prev, {tag: '', count: ''}]);
    const removeRow = (idx) => setTagCounts((prev) => prev.filter((_, i) => i !== idx));

    // 更新行数据
    const updateRow = (idx, field, value) => setTagCounts((prev) => prev.map((row, i) => (i === idx ? {
        ...row,
        [field]: value
    } : row)));

    return (<div id = "imgMgr" className = "fixed bottom-6 right-6 z-50 w-80 rounded-xl shadow-lg bg-white p-4">
        {/* Header */}
        <div className = "flex justify-between items-center mb-2">
            <h2 className = "font-semibold">IMAGE MANAGEMENT TOOLS</h2>
            <button onClick = {() => document.getElementById('imgMgr').remove()}
                    className = "text-gray-500 hover:text-gray-700">
                <XMarkIcon className = "h-5 w-5"/>
            </button>
        </div>

        {/* 原图获取 */}
        <div className = "mb-4">
            <label className = "block text-xs mb-1 text-gray-600">Thumbnail URL</label>
            <div className = "flex">
                <input
                    className = "flex-1 border rounded-l px-2 py-1 text-xs"
                    value = {thumbInput}
                    onChange = {(e) => {
                        setThumbInput(e.target.value);
                        setOrigUrl('');
                    }}
                />
                <button
                    onClick = {() => {
                        setThumbInput('');
                        setOrigUrl('');
                    }}
                    className = "px-2 bg-gray-100 border-t border-b border-r rounded-r"
                    title = "CLEAR"
                >
                    <XMarkIcon className = "h-4 w-4"/>
                </button>
            </div>
            <button
                disabled = {!thumbInput.trim() || loadingOrig}
                onClick = {fetchOriginal}
                className = {`mt-2 w-full text-white py-1 rounded ${!thumbInput.trim() || loadingOrig ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-sm`}
            >
                {loadingOrig ? 'Querying...' : 'Get the original image link'}
            </button>
            {origUrl && (<div className = "mt-2 text-xs break-all">
                <a href = {origUrl} target = "_blank" rel = "noreferrer"
                   className = "text-blue-700 hover:underline">
                    {origUrl}
                </a>
            </div>)}
        </div>

        {/* 批量 URL 输入 */}
        <div className = "mb-3">
            <label className = "block text-xs mb-1 text-gray-600">Multiple thumbnail URLs (line-break-separated)</label>
            <textarea
                rows = {3}
                className = "w-full border rounded px-2 py-1 text-xs"
                value = {bulkUrls}
                onChange = {(e) => setBulkUrls(e.target.value)}
            />
        </div>

        {/* 标签/数量 多行输入 */}
        <div className = "mb-3">
            <label className = "block text-xs mb-1 text-gray-600">Tags & Quantity</label>
            {tagCounts.map((row, idx) => (<div key = {idx} className = "flex items-center gap-2 mb-1">
                <input
                    placeholder = "Tag"
                    className = "flex-1 border rounded px-2 py-1 text-xs"
                    value = {row.tag}
                    onChange = {(e) => updateRow(idx, 'tag', e.target.value)}
                />
                <input
                    placeholder = "Amount"
                    type = "number"
                    min = "1"
                    className = "w-16 border rounded px-2 py-1 text-xs"
                    value = {row.count}
                    onChange = {(e) => updateRow(idx, 'count', e.target.value)}
                />
                <button onClick = {() => removeRow(idx)} className = "text-red-500 hover:text-red-700">
                    <XMarkIcon className = "h-5 w-5"/>
                </button>
            </div>))}
            <button onClick = {addRow}
                    className = "inline-flex items-center gap-1 text-sm text-blue-600 hover:underline mb-2">
                <PlusIcon className = "h-4 w-4"/> Add rows
            </button>
            {/* 操作按钮 */}
            <div className = "flex gap-2">
                <button
                    onClick = {() => {
                        handleTagChange(1).then(r => {
                            window.location.reload()
                        })
                    }}
                    className = "flex-1 inline-flex items-center justify-center gap-1 text-white bg-green-600 hover:bg-green-700 py-1 rounded text-xs"
                >
                    <PlusIcon className = "h-4 w-4"/>
                    Add tags
                </button>
                <button
                    onClick = {() => {
                        handleTagChange(0).then(r => {
                            window.location.reload()
                        })
                    }}
                    className = "flex-1 inline-flex items-center justify-center gap-1 text-white bg-yellow-600 hover:bg-yellow-700 py-1 rounded text-xs"
                >
                    <MinusIcon className = "h-4 w-4"/>
                    Delete tags
                </button>
            </div>
        </div>

        {/* 批量删除 */}
        <button
            onClick = {handleDelete}
            className = "w-full inline-flex items-center justify-center gap-1 bg-red-600 hover:bg-red-700 text-white py-1 rounded text-xs"
        >
            <TrashIcon className = "h-4 w-4"/>
            Batch delete files
        </button>
    </div>);
}
