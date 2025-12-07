'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import {
  X,
  Download,
  FileText,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Maximize,
  File,
  Eye,
  Shield,
  Calendar,
  User,
  Hash,
} from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: 'invoice' | 'bank_statement' | 'tax_document' | 'business_license' | 'other';
  size: string;
  uploadedAt: Date;
  status: 'verified' | 'pending' | 'rejected';
  url: string;
  pages?: number;
}

interface DocumentViewerProps {
  applicationId: string;
  documents: Document[];
  onClose: () => void;
  onVerify?: (documentId: string) => void;
  onReject?: (documentId: string, reason: string) => void;
}

// Mock documents for demo
const mockDocuments: Document[] = [
  {
    id: 'DOC-001',
    name: 'Invoice-2024-001.pdf',
    type: 'invoice',
    size: '245 KB',
    uploadedAt: new Date('2024-01-15'),
    status: 'verified',
    url: '/sample-invoice.pdf',
    pages: 3,
  },
  {
    id: 'DOC-002',
    name: 'Invoice-2024-002.pdf',
    type: 'invoice',
    size: '189 KB',
    uploadedAt: new Date('2024-01-15'),
    status: 'pending',
    url: '/sample-invoice-2.pdf',
    pages: 2,
  },
  {
    id: 'DOC-003',
    name: 'BankStatement-Jan2024.pdf',
    type: 'bank_statement',
    size: '512 KB',
    uploadedAt: new Date('2024-01-14'),
    status: 'verified',
    url: '/sample-bank-statement.pdf',
    pages: 5,
  },
  {
    id: 'DOC-004',
    name: 'BusinessLicense.pdf',
    type: 'business_license',
    size: '1.2 MB',
    uploadedAt: new Date('2024-01-10'),
    status: 'verified',
    url: '/sample-license.pdf',
    pages: 1,
  },
  {
    id: 'DOC-005',
    name: 'TaxReturn-2023.pdf',
    type: 'tax_document',
    size: '3.4 MB',
    uploadedAt: new Date('2024-01-12'),
    status: 'rejected',
    url: '/sample-tax.pdf',
    pages: 12,
  },
];

// Verification checklist items
const verificationChecklist = [
  { id: 'authenticity', label: 'Document appears authentic', checked: true },
  { id: 'legible', label: 'All text is legible', checked: true },
  { id: 'complete', label: 'Document is complete', checked: true },
  { id: 'dates', label: 'Dates are valid', checked: false },
  { id: 'amounts', label: 'Amounts match application', checked: true },
  { id: 'business_name', label: 'Business name matches', checked: true },
  { id: 'signatures', label: 'Required signatures present', checked: false },
];

export default function DocumentViewer({
  applicationId,
  documents = mockDocuments,
  onClose,
  onVerify,
  onReject,
}: DocumentViewerProps) {
  const [selectedDocument, setSelectedDocument] = useState<Document>(documents[0]);
  const [zoom, setZoom] = useState(100);
  const [checklist, setChecklist] = useState(verificationChecklist);

  const getStatusBadge = (status: Document['status']) => {
    const styles = {
      verified: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      rejected: 'bg-red-50 text-red-700 border-red-200',
    };

    const icons = {
      verified: <CheckCircle className="w-3 h-3" />,
      pending: <AlertCircle className="w-3 h-3" />,
      rejected: <X className="w-3 h-3" />,
    };

    return (
      <Badge className={`${styles[status]} border`}>
        <span className="flex items-center gap-1">
          {icons[status]}
          {status}
        </span>
      </Badge>
    );
  };

  const getDocumentIcon = (type: Document['type']) => {
    const icons = {
      invoice: <FileText className="w-4 h-4" />,
      bank_statement: <FileText className="w-4 h-4" />,
      tax_document: <FileText className="w-4 h-4" />,
      business_license: <Shield className="w-4 h-4" />,
      other: <File className="w-4 h-4" />,
    };
    return icons[type];
  };

  const handleZoom = (action: 'in' | 'out' | 'reset') => {
    if (action === 'in' && zoom < 200) {
      setZoom(zoom + 25);
    } else if (action === 'out' && zoom > 50) {
      setZoom(zoom - 25);
    } else if (action === 'reset') {
      setZoom(100);
    }
  };

  const handleChecklistChange = (itemId: string) => {
    setChecklist(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, checked: !item.checked } : item
      )
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex">
      <div className="flex-1 bg-white flex h-full">
        {/* Left Sidebar - Document List */}
        <div className="w-80 border-r border-gray-200 bg-gray-50 flex flex-col">
          <div className="p-4 border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-black">Documents</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-600">Application {applicationId}</p>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-4 space-y-2">
              {documents.map(doc => (
                <button
                  key={doc.id}
                  onClick={() => setSelectedDocument(doc)}
                  className={`w-full p-3 rounded-lg border transition-all text-left ${
                    selectedDocument?.id === doc.id
                      ? 'bg-white border-black shadow-sm'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center flex-shrink-0">
                      {getDocumentIcon(doc.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-black truncate">
                        {doc.name}
                      </p>
                      <p className="text-xs text-gray-600 mt-0.5">
                        {doc.size} • {doc.pages} pages
                      </p>
                      <div className="mt-2">
                        {getStatusBadge(doc.status)}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>

          <div className="p-4 border-t border-gray-200 bg-white">
            <Button variant="outline" className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Download All
            </Button>
          </div>
        </div>

        {/* Main Content - Document Viewer */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div className="h-14 border-b border-gray-200 bg-white px-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h3 className="font-medium text-black">{selectedDocument?.name}</h3>
              {selectedDocument && getStatusBadge(selectedDocument.status)}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleZoom('out')}
                disabled={zoom <= 50}
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-sm text-gray-600 w-12 text-center">{zoom}%</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleZoom('in')}
                disabled={zoom >= 200}
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleZoom('reset')}>
                <RotateCw className="w-4 h-4" />
              </Button>
              <div className="w-px h-6 bg-gray-200 mx-2" />
              <Button variant="ghost" size="sm">
                <Maximize className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Document Display Area */}
          <div className="flex-1 flex">
            <div className="flex-1 bg-gray-100 p-8 overflow-auto">
              <div
                className="mx-auto bg-white shadow-lg rounded-lg"
                style={{
                  width: `${zoom}%`,
                  maxWidth: '900px',
                  minHeight: '1200px',
                  transform: `scale(${zoom / 100})`,
                  transformOrigin: 'top center',
                }}
              >
                {/* Document Preview Placeholder */}
                <div className="p-12">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-4">
                      <div>
                        <h4 className="text-2xl font-bold text-black">INVOICE</h4>
                        <p className="text-gray-600 mt-1">#{selectedDocument?.name.split('.')[0]}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Date</p>
                        <p className="font-medium">January 15, 2024</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8 py-6">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-2">From</p>
                        <p className="font-medium">TechStart Solutions</p>
                        <p className="text-gray-600 text-sm">123 Innovation Way</p>
                        <p className="text-gray-600 text-sm">San Francisco, CA 94107</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-2">To</p>
                        <p className="font-medium">Client Company LLC</p>
                        <p className="text-gray-600 text-sm">456 Business Blvd</p>
                        <p className="text-gray-600 text-sm">New York, NY 10001</p>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4 bg-gray-50">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 text-sm">Description</th>
                            <th className="text-right py-2 text-sm">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="py-3">Software Development Services</td>
                            <td className="py-3 text-right">$15,000.00</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-3">Consulting Services</td>
                            <td className="py-3 text-right">$5,000.00</td>
                          </tr>
                          <tr>
                            <td className="py-3 font-bold">Total</td>
                            <td className="py-3 text-right font-bold">$20,000.00</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="mt-8 pt-8 border-t">
                      <p className="text-sm text-gray-600">
                        Payment due within 30 days. Thank you for your business.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar - Verification Panel */}
            <div className="w-96 border-l border-gray-200 bg-white">
              <Tabs defaultValue="details" className="h-full flex flex-col">
                <TabsList className="grid w-full grid-cols-3 p-1 bg-gray-100">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="verification">Verification</TabsTrigger>
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="flex-1 p-4 space-y-4">
                  <Card className="border-gray-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">Document Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Hash className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">ID:</span>
                        <span className="font-mono text-xs">{selectedDocument?.id}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <FileText className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">Type:</span>
                        <span className="capitalize">{selectedDocument?.type.replace('_', ' ')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">Uploaded:</span>
                        <span>{selectedDocument?.uploadedAt.toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">Uploaded by:</span>
                        <span>John Doe</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-gray-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">Metadata</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">File Size</span>
                        <span>{selectedDocument?.size}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Pages</span>
                        <span>{selectedDocument?.pages}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Format</span>
                        <span>PDF</span>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="verification" className="flex-1 p-4">
                  <Card className="border-gray-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">Verification Checklist</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {checklist.map(item => (
                        <div key={item.id} className="flex items-center gap-3">
                          <Checkbox
                            id={item.id}
                            checked={item.checked}
                            onCheckedChange={() => handleChecklistChange(item.id)}
                          />
                          <label
                            htmlFor={item.id}
                            className="text-sm text-gray-700 cursor-pointer flex-1"
                          >
                            {item.label}
                          </label>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <div className="mt-4 space-y-2">
                    <Button
                      className="w-full bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => onVerify?.(selectedDocument?.id!)}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Verify Document
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-red-200 text-red-700 hover:bg-red-50"
                      onClick={() => onReject?.(selectedDocument?.id!, 'Failed verification')}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Reject Document
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="notes" className="flex-1 p-4">
                  <textarea
                    className="w-full h-40 px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-black resize-none"
                    placeholder="Add notes about this document..."
                  />
                  <Button className="w-full mt-4">Save Notes</Button>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
