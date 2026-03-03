"use client";

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Upload, File, X, CheckCircle2, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import anime from 'animejs/lib/anime.js';

interface UploadZoneProps {
    onUpload: (file: File) => void;
    isUploading: boolean;
    progress: number;
}

export default function UploadZone({ onUpload, isUploading, progress }: UploadZoneProps) {
    const [isDragActive, setIsDragActive] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const portalRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (isDragActive) {
            anime({
                targets: '.portal-ring',
                strokeDashoffset: [anime.setDashoffset, 0],
                easing: 'easeInOutSine',
                duration: 1500,
                delay: function (el, i) { return i * 250 },
                direction: 'alternate',
                loop: true
            });
        }
    }, [isDragActive]);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragActive(true);
    };

    const handleDragLeave = () => {
        setIsDragActive(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragActive(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            setFile(droppedFile);
            onUpload(droppedFile);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            onUpload(selectedFile);
        }
    };

    const clearFile = () => {
        setFile(null);
    };

    return (
        <div className="w-full max-w-3xl mx-auto px-4">
            <div
                ref={portalRef}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative group cursor-pointer transition-all duration-700 rounded-[2.5rem] p-16 text-center overflow-hidden bg-white border border-gray-100 shadow-premium hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] ${isDragActive ? 'scale-[1.02]' : ''
                    }`}
            >
                {/* SVG Decorative Ring */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" preserveAspectRatio="none">
                    <rect
                        className="portal-ring"
                        x="10" y="10" width="calc(100% - 20px)" height="calc(100% - 20px)"
                        rx="30" fill="none" stroke="url(#gradient)" strokeWidth="2"
                        strokeDasharray="20 10"
                    />
                    <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="100%" stopColor="#8b5cf6" />
                        </linearGradient>
                    </defs>
                </svg>

                <input
                    type="file"
                    onChange={handleFileSelect}
                    className="absolute inset-0 opacity-0 cursor-pointer z-20"
                    disabled={isUploading}
                />

                <div className="relative z-10 flex flex-col items-center justify-center space-y-8">
                    <motion.div
                        animate={isDragActive ? { scale: 1.2, rotate: 180 } : { scale: 1, rotate: 0 }}
                        className={`p-6 rounded-3xl transition-all duration-500 shadow-xl ${isDragActive ? 'bg-blue-600 text-white' : 'bg-gray-50 text-blue-600'}`}
                    >
                        <Upload className="w-12 h-12" />
                    </motion.div>

                    <div className="space-y-3">
                        <h3 className="text-3xl font-black text-gray-900 tracking-tight">
                            {isDragActive ? 'Release to Start Analysis' : 'Intelligence Portal'}
                        </h3>
                        <p className="text-gray-500 font-medium max-w-sm mx-auto">
                            Drag your document into the portal for instant AI decomposition.
                        </p>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
                        <span className="px-3 py-1 rounded-full bg-gray-50">PDF</span>
                        <span className="px-3 py-1 rounded-full bg-gray-50">DOCX</span>
                        <span className="px-3 py-1 rounded-full bg-gray-50">XLSX</span>
                        <span className="px-3 py-1 rounded-full bg-gray-50">IMAGES</span>
                    </div>

                    <button className="relative px-10 py-4 bg-gray-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-600 transition-all duration-500 shadow-2xl overflow-hidden group">
                        <span className="relative z-10">Select Source</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </button>
                </div>

                {isUploading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 z-30 bg-white/90 backdrop-blur-xl flex flex-col items-center justify-center p-10"
                    >
                        <div className="relative w-full max-w-xs space-y-6">
                            <div className="flex justify-between items-end">
                                <span className="text-4xl font-black text-gray-900">{Math.round(progress)}%</span>
                                <span className="text-xs font-black text-blue-600 uppercase tracking-widest animate-pulse">Decomposing...</span>
                            </div>
                            <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden shadow-inner p-1">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg"
                                />
                            </div>
                            <div className="flex justify-center gap-2">
                                <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce" />
                                <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.2s]" />
                                <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.4s]" />
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>

            <AnimatePresence>
                {file && !isUploading && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="mt-8 p-6 bento-card flex items-center justify-between"
                    >
                        <div className="flex items-center space-x-4">
                            <div className="p-4 bg-blue-50 rounded-2xl text-blue-600 shadow-inner">
                                <File className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-lg font-bold text-gray-900 max-w-[250px] truncate">{file.name}</p>
                                <p className="text-xs font-black text-gray-400 capitalize flex items-center gap-1.5">
                                    <Zap className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                    Ready for processing • {(file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={clearFile}
                            className="p-3 bg-gray-50 hover:bg-red-50 hover:text-red-600 rounded-2xl text-gray-400 transition-all duration-300"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
