"use client";

import { Printer, Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import { ResumeData } from "@/types";
import { useEffect, useState } from "react";

// Dynamically import PDFDownloadLink to prevent SSR issues
const PDFDownloadLink = dynamic(
    () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
    { ssr: false }
);

import { ResumePDF } from "./resume/ResumePDF";

export function PrintButton({ data }: { data: ResumeData }) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return (
            <button className="fixed bottom-8 right-8 bg-blue-600/50 text-white p-4 rounded-full shadow-lg flex items-center gap-2 cursor-not-allowed">
                <Printer className="w-5 h-5" />
                <span className="font-medium">Loading PDF...</span>
            </button>
        );
    }

    return (
        <PDFDownloadLink
            document={<ResumePDF data={data} />}
            fileName={`${data.name.replace(/\s+/g, '_')}_Resume.pdf`}
            className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg print:hidden transition-transform hover:scale-105 flex items-center gap-2 z-50"
        >
            {({ loading }) => (
                <>
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Printer className="w-5 h-5" />}
                    <span className="font-medium">{loading ? 'Generating...' : 'Download PDF'}</span>
                </>
            )}
        </PDFDownloadLink>
    );
}
