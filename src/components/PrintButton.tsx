"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
    return (
        <button
            onClick={() => window.print()}
            className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg print:hidden transition-transform hover:scale-105 flex items-center gap-2"
        >
            <Printer className="w-5 h-5" />
            <span className="font-medium">Download PDF</span>
        </button>
    );
}
