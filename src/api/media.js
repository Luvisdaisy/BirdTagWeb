// 公共媒体 API 封装
import axios from 'axios';

export const BASE = import.meta.env.VITE_API_BASE

/* 更新标签 */
export const updateTagsApi = (id, tags, operation = 'replace') =>
    axios.post(`${BASE}/update-tags`, {id, operation, tags})
        .then((r) => r.data);

/* 删除文件 /thumbnail  */
export const deleteMedia = (processed_url) =>
    axios.post(`${BASE}/delete`, {processed_url})
        .then((r) => r.data);

/* 下载：图片需查原图；音/视频直接下载 */
export const downloadMedia = async (media) => {
    if (media.type === 'image') {
        const {data} = await axios.get(`${BASE}/query-by-url`, {
            params: {url: media.thumbnail_url},
        });
        return data.processed_url;
    }
    return media.file_url;
};