/* src/components/TagPickerInline.jsx */
import React, {useState} from 'react';
import {XMarkIcon} from '@heroicons/react/24/solid';

export default function TagPickerInline({tags = [], selected = [], toggle}) {
    const [filter, setFilter] = useState('');
    const shown = tags.filter(t =>
        t.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className = "w-full flex flex-col items-center">
            {/* 输入框 */}
            <input
                value = {filter}
                onChange = {e => setFilter(e.target.value)}
                placeholder = "Search Tags"
                className = "w-full max-w-sm mb-6 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-300"
            />

            {/* 标签网格 */}
            <div className = "flex flex-wrap justify-center gap-3 max-w-4xl">
                {shown.map(t => {
                    const active = selected.includes(t);
                    return (
                        <button
                            key = {t}
                            onClick = {() => toggle(t)}
                            className = {`relative h-9 px-4 rounded-lg text-sm font-medium transition
                ${active
                                ? 'bg-blue-500 text-white'
                                : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}
                        >
                            {t}
                            {active && (
                                <XMarkIcon
                                    className = "absolute -top-1.5 -right-1.5 h-4 w-4 p-0.5 bg-white
                    rounded-full shadow text-blue-500 hover:text-red-600"
                                    onClick = {e => {
                                        e.stopPropagation();
                                        toggle(t);
                                    }}
                                />
                            )}
                        </button>
                    );
                })}
                {shown.length === 0 && (
                    <p className = "text-xs text-gray-500">No matching tags</p>
                )}
            </div>
        </div>
    );
}
