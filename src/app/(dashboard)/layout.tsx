"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
    FileText,
    Import,
    LogOut,
    ChevronsRight,
    LayoutDashboard,
    Search,
    Star,
    Settings,
    Sparkles,
    LayoutGrid,
    Zap,
} from "lucide-react";
import { usePro } from "@/hooks/usePro";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen w-full bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
            <Sidebar />
            <div className="flex-1 overflow-auto">
                <main className="p-6 max-w-7xl mx-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}

const Sidebar = () => {
    const [open, setOpen] = useState(true);
    const pathname = usePathname();
    const { status } = usePro();

    return (
        <nav
            className={`sticky top-0 h-screen shrink-0 border-r transition-all duration-300 ease-in-out ${open ? 'w-64' : 'w-16'
                } border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-950 flex flex-col shadow-sm`}
        >
            <div className="flex-1 overflow-y-auto p-2">
                <TitleSection open={open} />

                <div className="space-y-1 mb-8">
                    <Option
                        Icon={LayoutDashboard}
                        title="Dashboard"
                        href="/dashboard"
                        selected={pathname === "/dashboard"}
                        open={open}
                    />
                    <Option
                        Icon={Import}
                        title="Import CV"
                        href="/import"
                        selected={pathname === "/import"}
                        open={open}
                    />
                    {/* MY CVs — new item between Import and CV Optimize */}
                    <Option
                        Icon={LayoutGrid}
                        title="My CVs"
                        href="/my-cvs"
                        selected={pathname === "/my-cvs"}
                        open={open}
                    />
                    <Option
                        Icon={FileText}
                        title="CV Optimizer"
                        href="/resumes/new"
                        selected={pathname === "/resumes/new"}
                        open={open}
                    />
                    <Option
                        Icon={Search}
                        title="Search Jobs"
                        href="/scout"
                        selected={pathname === "/scout"}
                        open={open}
                        variant="blue"
                    />
                    <Option
                        Icon={Star}
                        title="Saved Jobs ⭐"
                        href="/saved-jobs"
                        selected={pathname === "/saved-jobs"}
                        open={open}
                    />
                    <Option
                        Icon={Sparkles}
                        title="My Letters"
                        href="/motivation-letters"
                        selected={pathname === "/motivation-letters"}
                        open={open}
                    />
                    {/* UPGRADE PLAN — only show if NOT active (so trialing or free sees it) */}
                    {status !== 'active' && (
                        <UpgradeOption open={open} selected={pathname === "/upgrade"} />
                    )}
                    <Option
                        Icon={Settings}
                        title="Settings"
                        href="/settings"
                        selected={pathname === "/settings"}
                        open={open}
                    />
                </div>
            </div>

            <div className="border-t border-zinc-200 dark:border-white/10 bg-zinc-50/80 dark:bg-white/5 backdrop-blur-sm">
                <ThemeToggle open={open} />
                <ToggleClose open={open} setOpen={setOpen} />
            </div>
        </nav>
    );
};

const Option = ({ Icon, title, href, selected, open, variant }: { Icon: any, title: string, href: string, selected: boolean, open: boolean, variant?: "blue" }) => {
    const isBlue = variant === "blue";

    return (
        <Link
            href={href}
            className={`relative flex h-11 w-full items-center rounded-md transition-all duration-200 ${selected
                ? isBlue ? "bg-indigo-50 text-indigo-700 dark:bg-blue-500/10 dark:text-blue-400 shadow-sm border-l-2 border-indigo-600 dark:border-blue-500 font-semibold" : "bg-indigo-50 text-indigo-600 dark:bg-blue-500/10 dark:text-blue-400 shadow-sm border-l-2 border-indigo-600 dark:border-blue-500 font-semibold"
                : isBlue ? "text-indigo-600 dark:text-blue-400 hover:bg-indigo-50 dark:hover:bg-white/5 hover:text-indigo-700 dark:hover:text-blue-300 font-semibold" : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-zinc-200"
                }`}
        >
            <div className="grid h-full w-12 place-content-center">
                <Icon className={`h-4 w-4 ${isBlue && !selected ? "text-indigo-600" : ""}`} />
            </div>

            {open && (
                <span
                    className={`text-sm font-medium transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0'
                        } ${isBlue ? "font-semibold" : ""}`}
                >
                    {title}
                </span>
            )}
        </Link>
    );
};

const UpgradeOption = ({ open, selected }: { open: boolean; selected: boolean }) => {
    return (
        <Link
            href="/upgrade"
            className={`relative flex h-11 w-full items-center rounded-md transition-all duration-200 ${selected
                ? "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 shadow-sm border-l-2 border-amber-500 font-semibold"
                : "text-amber-600 hover:bg-amber-50 dark:hover:bg-white/5 hover:text-amber-700 dark:hover:text-amber-300"
                }`}
        >
            <div className="grid h-full w-12 place-content-center">
                <Zap className="h-4 w-4" />
            </div>
            {open && (
                <span className="text-sm font-semibold transition-opacity duration-200 opacity-100">
                    Upgrade Plan
                </span>
            )}
        </Link>
    );
};

const TitleSection = ({ open }: { open: boolean }) => {
    return (
        <div className="mb-6 border-b border-zinc-200 dark:border-white/10 pb-4">
            <div className="flex cursor-pointer items-center justify-between rounded-md p-2 transition-colors hover:bg-zinc-100 dark:hover:bg-white/5">
                <div className="flex items-center gap-3">
                    <Logo />
                    {open && (
                        <div className={`transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0'}`}>
                            <span className="block text-sm font-bold text-zinc-900 dark:text-zinc-100 tracking-wider uppercase text-nowrap">
                                CV Optimizer AI
                            </span>
                            <span className="block text-xs text-indigo-600 dark:text-blue-400 font-medium">
                                Interview Ready
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const Logo = () => {
    return (
        <div className="grid size-10 shrink-0 place-content-center rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-sm">
            <FileText className="text-white h-5 w-5" />
        </div>
    );
};

const ToggleClose = ({ open, setOpen }: { open: boolean, setOpen: (open: boolean) => void }) => {
    return (
        <>
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center p-3 hover:bg-zinc-100 dark:hover:bg-white/5 text-zinc-600 dark:text-zinc-400 transition-colors"
            >
                <div className="grid size-10 place-content-center shrink-0">
                    <ChevronsRight
                        className={`h-4 w-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                    />
                </div>
                {open && (
                    <span className="text-sm font-medium transition-opacity duration-200">
                        Collapse
                    </span>
                )}
            </button>
        </>
    );
};
