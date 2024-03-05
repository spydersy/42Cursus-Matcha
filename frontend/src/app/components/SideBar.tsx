'use client';

import { usePathname } from "next/navigation";
import Link from "next/link";
import clsx from 'clsx';
import HomeIcon from "../ui/icons/HomeIcon";
import MatchesIcon from "../ui/icons/MatchesIcon";
import ChatIcon from "../ui/icons/ChatIcon";
import ProfileIcon from "../ui/icons/ProfileIcon";
import NotificationsIcon from "../ui/icons/NotificationsIcon";

export default function SideBar() {
    const pathname = usePathname();
    const links = [
        { name: 'Home', href: '/home', icon: HomeIcon },
        { name: 'Matches', href: '/matches', icon: MatchesIcon },
        { name: 'Inbox', href: '/inbox', icon: ChatIcon },
        { name: 'Profile', href: '/profile', icon: ProfileIcon },
        { name: 'Notifications', href: '/notifications', icon: NotificationsIcon }
    ];

    return (
        <aside id="logo-sidebar" className="fixed px-3 py-3 top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-zinc-950 dark:border-gray-700" aria-label="Sidebar">
            {links.map((link) => {
                const LinkIcon = link.icon;
                return (
                    <Link
                        key={link.name}
                        href={link.href}
                        className="flex items-center p-4 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                        <LinkIcon active={pathname === link.href}/>
                        <span className={clsx(
                            "ms-3",
                            { 'text-yellow-300': pathname === link.href }
                        )}>{link.name}</span>
                    </Link>
                );
            })}
        </aside>
    );
}
