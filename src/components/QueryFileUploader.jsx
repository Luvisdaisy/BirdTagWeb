import React, {useRef, useState} from 'react';
import {useToast} from '../contexts/ToastContext';
import ErrorModal from './ErrorModal';
import {ArrowUpTrayIcon, XMarkIcon,} from '@heroicons/react/24/solid';

const DEFAULT_MAX = 20 * 1024 * 1024;

export default function QueryFileUploader({onDone, maxSize = 20, multiple = false}) {
    const MAX_SIZE = maxSize * 1024 * 1024;
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const {showToast} = useToast();
    const inputRef = useRef();

    /* 选择文件 */
    const handleSelect = (e) => {
        const f = e.target.files[0];
        if (!f) return;
        if (f.size > MAX_SIZE) {
            setError(`The file size exceeds ${maxSize}MB, please reselect`);
            e.target.value = '';
            return;
        }
        setFile(f);
        setPreview(f.type.startsWith('image') ? URL.createObjectURL(f) : '');
    };

    /* 触发隐藏 input */
    const trigger = () => inputRef.current?.click();

    /* 移除 */
    const removeFile = () => {
        setFile(null);
        setPreview('');
    };

    /* base64 转换并回调 */
    const handleAnalyse = () => {
        if (!file || !onDone) return;
        setLoading(true);
        const reader = new FileReader();
        reader.onload = () => {
            onDone({base64: reader.result, type: file.type});
            showToast('The file has been uploaded and is being analyzed...', 'info');
            setLoading(false);
            removeFile();
        };
        reader.onerror = () => {
            setError('Failed to read the file');
            setLoading(false);
        };
        reader.readAsDataURL(file);
    };

    return (
        <>
            {/* 选择框 */}
            {!file && (
                <div
                    onClick = {trigger}
                    className = "border-2 border-dashed border-blue-400 rounded-lg p-8 flex flex-col items-center gap-3 text-gray-600 cursor-pointer hover:bg-blue-50 transition"
                >
                    <ArrowUpTrayIcon className = "h-10 w-10 text-blue-500"/>
                    <p>Click or drag the file here (single file ≤ {maxSize} MB)</p>
                    <input
                        ref = {inputRef}
                        type = "file"
                        accept = "image/*,video/*,audio/*"
                        className = "hidden"
                        onChange = {handleSelect}
                        multiple = {multiple}
                    />
                </div>
            )}

            {/* 预览 */}
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
                        <img src = {preview} alt = "Preview" className = "w-40 h-28 object-cover rounded"/>
                    ) : (
                        <p className = "text-xs text-gray-500">
                            {file.type.startsWith('video') ? 'Video files' : file.type.startsWith('audio') ? 'Audio files' : 'Unable to preview'}
                        </p>
                    )}
                </div>
            )}

            {/* 分析按钮 */}
            {file && (
                <button
                    onClick = {handleAnalyse}
                    disabled = {loading}
                    className = {`mt-4 w-full ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white py-2 rounded-lg transition`}
                >
                    {loading ? 'PROCESSING…' : 'Start Analysis'}
                </button>
            )}

            <ErrorModal message = {error} onClose = {() => setError('')}/>
        </>
    );
}
