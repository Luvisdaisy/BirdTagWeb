/* src/components/QueryFileUploader.jsx */
import React, {useState, useRef} from 'react';
import axios from 'axios';
import {useToast} from '../contexts/ToastContext';
import ErrorModal from './ErrorModal';
import MixedGrid from './MixedGrid';
import {
    ArrowUpTrayIcon,
    XMarkIcon,
} from '@heroicons/react/24/solid';

const MAX_SIZE = 20 * 1024 * 1024;          // 20 MB
const MOCK = true;

/* Mock 结果示例 */
const mockResult = [
    {
        id: 'img1',
        type: 'image',
        thumb: 'https://placehold.co/200x140?text=result',
        original: 'https://placehold.co/800x560?text=result',
    },
];

const QueryFileUploader = () => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState([]);
    const [error, setError] = useState('');
    const {showToast} = useToast();
    const inputRef = useRef();

    /* === 选文件 === */
    const handleSelect = (e) => {
        const f = e.target.files[0];
        if (!f) return;

        if (f.size > MAX_SIZE) {
            setError('文件大小超过 20 MB，请重新选择');
            e.target.value = '';
            return;
        }
        setFile(f);
        setPreview(f.type.startsWith('image') ? URL.createObjectURL(f) : '');
        setResult([]);
    };

    /* === 触发隐藏 input 点击 === */
    const triggerSelect = () => inputRef.current?.click();

    /* === 移除文件 === */
    const removeFile = () => {
        setFile(null);
        setPreview('');
        setResult([]);
    };

    /* === 查询 === */
    const handleQuery = async () => {
        if (!file) return;
        setLoading(true);
        try {
            let data;
            if (MOCK) {
                await new Promise((r) => setTimeout(r, 500));
                data = mockResult;
            } else {
                const form = new FormData();
                form.append('file', file);
                const res = await axios.post('/api/search-by-file', form);
                data = res.data;
            }
            setResult(data);
            showToast(`获取 ${data.length} 条匹配文件`, 'success');
        } catch (err) {
            setError(err.message || '查询失败');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* ---- 上传框，与 FileUploader 风格一致 ---- */}
            {!file && (
                <div
                    onClick = {triggerSelect}
                    className = "border-2 border-dashed border-blue-400 rounded-lg p-8
                     flex flex-col items-center gap-3 text-gray-600 cursor-pointer
                     hover:bg-blue-50 transition"
                >
                    <ArrowUpTrayIcon className = "h-10 w-10 text-blue-500"/>
                    <p>点击或拖拽文件到此处搜索（单文件 ≤ 20 MB）</p>
                    <input
                        ref = {inputRef}
                        type = "file"
                        accept = "image/*,video/*,audio/*"
                        className = "hidden"
                        onChange = {handleSelect}
                    />
                </div>
            )}

            {/* ---- 已选文件预览 ---- */}
            {file && (
                <div className = "relative border rounded-lg p-4 mt-2 bg-gray-50">
                    <button
                        onClick = {removeFile}
                        className = "absolute top-1 right-1 text-gray-400 hover:text-red-600"
                    >
                        <XMarkIcon className = "h-5 w-5"/>
                    </button>

                    <p className = "text-sm font-medium mb-2 truncate">{file.name}</p>
                    {preview ? (
                        <img
                            src = {preview}
                            alt = ""
                            className = "w-40 h-28 object-cover rounded"
                        />
                    ) : (
                        <p className = "text-xs text-gray-500">
                            {file.type.startsWith('video')
                                ? '视频文件'
                                : file.type.startsWith('audio')
                                    ? '音频文件'
                                    : '无法预览'}
                        </p>
                    )}
                </div>
            )}

            {/* ---- 查询按钮 ---- */}
            {file && (
                <button
                    onClick = {handleQuery}
                    disabled = {loading}
                    className = {`mt-4 w-full ${
                        loading
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700'
                    } text-white py-2 rounded-lg transition`}
                >
                    {loading ? '查询中...' : '开始查询相似文件'}
                </button>
            )}

            {/* ---- 查询结果 ---- */}
            {result.length > 0 && <MixedGrid list = {result}/>}

            <ErrorModal message = {error} onClose = {() => setError('')}/>
        </>
    );
};

export default QueryFileUploader;
