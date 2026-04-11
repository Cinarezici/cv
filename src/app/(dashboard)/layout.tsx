"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
    FileText,
    Import,
    ChevronsRight,
    LayoutDashboard,
    Search,
    Star,
    Settings,
    Sparkles,
    LayoutGrid,
    Zap,
    ScanLine,
    Menu,
    Sun,
    Moon,
    X,
    Gift,
} from "lucide-react";
import { usePro } from "@/hooks/usePro";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useLang } from "@/lib/i18n";
import { TrialExpiredModal } from "@/components/TrialExpiredModal";
import { UpsellBanner } from "@/components/dashboard/UpsellBanner";
import { OnboardingChecklist } from "@/components/dashboard/OnboardingChecklist";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen w-full bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
            {/* Feature 2: Annual Plan Upsell Banner */}
            <UpsellBanner />
            
            <div className="flex flex-1 w-full bg-white dark:bg-zinc-950">
                {/* Desktop sidebar — hidden on mobile */}
                <div className="hidden md:flex">
                    <Sidebar />
                </div>

                {/* Mobile top bar + sliding drawer */}
                <MobileNav />

                <div className="flex-1 overflow-auto">
                    <main className="p-4 md:p-6 max-w-7xl mx-auto pt-[72px] md:pt-6">
                        {children}
                    </main>
                </div>
            </div>

            {/* Global trial-expired modal — listens for 'trial-expired' event */}
            <TrialExpiredModal />

            {/* Feature 6: Onboarding Checklist Widget */}
            <OnboardingChecklist />
        </div>
    );
}

/* ─── Desktop Sidebar ─────────────────────────────────────────── */
const Sidebar = () => {
    const [open, setOpen] = useState(true);
    const pathname = usePathname();
    const { status, plan } = usePro();

    return (
        <nav
            className={`sticky top-0 h-screen shrink-0 border-r transition-all duration-300 ease-in-out ${open ? "w-64" : "w-16"
                } border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-950 flex flex-col shadow-sm`}
        >
            <div className="flex-1 overflow-y-auto p-2">
                <TitleSection open={open} />
                <div className="space-y-1 mb-8">
                    <NavItems pathname={pathname} open={open} status={status} plan={plan} />
                </div>
            </div>
            <div className="border-t border-zinc-200 dark:border-white/10 bg-zinc-50/80 dark:bg-white/5 backdrop-blur-sm">
                <ThemeToggle open={open} />
                <ToggleClose open={open} setOpen={setOpen} />
            </div>
        </nav>
    );
};

/* ─── Mobile Navigation ───────────────────────────────────────── */
const MobileNav = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const pathname = usePathname();
    const { status, plan } = usePro();

    // Close drawer on route change
    useEffect(() => {
        setDrawerOpen(false);
    }, [pathname]);

    // Prevent body scroll when drawer open
    useEffect(() => {
        document.body.style.overflow = drawerOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [drawerOpen]);

    return (
        <>
            {/* Fixed top bar */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-40 h-14 flex items-center justify-between px-4 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-white/10 shadow-sm">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <div className="grid size-8 shrink-0 place-content-center rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-sm">
                        <FileText className="text-white h-4 w-4" />
                    </div>
                    <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 tracking-wide uppercase">
                        CV Optimizer AI
                    </span>
                </Link>

                <div className="flex items-center gap-1">
                    <ThemeToggleMini />
                    <button
                        onClick={() => setDrawerOpen(true)}
                        className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-white/5 text-zinc-600 dark:text-zinc-400 transition-colors"
                        aria-label="Open menu"
                    >
                        <Menu className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Backdrop */}
            {drawerOpen && (
                <div
                    className="md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
                    onClick={() => setDrawerOpen(false)}
                />
            )}

            {/* Slide-in drawer */}
            <div
                className={`md:hidden fixed top-0 left-0 z-50 h-full w-[280px] bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-white/10 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${drawerOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                {/* Drawer header */}
                <div className="flex items-center justify-between px-4 h-14 border-b border-zinc-100 dark:border-white/10 shrink-0">
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <div className="grid size-8 shrink-0 place-content-center rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-sm">
                            <FileText className="text-white h-4 w-4" />
                        </div>
                        <div>
                            <span className="block text-sm font-bold text-zinc-900 dark:text-zinc-100 tracking-wide uppercase">
                                CV Optimizer AI
                            </span>
                            <span className="block text-[10px] text-indigo-600 dark:text-blue-400 font-medium leading-none">
                                Interview Ready
                            </span>
                        </div>
                    </Link>
                    <button
                        onClick={() => setDrawerOpen(false)}
                        className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-white/5 text-zinc-500 dark:text-zinc-400"
                        aria-label="Close menu"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Nav items */}
                <div className="flex-1 overflow-y-auto p-3 space-y-1">
                    <NavItems pathname={pathname} open={true} status={status} plan={plan} />
                </div>

                {/* Bottom: theme toggle */}
                <div className="border-t border-zinc-200 dark:border-white/10 bg-zinc-50/80 dark:bg-white/5 p-1">
                    <ThemeToggle open={true} />
                </div>
            </div>
        </>
    );
};

/* ─── Compact theme toggle for mobile top bar ─────────────────── */
function ThemeToggleMini() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    if (!mounted) return <div className="w-9 h-9" />;

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-white/5 text-zinc-600 dark:text-zinc-400 transition-colors"
            aria-label="Toggle theme"
        >
            {theme === "dark" ? (
                <Sun className="h-5 w-5" />
            ) : (
                <Moon className="h-5 w-5" />
            )}
        </button>
    );
}

/* ─── Shared nav items ────────────────────────────────────────── */
function NavItems({
    pathname,
    open,
    status,
    plan,
}: {
    pathname: string;
    open: boolean;
    status: string | null;
    plan: string | null;
}) {
    const { t } = useLang();

    const isLifetime = plan === 'lifetime_onetime';
    const isTrialing = status === 'trialing';
    const isActive = status === 'active';

    return (
        <>
            <Option Icon={LayoutDashboard} title={t.dashboard} href="/dashboard" selected={pathname === "/dashboard"} open={open} />
            <Option Icon={Import} title={t.importCV} href="/import" selected={pathname === "/import"} open={open} />
            <Option Icon={ScanLine} title={t.atsScanner} href="/ats-scanner" selected={pathname === "/ats-scanner"} open={open} />
            <Option Icon={Gift} title="Refer Friends" href="/referrals" selected={pathname === "/referrals"} open={open} variant="blue" />
            <Option Icon={LayoutGrid} title={t.myCVs} href="/my-cvs" selected={pathname === "/my-cvs"} open={open} />
            <Option Icon={FileText} title={t.cvOptimizer} href="/resumes/new" selected={pathname === "/resumes/new"} open={open} />
            <Option Icon={Search} title={t.searchJobs} href="/scout" selected={pathname === "/scout"} open={open} variant="blue" />
            <Option Icon={Star} title={t.savedJobs} href="/saved-jobs" selected={pathname === "/saved-jobs"} open={open} />
            <Option Icon={Sparkles} title={t.myLetters} href="/motivation-letters" selected={pathname === "/motivation-letters"} open={open} />
            {/* Show Upgrade Plan only for "trialing" users; hide for "active" or "lifetime" */}
            {isTrialing && !isLifetime && !isActive && (
                <UpgradeOption open={open} selected={pathname === "/upgrade"} />
            )}
            <Option Icon={Settings} title={t.settings} href="/settings" selected={pathname === "/settings"} open={open} />
        </>
    );
}

/* ─── Nav option ──────────────────────────────────────────────── */
const Option = ({
    Icon,
    title,
    href,
    selected,
    open,
    variant,
}: {
    Icon: React.ElementType;
    title: string;
    href: string;
    selected: boolean;
    open: boolean;
    variant?: "blue";
}) => {
    const isBlue = variant === "blue";
    return (
        <Link
            href={href}
            className={`relative flex h-11 w-full items-center rounded-md transition-all duration-200 ${selected
                ? "bg-indigo-50 text-indigo-600 dark:bg-blue-500/10 dark:text-blue-400 shadow-sm border-l-2 border-indigo-600 dark:border-blue-500 font-semibold"
                : isBlue
                    ? "text-indigo-600 dark:text-blue-400 hover:bg-indigo-50 dark:hover:bg-white/5 hover:text-indigo-700 dark:hover:text-blue-300 font-semibold"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-zinc-200"
                }`}
        >
            <div className="grid h-full w-12 place-content-center">
                <Icon className={`h-4 w-4 ${isBlue && !selected ? "text-indigo-600" : ""}`} />
            </div>
            {open && (
                <span className={`text-sm font-medium ${isBlue ? "font-semibold" : ""}`}>
                    {title}
                </span>
            )}
        </Link>
    );
};

/* ─── Upgrade option ──────────────────────────────────────────── */
const UpgradeOption = ({ open, selected }: { open: boolean; selected: boolean }) => {
    const { t } = useLang();
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
            {open && <span className="text-sm font-semibold">{t.upgradePlan}</span>}
        </Link>
    );
};

/* ─── Title section ───────────────────────────────────────────── */
const TitleSection = ({ open }: { open: boolean }) => (
    <div className="mb-6 border-b border-zinc-200 dark:border-white/10 pb-4">
        <Link
            href="/dashboard"
            className="flex items-center justify-between rounded-md p-2 transition-colors hover:bg-zinc-100 dark:hover:bg-white/5"
        >
            <div className="flex items-center gap-3">
                <Logo />
                {open && (
                    <div>
                        <span className="block text-sm font-bold text-zinc-900 dark:text-zinc-100 tracking-wider uppercase text-nowrap">
                            CV Optimizer AI
                        </span>
                        <span className="block text-xs text-indigo-600 dark:text-blue-400 font-medium">
                            Interview Ready
                        </span>
                    </div>
                )}
            </div>
        </Link>
    </div>
);

const Logo = () => (
    <div className="grid size-10 shrink-0 place-content-center rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-sm">
        <FileText className="text-white h-5 w-5" />
    </div>
);

const ToggleClose = ({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) => {
    const { t } = useLang();
    return (
        <button
            onClick={() => setOpen(!open)}
            className="w-full flex items-center p-3 hover:bg-zinc-100 dark:hover:bg-white/5 text-zinc-600 dark:text-zinc-400 transition-colors"
        >
            <div className="grid size-10 place-content-center shrink-0">
                <ChevronsRight className={`h-4 w-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
            </div>
            {open && <span className="text-sm font-medium">{t.collapse}</span>}
        </button>
    );
};
