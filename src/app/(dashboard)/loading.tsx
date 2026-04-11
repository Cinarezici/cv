import { Loader2 } from "lucide-react";

export default function DashboardLoading() {
    return (
        <div className="flex-1 w-full h-[calc(100vh-100px)] flex flex-col items-center justify-center p-8 animate-in fade-in duration-500">
            <div className="w-16 h-16 bg-blue-50 dark:bg-white/5 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-blue-100 dark:border-white/10">
                <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" strokeWidth={2.5} />
            </div>
            <h2 className="text-xl font-bold text-zinc-800 dark:text-white mb-2">
                Loading...
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Preparing your dashboard data.
            </p>
        </div>
    );
}
