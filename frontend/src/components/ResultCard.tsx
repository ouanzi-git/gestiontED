"use client";

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    FileText,
    Tag,
    Calendar,
    User,
    Hash,
    DollarSign,
    CheckCircle2,
    Shield,
    Activity,
    Database
} from 'lucide-react';
import { animate } from 'animejs';

interface ProcessingResults {
    detected_type: string;
    confidence: number;
    extracted_text_preview: string;
    metadata: Record<string, any>;
    ocr_used: boolean;
    processing_time_seconds: number;
}

interface ResultCardProps {
    filename: string;
    results: ProcessingResults;
}

export default function ResultCard({ filename, results }: ResultCardProps) {
    const meta = results.metadata;

    useEffect(() => {
        animate('.bento-item', {
            translateY: [20, 0],
            opacity: [0, 1],
            delay: (el: any, i: number) => 500 + i * 100,
            easing: 'easeOutQuint',
            duration: 800
        });
    }, []);

    const DetailItem = ({ icon: Icon, label, value, color = "blue", className = "" }: any) => (
        <div className={`bento-item flex flex-col justify-between p-6 bento-card ${className}`}>
            <div className={`p-4 rounded-2xl bg-${color}-50 text-${color}-600 self-start mb-6 shadow-sm border border-${color}-100/50`}>
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-black mb-2">{label}</p>
                <p className="text-xl text-gray-900 font-black truncate">{value || 'N/A'}</p>
            </div>
        </div>
    );

    // Filter out internal fields if any, and map to DetailItems
    const metadataEntries = Object.entries(meta).filter(([key]) => key !== 'other_fields');

    const icons = [Hash, Calendar, User, Shield, Tag, Activity];
    const colors = ["blue", "indigo", "purple", "cyan", "emerald", "violet"];

    return (
        <div className="w-full space-y-8">
            {/* Header Bento Card */}
            <div className="bento-item bento-card flex flex-col md:flex-row gap-8 items-center justify-between p-8 border-l-[12px] border-l-blue-600 bg-white">
                <div className="flex items-center gap-6">
                    <div className="p-5 bg-blue-600 rounded-3xl text-white shadow-2xl shadow-blue-200">
                        <FileText className="w-10 h-10" />
                    </div>
                    <div>
                        <h3 className="text-3xl font-black text-gray-900 tracking-tight">{filename}</h3>
                        <div className="flex items-center gap-4 mt-2">
                            <span className="flex items-center gap-1.5 text-xs font-bold text-gray-500 bg-gray-50 px-3 py-1 rounded-full uppercase tracking-widest">
                                <Activity className="w-3 h-3" /> {results.processing_time_seconds}s
                            </span>
                            <span className="flex items-center gap-1.5 text-xs font-bold text-gray-500 bg-gray-50 px-3 py-1 rounded-full uppercase tracking-widest">
                                <Database className="w-3 h-3" /> OCR: {results.ocr_used ? 'On' : 'Off'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-3">
                    <div className="flex items-center gap-3 bg-blue-50 text-blue-700 px-6 py-3 rounded-full border border-blue-100 shadow-sm">
                        <Tag className="w-5 h-5" />
                        <span className="text-lg font-black uppercase tracking-tight">{results.detected_type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${results.confidence * 100}%` }}
                                transition={{ delay: 1, duration: 1.5 }}
                                className="h-full bg-blue-600"
                            />
                        </div>
                        <span className="text-[10px] text-gray-400 font-black">{(results.confidence * 100).toFixed(1)}% QUALITY</span>
                    </div>
                </div>
            </div>

            {/* Grid Bento - Dynamic Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {metadataEntries.map(([key, value], index) => (
                    <DetailItem
                        key={key}
                        icon={icons[index % icons.length]}
                        label={key}
                        value={String(value)}
                        color={colors[index % colors.length]}
                    />
                ))}
            </div>

            {/* Large Preview Bento */}
            <div className="bento-item bento-card bg-gray-900 border-none p-8">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse [animation-delay:0.2s]" />
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse [animation-delay:0.4s]" />
                    </div>
                </div>
                <div className="p-8 rounded-2xl bg-black/40 border border-white/5 font-mono text-[13px] leading-[1.8] text-blue-100/70 h-64 overflow-y-auto scrollbar-hide">
                    {results.extracted_text_preview}...
                    <div className="mt-8 text-blue-500/50 italic text-[11px] uppercase tracking-widest font-bold">End of intelligence block</div>
                </div>
            </div>
        </div>
    );
}
