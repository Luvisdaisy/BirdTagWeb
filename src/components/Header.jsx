import React, {useState} from "react";
import {Link} from "react-router-dom";
import SubscriptionModal from "./SubscriptionModal";
import LogoutButton from "./LogoutButton"; // 保留登出按钮

export default function Header() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <header className = "bg-blue-500 shadow">
                <div className = "max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                    {/* 左侧 Logo / 首页链接 */}
                    <Link to = "/" className = "text-xl font-semibold text-blue-700">
                        Bird Media Portal
                    </Link>

                    {/* 右侧按钮区域 */}
                    <div className = "flex items-center gap-4">
                        {/* 订阅按钮 */}
                        <button
                            onClick = {() => setOpen(true)}
                            className = "inline-flex items-center gap-1 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 shadow hover:bg-blue-100 transition"
                        >
                            Subscribe Notification
                        </button>

                        {/* LogoutButton 保留 */}
                        <LogoutButton/>
                    </div>
                </div>
            </header>

            {/* 订阅弹窗 */}
            {open && <SubscriptionModal onClose = {() => setOpen(false)}/>}
        </>
    );
}
