// src/api/media.js
// 公共 API 封装：更新标签 / 删除文件
// ------------------------------------------------------------
import axios from 'axios';

const BASE = import.meta.env.VITE_API_BASE || ''; // 可在 .env 配置，如 https://xyz.execute-api.us-east-1.amazonaws.com/prod

// 更新标签
// id         : 文件唯一 ID 或 object_key，由后端定义
// newTags    : string[]   完整标签数组（或增量）
// operation  : 'add' | 'remove' | 'replace'  —— 不同业务场景可用
export async function updateTagsApi(id, newTags, operation = 'replace') {
    const body = {id, tags: newTags, operation};
    await axios.post(`${BASE}/api/update-tags`, body);
    // 后端若返回新标签，可直接 return res.data
}

// 删除文件
export async function deleteApi(id) {
    await axios.post(`${BASE}/api/delete-file`, {id});
}
