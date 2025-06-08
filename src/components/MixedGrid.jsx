/* src/components/MixedGrid.jsx */
import React from 'react';
import {VideoCameraIcon, MusicalNoteIcon} from '@heroicons/react/24/solid';

const MixedGrid = ({list = []}) => (
    <div className = "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
        {list.map((item) => (
            <div key = {item.id} className = "border rounded shadow-sm p-1">
                {item.type === 'image' ? (
                    <a href = {item.original} target = "_blank" rel = "noreferrer">
                        <img src = {item.thumb} alt = "" className = "w-full h-32 object-cover"/>
                    </a>
                ) : (
                    <div className = "w-full h-32 flex flex-col items-center justify-center bg-gray-100">
                        {item.type === 'video' ? (
                            <VideoCameraIcon className = "h-8 w-8 text-gray-500"/>
                        ) : (
                            <MusicalNoteIcon className = "h-8 w-8 text-gray-500"/>
                        )}
                        <a
                            href = {item.download}
                            className = "text-xs text-blue-600 hover:underline mt-1"
                            download
                        >
                            下载
                        </a>
                    </div>
                )}
            </div>
        ))}
    </div>
);

export default MixedGrid;
