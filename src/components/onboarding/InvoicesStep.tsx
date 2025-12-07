'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  CloudUpload,
  Trash2,
  FileText,
  CheckCircle,
  ScanLine,
  Receipt,
} from 'lucide-react';

interface InvoicesStepProps {
  onNext: () => void;
  onSkip: () => void;
  initialInvoices?: Array<{ name: string; size: number }>;
  onSave?: (invoices: Array<{ name: string; size: number }>) => void;
}

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'success' | 'error';
  progress: number;
  scanStatus?: 'pending' | 'scanning' | 'verified' | 'failed';
  extractedData?: {
    invoiceNumber?: string;
    amount?: string;
    date?: string;
  };
}

export default function InvoicesStep({
  onNext,
  onSkip,
  initialInvoices,
  onSave,
}: InvoicesStepProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>(
    initialInvoices?.map(inv => ({
      ...inv,
      type: 'application/pdf',
      status: 'success' as const,
      progress: 100,
      scanStatus: 'verified' as const,
    })) || []
  );
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter((file) => {
      const validTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword',
        'image/png',
        'image/jpeg',
        'image/jpg',
      ];
      const maxSize = 10 * 1024 * 1024; // 10MB

      return validTypes.includes(file.type) && file.size <= maxSize;
    });

    validFiles.forEach((file) => {
      const newFile: UploadedFile = {
        name: file.name,
        size: file.size,
        type: file.type,
        status: 'uploading',
        progress: 0,
      };

      setUploadedFiles((prev) => [...prev, newFile]);

      // Simulate upload progress
      simulateUpload(newFile);
    });
  };

  const simulateUpload = (file: UploadedFile) => {
    const interval = setInterval(() => {
      setUploadedFiles((prev) =>
        prev.map((f) => {
          if (f.name === file.name && f.status === 'uploading') {
            const newProgress = f.progress + 20;
            if (newProgress >= 100) {
              clearInterval(interval);
              return { ...f, progress: 100, status: 'success' };
            }
            return { ...f, progress: newProgress };
          }
          return f;
        })
      );
    }, 300);
  };

  const handleRemoveFile = (fileName: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.name !== fileName));
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleContinue = () => {
    setIsProcessing(true);
    
    console.log('InvoicesStep - Uploaded files:', uploadedFiles);
    // Save invoice data
    if (onSave) {
      const invoiceData = uploadedFiles.map(f => ({ name: f.name, size: f.size }));
      console.log('InvoicesStep - Saving invoice data:', invoiceData);
      onSave(invoiceData);
      console.log('InvoicesStep - Invoice data saved successfully');
    } else {
      console.warn('InvoicesStep - onSave callback not available!');
    }
    
    // Simulate scanning process for each file
    const scanFiles = async () => {
      for (let i = 0; i < uploadedFiles.length; i++) {
        // Skip already verified files
        if (uploadedFiles[i].scanStatus === 'verified') {
          continue;
        }

        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setUploadedFiles(prev => prev.map((file, index) => {
          if (index === i) {
            return {
              ...file,
              scanStatus: 'scanning',
            };
          }
          return file;
        }));

        await new Promise(resolve => setTimeout(resolve, 2000));
        
        setUploadedFiles(prev => prev.map((file, index) => {
          if (index === i) {
            // Simulate data extraction
            return {
              ...file,
              scanStatus: 'verified',
              extractedData: {
                invoiceNumber: `INV-${Math.floor(Math.random() * 10000)}`,
                amount: `$${(Math.random() * 10000 + 1000).toFixed(2)}`,
                date: new Date().toLocaleDateString(),
              },
            };
          }
          return file;
        }));
      }

      // Wait a bit then proceed
      await new Promise(resolve => setTimeout(resolve, 1500));
      onNext();
    };

    scanFiles();
  };

  // Processing Screen
  if (isProcessing) {
    const allScanned = uploadedFiles.every(f => f.scanStatus === 'verified');
    
    return (
      <div className="flex flex-col items-center min-h-full px-4 sm:px-8 py-8 sm:py-12 max-w-[700px] mx-auto">
        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#181D27] mb-4 text-center">
          {allScanned ? 'Verification complete' : 'Scanning your invoices'}
        </h1>

        {/* Description */}
        <p className="text-sm sm:text-base font-normal text-[#535862] mb-12 text-center max-w-[600px]">
          {allScanned 
            ? 'All invoices have been verified successfully.' 
            : 'We\'re extracting data and verifying your invoice details. This will only take a moment.'}
        </p>

        {/* Scanning Icon */}
        {!allScanned && (
          <div className="w-20 h-20 rounded-full bg-[#eff6ff] flex items-center justify-center mb-12 animate-pulse">
            <ScanLine className="w-10 h-10 text-[#2164ef]" />
          </div>
        )}

        {/* Files Being Scanned */}
        <div className="w-full max-w-[600px]">
          <div className="border border-[#E9EAEB] rounded-lg bg-white">
            {uploadedFiles.map((file, index) => (
              <React.Fragment key={index}>
                {index > 0 && <div className="border-t border-[#E9EAEB]" />}
                <div className="py-6 px-4 flex items-start gap-4">
                  <div className={`flex-shrink-0 ${
                    file.scanStatus === 'verified'
                      ? 'text-emerald-500'
                      : file.scanStatus === 'scanning'
                      ? 'text-[#2164ef]'
                      : 'text-[#717680]'
                  }`}>
                    {file.scanStatus === 'verified' ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : file.scanStatus === 'scanning' ? (
                      <div className="w-6 h-6 border-3 border-[#E9EAEB] border-t-[#2164ef] rounded-full animate-spin" />
                    ) : (
                      <Receipt className="w-6 h-6" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#181D27] mb-2">
                      {file.name}
                    </p>
                    <p className="text-xs text-[#717680]">
                      {file.scanStatus === 'verified' && file.extractedData
                        ? `${file.extractedData.invoiceNumber} • ${file.extractedData.amount} • ${file.extractedData.date}`
                        : file.scanStatus === 'scanning'
                        ? 'Extracting invoice data...'
                        : 'Pending scan'}
                    </p>
                    {file.scanStatus === 'verified' && (
                      <p className="text-xs text-emerald-500 font-medium mt-2">
                        ✓ Verified successfully
                      </p>
                    )}
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Progress Info */}
        {!allScanned && (
          <div className="mt-8 text-center">
            <p className="text-sm font-medium text-[#2164ef]">
              Processing {uploadedFiles.filter(f => f.scanStatus === 'verified').length} of {uploadedFiles.length} invoices
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-full px-4 sm:px-8 py-8 sm:py-12 max-w-[700px] mx-auto">
      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-semibold text-[#181D27] mb-4 text-center">
        Upload your invoices
      </h1>

      {/* Description */}
      <p className="text-sm sm:text-base font-normal text-[#535862] mb-12 text-center max-w-[600px]">
        Submit your recent invoices to get started with funding and customer verification.
      </p>

      {/* Upload Area */}
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClickUpload}
        className={`w-full border-2 border-dashed rounded-lg p-8 sm:p-12 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-[#2164ef] bg-[#eff6ff]'
            : 'border-[#E9EAEB] bg-[#FAFAFA] hover:border-[#2164ef] hover:bg-[#eff6ff]'
        }`}
      >
        {/* Upload Icon */}
        <div className="w-12 h-12 rounded-lg border border-[#E9EAEB] flex items-center justify-center mx-auto mb-6 bg-white">
          <CloudUpload className="w-6 h-6 text-[#717680]" />
        </div>

        {/* Upload Text */}
        <p className="text-sm font-medium text-[#181D27] mb-2">
          <span className="text-[#2164ef] font-semibold underline">
            Click to upload
          </span>
          {' '}or drag and drop
        </p>

        {/* File Info */}
        <p className="text-xs font-normal text-[#717680]">
          PDF, DOCX, or image formats (max. 10mb per file)
        </p>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.docx,.doc,.png,.jpg,.jpeg"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="w-full mt-8">
          <h3 className="text-sm font-semibold text-[#181D27] mb-4">
            Uploaded Files ({uploadedFiles.length})
          </h3>
          <div className="border border-[#E9EAEB] rounded-lg bg-white">
            {uploadedFiles.map((file, index) => (
              <React.Fragment key={index}>
                {index > 0 && <div className="border-t border-[#E9EAEB]" />}
                <div className="py-4 px-4 flex items-start gap-4">
                  <div className={`flex-shrink-0 ${
                    file.status === 'success' ? 'text-emerald-500' : 'text-[#2164ef]'
                  }`}>
                    {file.status === 'success' ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <FileText className="w-6 h-6" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#181D27] mb-1">
                      {file.name}
                    </p>
                    <p className="text-xs text-[#717680] mb-2">
                      {formatFileSize(file.size)}
                      {file.status === 'uploading' && ' • Uploading...'}
                      {file.status === 'success' && ' • Upload complete'}
                    </p>
                    {file.status === 'uploading' && (
                      <Progress value={file.progress} className="h-1" />
                    )}
                  </div>
                  {file.status === 'success' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveFile(file.name)}
                      className="text-[#717680] hover:text-red-500 flex-shrink-0 p-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col gap-4 mt-12 w-full items-center">
        <Button
          onClick={handleContinue}
          disabled={uploadedFiles.length === 0 || uploadedFiles.some(f => f.status === 'uploading')}
          aria-label="Continue to next step"
          className="px-8 py-2 text-sm font-medium rounded-lg min-w-[150px]"
        >
          Continue
        </Button>
        <Button
          variant="ghost"
          onClick={onSkip}
          className="text-sm text-[#535862] hover:bg-transparent hover:underline"
        >
          Skip for now
        </Button>
      </div>
    </div>
  );
}
