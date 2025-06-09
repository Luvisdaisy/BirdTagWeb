import React, {useState} from 'react';
import {XMarkIcon} from '@heroicons/react/24/solid';

const TagSidebar = ({tags = [], selected = [], toggle}) => {
    const [filter, setFilter] = useState('');

    /* 过滤后标签 */
    const shown = tags.filter((t) =>
        t.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <aside
            className = "basis-1/4 max-w-[30%] h-[calc(100vh-6rem)]
                 flex flex-col bg-gray-100 px-4 py-5 overflow-y-auto"
        >


            {/* 搜索框 */}
            <input
                value = {filter}
                onChange = {(e) => setFilter(e.target.value)}
                placeholder = "搜索标签"
                className = "w-full mb-4 px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-300 text-sm"
            />

            {/* 标签区域（flex-wrap，每行4个） */}
            <div className = "flex flex-wrap gap-3">
                {shown.map((t) => {
                    const active = selected.includes(t);
                    return (
                        <button
                            key = {t}
                            onClick = {() => toggle(t)}
                            className = {`relative flex justify-center items-center basis-1/4 h-9
                          rounded-lg text-sm font-medium transition-colors
                          ${
                                active
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                            }`}
                        >
                            {t}
                            {active && (
                                <XMarkIcon
                                    className = "absolute -top-1.5 -right-1.5 h-4 w-4 p-0.5 bg-white
                             rounded-full shadow text-blue-500 hover:text-red-600"
                                    onClick = {(e) => {
                                        e.stopPropagation();
                                        toggle(t);
                                    }}
                                />
                            )}
                        </button>
                    );
                })}
                {shown.length === 0 && (
                    <p className = "text-xs text-gray-500">无匹配标签</p>
                )}
            </div>
        </aside>
    );
};

export default TagSidebar;
