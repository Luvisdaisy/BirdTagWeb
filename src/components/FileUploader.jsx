import React, {useState, useRef} from 'react';
import axios from 'axios';
import {useToast} from '../contexts/ToastContext';
import ErrorModal from './ErrorModal';
import {CloudArrowUpIcon, XMarkIcon} from '@heroicons/react/24/solid';

const MAX_SIZE = 20 * 1024 * 1024; // 20 MB

const FileUploader = () => {
    const [files, setFiles] = useState([]);     // [{file, id}]
    const [progress, setProg] = useState({});     // id → %
    const [error, setError] = useState('');
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const {showToast} = useToast();
    const inputRef = useRef();

    /* ========== 工具函数 ========== */
    const addFiles = (list) => {
        const newList = [];
        list.forEach((f) => {
            if (f.size > MAX_SIZE) {
                setError(`文件 ${f.name} 超过 20 MB 限制，已忽略`);
            } else {
                newList.push({file: f, id: crypto.randomUUID()});
            }
        });
        setFiles((prev) => [...prev, ...newList]);
        setProg({});
    };

    /* ========== 选择 / 拖拽处理 ========== */
    const handleSelect = (e) => {
        addFiles(Array.from(e.target.files));
        e.target.value = '';
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
        else if (e.type === 'dragleave') setDragActive(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            addFiles(Array.from(e.dataTransfer.files));
            e.dataTransfer.clearData();
        }
    };

    /* ========== 单文件移除 ========== */
    const removeFile = (id) => {
        setFiles((prev) => prev.filter((f) => f.id !== id));
        setProg((p) => {
            const copy = {...p};
            delete copy[id];
            return copy;
        });
    };

    /* ========== 上传 ========== */
    const uploadAll = async () => {
        if (!files.length) return;
        setUploading(true);

        try {
            for (const {file, id} of files) {
                const {data} = await axios.get('https://0bltz7gw14.execute-api.us-east-1.amazonaws.com/Test', {
                    params: {filename: file.name, type: file.type},
                });

                await axios.put(data.url, file, {
                    headers: {'Content-Type': file.type},
                    onUploadProgress: (e) =>
                        setProg((p) => ({
                            ...p,
                            [id]: Math.round((e.loaded * 100) / e.total),
                        })),
                });
            }
            showToast('所有文件上传成功！', 'success');
            setFiles([]);
            setProg({});
        } catch (err) {
            setError(err.message || '上传失败');
        } finally {
            setUploading(false);
        }
    };

    /* ========== 组件渲染 ========== */
    return (
        <>
            {/* 拖拽 / 点击区域 */}
            <div
                className = {`border-2 border-dashed rounded-lg p-6 flex flex-col items-center gap-4
                    text-gray-600 cursor-pointer transition
                    ${dragActive ? 'border-blue-600 bg-blue-50' : 'border-blue-400'}`}
                onClick = {() => inputRef.current?.click()}
                onDragEnter = {handleDrag}
                onDragOver = {handleDrag}
                onDragLeave = {handleDrag}
                onDrop = {handleDrop}
            >
                <CloudArrowUpIcon className = "h-10 w-10 text-blue-500"/>
                <p>点击或拖拽文件到此处上传（≤20 MB）</p>
                <input
                    ref = {inputRef}
                    type = "file"
                    multiple
                    className = "hidden"
                    onChange = {handleSelect}
                    accept = "image/*,video/*,audio/*"
                />
            </div>

            {/* 文件列表 */}
            {files.length > 0 && (
                <ul className = "mt-4 space-y-2">
                    {files.map(({file, id}) => (
                        <li
                            key = {id}
                            className = "flex items-center justify-between text-sm bg-white rounded
                         border px-3 py-2 shadow-sm"
                        >
                            <div className = "flex-1 pr-2 truncate">{file.name}</div>
                            <div className = "text-xs text-gray-500 w-14 text-right">
                                {progress[id] ? `${progress[id]}%` : ''}
                            </div>
                            <button
                                onClick = {() => removeFile(id)}
                                className = "ml-3 text-gray-400 hover:text-red-500"
                                disabled = {uploading}
                            >
                                <XMarkIcon className = "h-4 w-4"/>
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {/* 上传按钮 */}
            <button
                disabled = {uploading || !files.length}
                onClick = {uploadAll}
                className = {`mt-4 w-full ${
                    uploading || !files.length
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                } text-white py-2 rounded-lg transition`}
            >
                {uploading ? '上传中...' : '开始上传'}
            </button>

            <ErrorModal message = {error} onClose = {() => setError('')}/>
        </>
    );
};

export default FileUploader;
