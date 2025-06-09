import React from 'react';
import {XMarkIcon, PlusIcon, MinusIcon} from '@heroicons/react/24/solid';

/* 选中标签 Chip，可 ± 数量或删除 */
const CountChip = ({tag, count, inc, dec, remove}) => (
    <span className = "inline-flex items-center gap-1 bg-blue-100 text-blue-700
                   px-3 py-1.5 rounded-full text-sm">
    {tag}
        <button onClick = {dec} disabled = {count <= 1} className = "hover:text-blue-900">
      <MinusIcon className = "h-4 w-4"/>
    </button>
    <span className = "font-semibold">{count}</span>
    <button onClick = {inc} className = "hover:text-blue-900">
      <PlusIcon className = "h-4 w-4"/>
    </button>
    <button onClick = {remove} className = "hover:text-red-600">
      <XMarkIcon className = "h-4 w-4"/>
    </button>
  </span>);

export default CountChip;
