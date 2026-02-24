import React from 'react';

export function SkeletonJobCard() {
    return (
        <div className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-sm flex flex-col h-full animate-pulse">
            <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 rounded-xl bg-zinc-100 shrink-0" />
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-zinc-100 rounded w-3/4" />
                    <div className="h-3 bg-zinc-100 rounded w-1/2" />
                </div>
            </div>
            <div className="flex gap-2 mb-4">
                <div className="h-6 bg-zinc-100 rounded-lg w-16" />
                <div className="h-6 bg-zinc-100 rounded-lg w-20" />
            </div>
            <div className="space-y-2 mb-6 flex-1">
                <div className="h-3 bg-zinc-100 rounded w-full" />
                <div className="h-3 bg-zinc-100 rounded w-full" />
                <div className="h-3 bg-zinc-100 rounded w-2/3" />
            </div>
            <div className="flex gap-2">
                <div className="h-10 bg-zinc-100 rounded-xl flex-1" />
                <div className="h-10 bg-zinc-100 rounded-xl flex-1" />
            </div>
        </div>
    );
}
