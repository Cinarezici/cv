"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
    FileText,
    Import,
    LogOut,
    ChevronDown,
    ChevronsRight,
    Moon,
    Sun,
    LayoutDashboard,
    Users,
    Search,
    Settings
} from "lucide-react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
        // Force dark mode by default for that premium feel
        document.documentElement.classList.remove("dark");
    }, [isDark]);

    return (
        <div className="flex min-h-screen w-full bg-white text-zinc-900">
            <Sidebar />
            <div className="flex-1 overflow-auto">
                <TopNav isDark={isDark} setIsDark={setIsDark} />
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

    return (
        <nav
            className={`sticky top-0 h-screen shrink-0 border-r transition-all duration-300 ease-in-out ${open ? 'w-64' : 'w-16'
                } border-zinc-200 bg-white p-2 shadow-sm`}
        >
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
                    title="Import LinkedIn"
                    href="/import"
                    selected={pathname === "/import"}
                    open={open}
                />
                <Option
                    Icon={FileText}
                    title="Optimize Resume"
                    href="/resumes/new"
                    selected={pathname === "/resumes/new"}
                    open={open}
                />
                <Option
                    Icon={Search}
                    title="Scout Jobs"
                    href="/scout"
                    selected={pathname === "/scout"}
                    open={open}
                />
                <Option
                    Icon={Settings}
                    title="Settings"
                    href="/settings"
                    selected={pathname === "/settings"}
                    open={open}
                />
            </div>

            <ToggleClose open={open} setOpen={setOpen} />
        </nav>
    );
};

const Option = ({ Icon, title, href, selected, open }: any) => {
    return (
        <Link
            href={href}
            className={`relative flex h-11 w-full items-center rounded-md transition-all duration-200 ${selected
                ? "bg-indigo-50 text-indigo-600 shadow-sm border-l-2 border-indigo-600 font-semibold"
                : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                }`}
        >
            <div className="grid h-full w-12 place-content-center">
                <Icon className="h-4 w-4" />
            </div>

            {open && (
                <span
                    className={`text-sm font-medium transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0'
                        }`}
                >
                    {title}
                </span>
            )}
        </Link>
    );
};

const TitleSection = ({ open }: { open: boolean }) => {
    return (
        <div className="mb-6 border-b border-zinc-200 pb-4">
            <div className="flex cursor-pointer items-center justify-between rounded-md p-2 transition-colors hover:bg-zinc-100">
                <div className="flex items-center gap-3">
                    <Logo />
                    {open && (
                        <div className={`transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0'}`}>
                            <span className="block text-sm font-bold text-zinc-900 tracking-wider uppercase text-nowrap">
                                Interview
                            </span>
                            <span className="block text-xs text-indigo-600 font-medium">
                                READY CV
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

const ToggleClose = ({ open, setOpen }: any) => {
    const router = useRouter();

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push("/login");
    };

    return (
        <div className="absolute bottom-0 left-0 right-0 border-t border-zinc-200 bg-zinc-50/80 backdrop-blur-sm">
            <button
                onClick={handleLogout}
                className="w-full flex items-center p-3 hover:bg-zinc-100 text-red-600 transition-colors"
            >
                <div className="grid size-10 place-content-center shrink-0">
                    <LogOut className="h-4 w-4" />
                </div>
                {open && (
                    <span className="text-sm font-medium transition-opacity duration-200">
                        Sign Out
                    </span>
                )}
            </button>

            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center p-3 hover:bg-zinc-100 text-zinc-600 transition-colors"
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
        </div>
    );
};

const TopNav = ({ isDark, setIsDark }: any) => {
    return (
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 border-b border-zinc-200 bg-white/80 backdrop-blur-md text-zinc-900">
            <div></div>
            <div className="flex items-center gap-4">
                {/* Placeholder for top right actions */}
            </div>
        </header>
    );
};
