"use client";

import React, { useState } from 'react';
import { Header } from '@/components/header';
import { DocUploadSection } from '@/components/doc-upload-section';
import { StatsOverview } from '@/components/stats-overview';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, BarChart3, Settings, RotateCcw } from 'lucide-react';
import ResultCard from '@/components/ResultCard';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setProgress(0);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 2;
      });
    }, 100);

    try {
      const response = await fetch('http://localhost:8000/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Processing failed');
      }

      const data = await response.json();
      clearInterval(progressInterval);
      setProgress(100);

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="mb-8 space-y-2">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Document Intelligence Agent
          </h2>
          <p className="text-lg text-muted-foreground">
            Automatically classify, extract, and analyze documents with AI-powered OCR
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="upload" className="w-full space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto">
            <TabsTrigger value="upload" className="gap-2">
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Upload</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Upload Tab */}
          <TabsContent value="upload" className="space-y-6">
            <DocUploadSection
              onUpload={handleUpload}
              isUploading={isUploading}
              progress={progress}
              lastResult={result}
            />

            {error && (
              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-center font-bold">
                {error}
              </div>
            )}

            <AnimatePresence>
              {result && (
                <motion.section
                  id="result"
                  className="w-full pt-12"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", damping: 25, stiffness: 120 }}
                >
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-black tracking-tight">Extracted Intelligence</h2>
                    <button
                      onClick={() => {
                        setResult(null);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="group flex items-center gap-2 px-6 py-3 bg-card hover:bg-accent text-card-foreground font-bold rounded-2xl transition-all border border-border shadow-premium hover:shadow-2xl"
                    >
                      <RotateCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                      <span>Analyze Another</span>
                    </button>
                  </div>

                  <ResultCard
                    filename={result.filename}
                    results={result.processing_results}
                  />
                </motion.section>
              )}
            </AnimatePresence>

            {/* Quick Features */}
            {!result && (
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-6 rounded-lg border border-border bg-card/50 hover:bg-card transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                    <span className="text-xl">📄</span>
                  </div>
                  <h3 className="font-semibold mb-2">OCR Extraction</h3>
                  <p className="text-sm text-muted-foreground">
                    Extract text and data from images and scanned documents with high accuracy
                  </p>
                </div>

                <div className="p-6 rounded-lg border border-border bg-card/50 hover:bg-card transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center mb-4">
                    <span className="text-xl">🏷️</span>
                  </div>
                  <h3 className="font-semibold mb-2">Smart Classification</h3>
                  <p className="text-sm text-muted-foreground">
                    Automatically categorize documents into invoices, receipts, contracts, and more
                  </p>
                </div>

                <div className="p-6 rounded-lg border border-border bg-card/50 hover:bg-card transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center mb-4">
                    <span className="text-xl">🔍</span>
                  </div>
                  <h3 className="font-semibold mb-2">Deep Analysis</h3>
                  <p className="text-sm text-muted-foreground">
                    Extract key entities, metadata, and insights from processed documents
                  </p>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <StatsOverview />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid gap-6 max-w-2xl">
              <div className="p-6 rounded-lg border border-border bg-card">
                <h3 className="text-lg font-semibold mb-4">Processing Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">OCR Language</label>
                    <select className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground">
                      <option>English</option>
                      <option>Spanish</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 mt-12 py-8 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} DocAgent. Powered by AI Document Intelligence</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}