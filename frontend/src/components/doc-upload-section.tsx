'use client';

import React, { useState } from 'react';
import { Upload, FileText, Image, Table, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface UploadedDoc {
  id: string;
  name: string;
  type: 'image' | 'pdf' | 'excel' | 'document';
  status: 'uploading' | 'classifying' | 'extracting' | 'analyzing' | 'complete' | 'error';
  progress: number;
  classification?: string;
  confidence?: number;
  extractedText?: string;
  analysis?: string;
  error?: string;
}

interface DocUploadSectionProps {
  onUpload: (file: File) => void;
  isUploading: boolean;
  progress: number;
  lastResult?: any;
}

export function DocUploadSection({ onUpload, isUploading, progress: externalProgress, lastResult }: DocUploadSectionProps) {
  const [docs, setDocs] = useState<UploadedDoc[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image className="w-5 h-5" />;
      case 'pdf':
        return <FileText className="w-5 h-5" />;
      case 'excel':
        return <Table className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete':
        return 'bg-success text-success-foreground';
      case 'error':
        return 'bg-destructive text-destructive-foreground';
      case 'analyzing':
      case 'extracting':
      case 'classifying':
        return 'bg-primary text-primary-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'error':
        return <AlertCircle className="w-4 h-4" />;
      case 'uploading':
      case 'classifying':
      case 'extracting':
      case 'analyzing':
        return <Loader2 className="w-4 h-4 animate-spin" />;
      default:
        return null;
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
    if (files.length > 0) {
      onUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      processFiles(files);
      if (files.length > 0) {
        onUpload(files[0]);
      }
    }
  };

  const processFiles = (files: File[]) => {
    const newDocs = files.map((file) => {
      let type: 'image' | 'pdf' | 'excel' | 'document' = 'document';

      if (file.type.startsWith('image/')) type = 'image';
      else if (file.type === 'application/pdf') type = 'pdf';
      else if (file.type.includes('spreadsheet') || file.name.endsWith('.xlsx')) type = 'excel';

      const doc: UploadedDoc = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type,
        status: 'uploading',
        progress: 0,
      };

      return doc;
    });

    setDocs((prev) => [...prev, ...newDocs]);
  };

  // Sync with real backend results
  React.useEffect(() => {
    if (lastResult && lastResult.filename) {
      setDocs((prev) =>
        prev.map((doc) => {
          if (doc.name === lastResult.filename || lastResult.filename.includes(doc.name)) {
            return {
              ...doc,
              status: 'complete',
              progress: 100,
              classification: lastResult.processing_results.detected_type,
              confidence: Math.round(lastResult.processing_results.confidence * 100),
              extractedText: lastResult.processing_results.extracted_text_preview,
              analysis: `Document analysé avec succès : ${lastResult.processing_results.detected_type}`,
            };
          }
          return doc;
        })
      );
    }
  }, [lastResult]);

  // Handle external progress for the current upload
  React.useEffect(() => {
    if (isUploading && docs.length > 0) {
      setDocs((prev) => {
        const lastDoc = prev[prev.length - 1];
        if (lastDoc.status !== 'complete') {
          return prev.map((d, i) =>
            i === prev.length - 1 ? { ...d, progress: externalProgress, status: externalProgress === 100 ? 'analyzing' : 'uploading' } : d
          );
        }
        return prev;
      });
    }
  }, [externalProgress, isUploading]);

  const removeDoc = (id: string) => {
    setDocs((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <div className="w-full space-y-6">
      {/* Upload Area */}
      <Card
        className={`transition-all duration-300 ${isDragging
          ? 'border-primary bg-primary/5'
          : 'border-border'
          }`}
      >
        <CardHeader>
          <CardTitle>Upload Documents</CardTitle>
          <CardDescription>
            Drag and drop or click to upload images, PDFs, Excel files, and more
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-all duration-300 ${isDragging
              ? 'border-primary bg-primary/10'
              : 'border-border hover:border-primary hover:bg-accent/5'
              }`}
          >
            <input
              type="file"
              multiple
              onChange={handleFileSelect}
              accept=".pdf,.xlsx,.xls,.doc,.docx,image/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />

            <div className="flex flex-col items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-full">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">
                  Drop your files here
                </p>
                <p className="text-sm text-muted-foreground">
                  or click to browse
                </p>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Supported: PDF, Excel, Images (PNG, JPG), Word, DOC
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents List */}
      {docs.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Processing Documents</h3>
            <span className="text-sm text-muted-foreground">
              {docs.filter((d) => d.status === 'complete').length} of {docs.length} complete
            </span>
          </div>

          <div className="grid gap-4">
            {docs.map((doc) => (
              <Card
                key={doc.id}
                className="overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-4 space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="p-2 bg-secondary/20 rounded-lg mt-1">
                        {getTypeIcon(doc.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">
                          {doc.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {doc.type.toUpperCase()}
                          </Badge>
                          {doc.classification && (
                            <Badge
                              className={`text-xs ${getStatusColor(
                                'complete'
                              )}`}
                            >
                              {doc.classification}
                            </Badge>
                          )}
                          {doc.confidence && (
                            <span className="text-xs text-muted-foreground">
                              {doc.confidence}% confidence
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDoc(doc.id)}
                      className="h-8 w-8 p-0"
                    >
                      ✕
                    </Button>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm">
                        {getStatusIcon(doc.status)}
                        <span className="capitalize text-muted-foreground">
                          {doc.status}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {doc.progress}%
                      </span>
                    </div>
                    <Progress
                      value={doc.progress}
                      className="h-2"
                    />
                  </div>

                  {/* Status Messages */}
                  {doc.status === 'complete' && doc.analysis && (
                    <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
                      <p className="text-sm text-foreground">{doc.analysis}</p>
                    </div>
                  )}

                  {doc.status === 'error' && doc.error && (
                    <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                      <p className="text-sm text-destructive">{doc.error}</p>
                    </div>
                  )}

                  {doc.extractedText && doc.status === 'complete' && (
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-xs font-semibold text-muted-foreground mb-2">
                        Extracted Text Preview
                      </p>
                      <p className="text-sm text-foreground line-clamp-2">
                        {doc.extractedText}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  {doc.status === 'complete' && (
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                      >
                        View Details
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                      >
                        Export Results
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
