"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle({ open }: { open?: boolean }) {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <button className="relative flex h-11 w-full items-center rounded-md transition-all duration-200 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-white/5">
                <div className="grid h-full w-12 place-content-center shrink-0">
                    <div className="h-4 w-4 bg-zinc-200 dark:bg-zinc-800 rounded-full animate-pulse" />
                </div>
                {open && <span className="text-sm font-medium transition-opacity duration-200">Theme</span>}
            </button>
        );
    }

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="relative flex h-11 w-full items-center rounded-md transition-all duration-200 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-zinc-200"
        >
            <div className="grid h-full w-12 place-content-center shrink-0 relative">
                <Sun className="h-4 w-4 transition-all dark:-rotate-90 dark:scale-0 dark:opacity-0" />
                <Moon className="absolute h-4 w-4 transition-all rotate-90 scale-0 opacity-0 dark:rotate-0 dark:scale-100 dark:opacity-100" />
            </div>
            {open && (
                <span className="text-sm font-medium transition-opacity duration-200">
                    {theme === "dark" ? "Light Mode" : "Dark Mode"}
                </span>
            )}
        </button>
    );
}
