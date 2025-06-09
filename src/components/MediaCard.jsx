import React, {useState} from 'react';
import {
    PencilSquareIcon,
    XMarkIcon,
    PlusIcon,
    ArrowDownTrayIcon,
    TrashIcon,
} from '@heroicons/react/24/solid';

/**
 * MediaCard
 * Props:
 *  - media: {
 *      id: string,
 *      type: 'image' | 'video' | 'audio',
 *      thumbnail_url?: string,
 *      file_url: string,
 *      tags: string[]
 *    }
 *  - onUpdateTags(newTags: string[]) => Promise<void>
 *  - onDelete() => Promise<void>
 */
const MediaCard = ({media, onUpdateTags, onDelete}) => {
    const [edit, setEdit] = useState(false);
    const [tags, setTags] = useState(media.tags);
    const [input, setInput] = useState('');
    const [saving, setSaving] = useState(false);
    const [err, setErr] = useState('');

    const addTag = () => {
        const t = input.trim();
        if (t && !tags.includes(t)) setTags([...tags, t]);
        setInput('');
    };

    const removeTag = (t) => setTags(tags.filter((x) => x !== t));

    const saveTags = async () => {
        try {
            setSaving(true);
            await onUpdateTags(tags);
            setEdit(false);
        } catch (e) {
            setErr(e.message || '保存失败');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className = "border rounded-lg shadow p-4 space-y-3 bg-white">
            {/* 媒体预览 */}
            {media.type === 'image' ? (
                <img src = {media.thumbnail_url ?? media.file_url} alt = "thumb"
                     className = "w-full h-48 object-cover rounded"/>
            ) : media.type === 'video' ? (
                <video src = {media.file_url} controls className = "w-full h-48 rounded bg-black"/>
            ) : (
                <audio src = {media.file_url} controls className = "w-full"/>
            )}

            {/* 标签区 */}
            <div className = "flex flex-wrap gap-2 items-start">
                {tags.map((t) => (
                    <span key = {t}
                          className = "inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">
            {t}
                        {edit && (
                            <button onClick = {() => removeTag(t)} className = "hover:text-red-600">
                                <XMarkIcon className = "h-3 w-3"/>
                            </button>
                        )}
          </span>
                ))}
                {edit && (
                    <div className = "flex items-center gap-1 text-xs">
                        <input
                            value = {input}
                            onChange = {(e) => setInput(e.target.value)}
                            onKeyDown = {(e) => e.key === 'Enter' && addTag()}
                            className = "border rounded px-1 py-0.5 w-24"
                            placeholder = "新标签"
                        />
                        <button onClick = {addTag} className = "text-green-600 hover:text-green-800">
                            <PlusIcon className = "h-4 w-4"/>
                        </button>
                    </div>
                )}
            </div>

            {/* 操作按钮 */}
            <div className = "flex justify-between items-center pt-2 border-t">
                <div className = "flex gap-2">
                    {!edit ? (
                        <button onClick = {() => setEdit(true)}
                                className = "flex items-center gap-1 text-sm text-blue-600 hover:underline">
                            <PencilSquareIcon className = "h-4 w-4"/> 编辑标签
                        </button>
                    ) : (
                        <>
                            <button onClick = {saveTags} disabled = {saving}
                                    className = "text-sm text-green-600 hover:underline">
                                保存
                            </button>
                            <button onClick = {() => {
                                setEdit(false);
                                setTags(media.tags);
                            }} className = "text-sm text-gray-500 hover:underline">
                                取消
                            </button>
                        </>
                    )}
                </div>
                <div className = "flex gap-2">
                    <a
                        href = {media.file_url}
                        download
                        className = "text-blue-600 hover:text-blue-800"
                        title = "下载"
                    >
                        <ArrowDownTrayIcon className = "h-5 w-5"/>
                    </a>
                    <button onClick = {onDelete} className = "text-red-600 hover:text-red-800" title = "删除">
                        <TrashIcon className = "h-5 w-5"/>
                    </button>
                </div>
            </div>

            {err && <p className = "text-xs text-red-600 mt-1">{err}</p>}
        </div>
    );
};

export default MediaCard;
