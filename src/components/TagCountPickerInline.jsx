/* src/components/TagCountPickerInline.jsx */
import React, {useState} from 'react';

export default function TagCountPickerInline({allTags = [], selected = {}, toggle}) {
    const [filter, setFilter] = useState('');
    const shown = allTags.filter(t => t.toLowerCase().includes(filter.toLowerCase()));

    return (
        <div className = "w-full flex flex-col items-center">
            {/* 搜索框 */}
            <input
                value = {filter}
                onChange = {e => setFilter(e.target.value)}
                placeholder = "Search Tags"
                className = "w-full max-w-sm mb-6 px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-300 text-sm"
            />

            {/* 标签按钮网格 */}
            <div className = "flex flex-wrap justify-center gap-3 max-w-4xl">
                {shown.map(t => {
                    const active = t in selected;
                    return (
                        <button
                            key = {t}
                            onClick = {() => toggle(t)}
                            className = {`basis-1/5 h-9 rounded-lg text-sm font-medium transition
                ${active
                                ? 'bg-blue-500 text-white'
                                : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}
                        >
                            {t}
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
