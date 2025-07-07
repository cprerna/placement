'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, X, FileText, Image, Loader2, Download } from 'lucide-react';
import { getSignedUrl, downloadFile } from '@/lib/s3-utils';

interface FileUploadProps {
  onFileUpload: (url: string, key: string) => void;
  onFileRemove: (key: string) => void;
  currentFileUrl?: string;
  currentFileKey?: string;
  accept?: string;
  label: string;
  placeholder?: string;
  disabled?: boolean;
}

interface UploadedFile {
  url: string;
  key: string;
  name: string;
  type: string;
}

export function FileUpload({
  onFileUpload,
  onFileRemove,
  currentFileUrl,
  currentFileKey,
  accept,
  label,
  placeholder,
  disabled = false,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize with current file if provided
  React.useEffect(() => {
    if (currentFileKey) {
      // We have a file key, we'll generate signed URLs on-demand for viewing
      const fileName = currentFileUrl ? currentFileUrl.split('/').pop() || 'Unknown file' : 'Uploaded file';
      setUploadedFile({
        url: currentFileUrl || '', // Keep existing URL for backward compatibility
        key: currentFileKey,
        name: fileName,
        type: currentFileUrl ? getFileTypeFromUrl(currentFileUrl) : 'document',
      });
    }
  }, [currentFileUrl, currentFileKey]);

  const getFileTypeFromUrl = (url: string): string => {
    const extension = url.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) {
      return 'image';
    }
    return 'document';
  };

  const extractKeyFromUrl = (url: string): string => {
    // Extract the key from the S3 URL
    const urlParts = url.split('/');
    return urlParts[urlParts.length - 1].split('?')[0]; // Remove query parameters
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      // Get presigned URL
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
        }),
      });

      const responseData = await response.json();
      console.log('Response data:', responseData);

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to get upload URL');
      }

      const { url, fields } = responseData;

      if (!url || !fields) {
        throw new Error('Invalid response from upload API');
      }

      // Upload to S3
      const formData = new FormData();
      Object.entries(fields).forEach(([key, value]) => {
        formData.append(key, value as string);
      });
      formData.append('file', file);

      const uploadResponse = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Upload failed');
      }

      // Store the file key for generating signed URLs later
      const fileKey = fields.key as string;

      const newUploadedFile = {
        url: '', // We'll generate signed URLs on-demand
        key: fileKey,
        name: file.name,
        type: file.type.startsWith('image/') ? 'image' : 'document',
      };

      setUploadedFile(newUploadedFile);
      onFileUpload('', fileKey); // Pass empty URL since we'll use signed URLs
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      // Clear the input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = async () => {
    if (!uploadedFile) return;

    try {
      // Delete from S3
      const response = await fetch('/api/upload/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: uploadedFile.key,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete file');
      }

      setUploadedFile(null);
      onFileRemove(uploadedFile.key);
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to remove file. Please try again.');
    }
  };

  const handlePreview = async () => {
    if (!uploadedFile?.key) return;

    try {
      const signedUrl = await getSignedUrl(uploadedFile.key);
      window.open(signedUrl, '_blank');
    } catch (error) {
      console.error('Preview error:', error);
      alert('Failed to preview file. Please try again.');
    }
  };

  const handleDownload = async () => {
    if (!uploadedFile?.key) return;

    try {
      await downloadFile(uploadedFile.key, uploadedFile.name);
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download file. Please try again.');
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>

      {!uploadedFile ? (
        <div className="space-y-2">
          <Input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            disabled={uploading || disabled}
            className="cursor-pointer"
          />
          {placeholder && <p className="text-xs text-muted-foreground">{placeholder}</p>}
          {uploading && (
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <Loader2 className="h-4 w-4 animate-spin" />
              Uploading...
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2 p-3 border rounded-md bg-gray-50">
          <div className="flex items-center gap-2 flex-1">
            {uploadedFile.type === 'image' ? (
              <Image className="h-4 w-4 text-blue-600" />
            ) : (
              <FileText className="h-4 w-4 text-green-600" />
            )}
            <span className="text-sm font-medium truncate">{uploadedFile.name}</span>
          </div>
          <div className="flex items-center gap-1">
            <Button type="button" variant="outline" size="sm" onClick={handlePreview} disabled={disabled}>
              View
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={handleDownload} disabled={disabled}>
              <Download className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRemove}
              disabled={disabled}
              className="text-red-600 hover:text-red-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
