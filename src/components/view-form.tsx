'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Eye, Edit, Trash2, X, User, MapPin, BookOpen, Building, DollarSign, FileText } from 'lucide-react';
import { getSignedUrl } from '@/lib/s3-utils';

interface StudentData {
  id?: number;
  region?: string | null;
  center_name?: string | null;
  reporting_month?: string | null;
  unique_code?: string | null;
  name: string;
  photo?: string | null;
  photo_key?: string | null;
  application_form?: string | null;
  application_form_key?: string | null;
  attendance?: string | null;
  attendance_key?: string | null;
  placement_doc?: string | null;
  placement_doc_key?: string | null;
  course?: string | null;
  gender?: string | null;
  phone?: string | null;
  email: string;
  educational_qualification?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  placement_month?: string | null;
  city?: string | null;
  state?: string | null;
  address?: string | null;
  company_name?: string | null;
  designation?: string | null;
  sector?: string | null;
  posting_entry_level_job?: string | null;
  placement_county?: string | null;
  placement_proof?: string | null;
  placement_proof_key?: string | null;
  training_proof?: string | null;
  training_proof_key?: string | null;
  training_proof_uploaded?: string | null;
  placement_proof_uploaded?: string | null;
  green_job?: string | null;
  household_women_headed?: string | null;
  pre_training_income?: string | null;
  post_training_income?: string | null;
  remarks?: string | null;
}

interface ViewFormProps {
  studentData: StudentData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: () => void;
  onDelete?: (id: number) => Promise<void>;
  children?: React.ReactNode;
}

export function ViewForm({ studentData, open, onOpenChange, onEdit, onDelete, children }: ViewFormProps) {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [loadingPhoto, setLoadingPhoto] = useState(false);

  const handleEdit = () => {
    if (onEdit) {
      onEdit();
    }
    // Let the parent handle closing this dialog
  };

  const handleDelete = async () => {
    if (studentData.id && onDelete) {
      if (confirm('Are you sure you want to delete this student record? This action cannot be undone.')) {
        await onDelete(studentData.id);
        onOpenChange(false);
      }
    }
  };

  const loadPhoto = async () => {
    if (!studentData.photo_key || loadingPhoto) return;

    setLoadingPhoto(true);
    try {
      const signedUrl = await getSignedUrl(studentData.photo_key);
      setPhotoUrl(signedUrl);
    } catch (error) {
      console.error('Failed to load photo:', error);
    } finally {
      setLoadingPhoto(false);
    }
  };

  React.useEffect(() => {
    if (open && studentData.photo_key) {
      loadPhoto();
    }
  }, [open, studentData.photo_key]);

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Not specified';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const formatBoolean = (value: string | null | undefined) => {
    if (!value) return 'No';
    return value === 'Yes' ? 'Yes' : 'No';
  };

  const InfoItem = ({ label, value, icon: Icon }: { label: string; value: string | null | undefined; icon?: any }) => (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
      </div>
      <p className="text-sm">{value || 'Not specified'}</p>
    </div>
  );

  const DocumentLink = ({
    label,
    fileKey,
    fileName,
  }: {
    label: string;
    fileKey: string | null | undefined;
    fileName?: string;
  }) => {
    const [loading, setLoading] = useState(false);

    const handleView = async () => {
      if (!fileKey) return;

      setLoading(true);
      try {
        const signedUrl = await getSignedUrl(fileKey);
        window.open(signedUrl, '_blank');
      } catch (error) {
        console.error('Failed to load document:', error);
        alert('Failed to load document. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (!fileKey) {
      return (
        <div className="flex items-center justify-between p-2 border rounded bg-gray-50">
          <span className="text-sm text-muted-foreground">{label}</span>
          <Badge variant="secondary">Not uploaded</Badge>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-between p-2 border rounded">
        <span className="text-sm font-medium">{label}</span>
        <Button variant="outline" size="sm" onClick={handleView} disabled={loading}>
          {loading ? 'Loading...' : 'View'}
        </Button>
      </div>
    );
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="min-w-10/12 max-w-4xl h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Student Details
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-6 pr-2">
            {/* Photo and Basic Info */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <div className="w-32 h-32 border rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                  {photoUrl ? (
                    <img src={photoUrl} alt={studentData.name} className="w-full h-full object-cover" />
                  ) : loadingPhoto ? (
                    <div className="text-sm text-muted-foreground">Loading...</div>
                  ) : (
                    <User className="h-16 w-16 text-muted-foreground" />
                  )}
                </div>
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <h2 className="text-2xl font-bold">{studentData.name}</h2>
                  <p className="text-muted-foreground">{studentData.email}</p>
                  {studentData.unique_code && (
                    <Badge variant="outline" className="mt-2">
                      Code: {studentData.unique_code}
                    </Badge>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoItem label="Phone" value={studentData.phone} />
                  <InfoItem label="Gender" value={studentData.gender} />
                </div>
              </div>
            </div>

            <Separator />

            {/* Location Information */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <MapPin className="h-5 w-5" />
                Location Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem label="Region" value={studentData.region} />
                <InfoItem label="Center Name" value={studentData.center_name} />
                <InfoItem label="City" value={studentData.city} />
                <InfoItem label="State" value={studentData.state} />
                <div className="md:col-span-2">
                  <InfoItem label="Address" value={studentData.address} />
                </div>
              </div>
            </div>

            <Separator />

            {/* Training Information */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <BookOpen className="h-5 w-5" />
                Training Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem label="Education" value={studentData.educational_qualification} />
                <InfoItem label="Course" value={studentData.course} />
                <InfoItem label="Start Date" value={formatDate(studentData.start_date)} />
                <InfoItem label="End Date" value={formatDate(studentData.end_date)} />
                <InfoItem label="Reporting Month" value={studentData.reporting_month} />
              </div>
            </div>

            <Separator />

            {/* Placement Information */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <Building className="h-5 w-5" />
                Placement Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem label="Company Name" value={studentData.company_name} />
                <InfoItem label="Designation" value={studentData.designation} />
                <InfoItem label="Sector" value={studentData.sector} />
                <InfoItem label="Placement Month" value={studentData.placement_month} />
                <InfoItem label="Placement County" value={studentData.placement_county} />
              </div>
            </div>

            <Separator />

            {/* Income Information */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <DollarSign className="h-5 w-5" />
                Income Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem label="Pre-Training Income" value={studentData.pre_training_income} />
                <InfoItem label="Post-Training Income" value={studentData.post_training_income} />
              </div>
            </div>

            <Separator />

            {/* Status Flags */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Status Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Entry Level Job</span>
                  <Badge
                    variant={formatBoolean(studentData.posting_entry_level_job) === 'Yes' ? 'default' : 'secondary'}
                  >
                    {formatBoolean(studentData.posting_entry_level_job)}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Green Job</span>
                  <Badge variant={formatBoolean(studentData.green_job) === 'Yes' ? 'default' : 'secondary'}>
                    {formatBoolean(studentData.green_job)}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Women Headed Household</span>
                  <Badge
                    variant={formatBoolean(studentData.household_women_headed) === 'Yes' ? 'default' : 'secondary'}
                  >
                    {formatBoolean(studentData.household_women_headed)}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Training Proof Uploaded</span>
                  <Badge
                    variant={formatBoolean(studentData.training_proof_uploaded) === 'Yes' ? 'default' : 'secondary'}
                  >
                    {formatBoolean(studentData.training_proof_uploaded)}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Placement Proof Uploaded</span>
                  <Badge
                    variant={formatBoolean(studentData.placement_proof_uploaded) === 'Yes' ? 'default' : 'secondary'}
                  >
                    {formatBoolean(studentData.placement_proof_uploaded)}
                  </Badge>
                </div>
              </div>
            </div>

            <Separator />

            {/* Documents */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <FileText className="h-5 w-5" />
                Documents
              </h3>
              <div className="space-y-2">
                <DocumentLink label="Application Form" fileKey={studentData.application_form_key} />
                <DocumentLink label="Attendance Document" fileKey={studentData.attendance_key} />
                <DocumentLink label="Placement Document" fileKey={studentData.placement_doc_key} />
                <DocumentLink label="Placement Proof" fileKey={studentData.placement_proof_key} />
                <DocumentLink label="Training Proof" fileKey={studentData.training_proof_key} />
              </div>
            </div>

            {/* Remarks */}
            {studentData.remarks && (
              <>
                <Separator />
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Remarks</h3>
                  <p className="text-sm text-muted-foreground">{studentData.remarks}</p>
                </div>
              </>
            )}
          </div>

          <DialogFooter className="flex-shrink-0 flex justify-between mt-6">
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleEdit} className="flex items-center gap-2">
                <Edit className="h-4 w-4" />
                Edit
              </Button>
              {studentData.id && onDelete && (
                <Button
                  variant="outline"
                  onClick={handleDelete}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              )}
            </div>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4 mr-2" />
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
