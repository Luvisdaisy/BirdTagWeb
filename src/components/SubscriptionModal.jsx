import React, {useState} from "react";
import axios from "axios";
import {XMarkIcon} from "@heroicons/react/24/solid";
import {useToast} from "../contexts/ToastContext";

const API_BASE = import.meta.env.VITE_API_BASE;

/* 默认 7 个鸟类 */
const TOPICS = [
    "Crow",
    "Kingfisher",
    "Myna",
    "Owl",
    "Peacocks",
    "Pigeon",
    "Sparrow",
];

export default function SubscriptionModal({onClose}) {
    const {showToast} = useToast();
    const [tag, setTag] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    /* 提交订阅 */
    const handleSubscribe = async () => {
        if (!email || !tag) {
            return showToast("PLEASE SELECT BIRDS AND FILL IN YOUR EMAIL ADDRESS", "error");
        }
        setLoading(true);
        try {
            await axios.post(`${API_BASE}/subscribe`, {email, tag});
            showToast("CONFIRMATION EMAIL HAS BEEN SENT PLEASE CHECK IT", "success");
            onClose();
        } catch {
            showToast("SUBSCRIPTION FAILED PLEASE TRY AGAIN LATER", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className = "fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className = "relative w-full max-w-md rounded-lg bg-white p-6">
                {/* 关闭 */}
                <button className = "absolute top-3 right-3" onClick = {onClose}>
                    <XMarkIcon className = "h-6 w-6 text-gray-500"/>
                </button>

                <h3 className = "text-lg font-semibold mb-4">Subscribe to Bird Tag Notification</h3>

                {/* 选择标签 */}
                <label className = "block mb-2 text-sm font-medium">Select bird tag</label>
                <select
                    value = {tag}
                    onChange = {(e) => setTag(e.target.value.toLowerCase())}
                    className = "w-full mb-4 px-3 py-2 border rounded-lg"
                >
                    <option value = "">Please select…</option>
                    {TOPICS.map((t) => (
                        <option key = {t} value = {t}>
                            {t}
                        </option>
                    ))}
                </select>

                {/* 邮箱输入 */}
                <label className = "block mb-2 text-sm font-medium">Email address</label>
                <input
                    type = "email"
                    value = {email}
                    onChange = {(e) => setEmail(e.target.value)}
                    placeholder = "you@example.com"
                    className = "w-full mb-6 px-3 py-2 border rounded-lg"
                />

                {/* 提交 */}
                <button
                    disabled = {loading}
                    onClick = {handleSubscribe}
                    className = "w-full rounded-lg bg-blue-600 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? "Submitting..." : "SUBSCRIBE"}
                </button>
            </div>
        </div>
    );
}
