import React, {useState} from 'react';

/* 左侧 30 % 宽，带搜索框，标签 4 列网格 */
const TagCountSidebar = ({allTags, selected, toggle}) => {
    const [filter, setFilter] = useState('');
    const shown = allTags.filter((t) =>
        t.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <aside className = "basis-1/3 max-w-[30%] h-[calc(100vh-6rem)]
                       bg-gray-100 flex flex-col px-4 py-5 overflow-y-auto">


            {/* 过滤输入 */}
            <input
                value = {filter}
                onChange = {(e) => setFilter(e.target.value)}
                placeholder = "Search Tags"
                className = "mb-4 w-full px-3 py-2 text-sm rounded-lg border focus:ring-2 focus:ring-blue-300"
            />

            {/* 标签按钮 4 列同宽 */}
            <div className = "flex flex-wrap gap-3">
                {shown.map((t) => {
                    const active = t in selected;
                    return (
                        <button
                            key = {t}
                            onClick = {() => toggle(t)}
                            className = {`basis-1/4 h-9 rounded-lg text-sm flex items-center justify-center
                          transition ${
                                active
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                            }`}
                        >
                            {t}
                        </button>
                    );
                })}
                {shown.length === 0 && (
                    <p className = "text-xs text-gray-500">No matching tags</p>
                )}
            </div>
        </aside>
    );
};

export default TagCountSidebar;
