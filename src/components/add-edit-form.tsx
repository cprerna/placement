'use client';

import * as React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Plus, Edit } from 'lucide-react';
import { FileUpload } from '@/components/file-upload';
import { DatePicker } from '@/components/ui/date-picker';
import { MonthPicker } from '@/components/ui/month-picker';
import { studentFormAction, FormActionResult } from '@/actions/student-form-action';
import { Infer } from 'next/dist/compiled/superstruct';
import { InferInsertModel } from 'drizzle-orm';
import { studentsTable } from '@/db/schema';

// Zod validation schema
const studentSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || val === '' || /^\d{10}$/.test(val), {
      message: 'Phone number must be exactly 10 digits or empty',
    }),
  gender: z.enum(['Male', 'Female', 'Other']).optional(),
  unique_code: z.string().optional(),
  educational_qualification: z.string().optional(),
  region: z.string().optional(),
  center_name: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  address: z.string().optional(),
  course: z.string().optional(),
  reporting_month: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  company_name: z.string().optional(),
  designation: z.string().optional(),
  sector: z.string().optional(),
  placement_month: z.string().optional(),
  placement_county: z.string().optional(),
  pre_training_income: z.string().optional(),
  post_training_income: z.string().optional(),
  photo: z.string().optional(),
  photo_key: z.string().optional(),
  application_form: z.string().optional(),
  application_form_key: z.string().optional(),
  attendance: z.string().optional(),
  attendance_key: z.string().optional(),
  placement_doc: z.string().optional(),
  placement_doc_key: z.string().optional(),
  placement_proof: z.string().optional(),
  placement_proof_key: z.string().optional(),
  training_proof: z.string().optional(),
  training_proof_key: z.string().optional(),
  posting_entry_level_job: z.string().optional(),
  green_job: z.string().optional(),
  household_women_headed: z.string().optional(),
  training_proof_uploaded: z.string().optional(),
  placement_proof_uploaded: z.string().optional(),
  remarks: z.string().optional(),
});

type StudentFormData = z.infer<typeof studentSchema>;

// Helper function to convert null values to empty strings for form compatibility
const convertStudentDataForForm = (data: StudentData): StudentFormData => {
  const formData: any = {};

  for (const [key, value] of Object.entries(data)) {
    if (key === 'id') continue; // Skip ID field for form

    if (value === null || value === undefined) {
      // Convert null/undefined to appropriate default values
      if (
        [
          'posting_entry_level_job',
          'green_job',
          'household_women_headed',
          'training_proof_uploaded',
          'placement_proof_uploaded',
        ].includes(key)
      ) {
        formData[key] = 'No';
      } else {
        formData[key] = '';
      }
    } else if ((key === 'reporting_month' || key === 'placement_month') && typeof value === 'string') {
      // Handle legacy month formats like "May" -> "2025-05"
      formData[key] = normalizeMonthValue(value);
    } else if ((key === 'start_date' || key === 'end_date') && typeof value === 'string') {
      // Handle legacy date formats
      formData[key] = normalizeDateValue(value);
    } else {
      formData[key] = value;
    }
  }

  return formData as StudentFormData;
};

// Helper function to normalize month values from legacy format
const normalizeMonthValue = (value: string): string => {
  if (!value) return '';

  // If already in YYYY-MM format, return as-is
  if (/^\d{4}-\d{2}$/.test(value)) {
    return value;
  }

  // If it's just a month name, convert to 2025-MM format
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const monthIndex = monthNames.findIndex((month) => month.toLowerCase() === value.toLowerCase());

  if (monthIndex !== -1) {
    return `2025-${String(monthIndex + 1).padStart(2, '0')}`;
  }

  // If it's in MMM format (like "May"), try to match
  const shortMonthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const shortMonthIndex = shortMonthNames.findIndex((month) => month.toLowerCase() === value.toLowerCase());

  if (shortMonthIndex !== -1) {
    return `2025-${String(shortMonthIndex + 1).padStart(2, '0')}`;
  }

  // If no match found, return empty string to avoid errors
  return '';
};

// Helper function to normalize date values from legacy format
const normalizeDateValue = (value: string): string => {
  if (!value) return '';

  // If already in YYYY-MM-DD format, return as-is
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  // Try to parse the date and see if it's valid
  try {
    const date = new Date(value);
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0]; // Return YYYY-MM-DD format
    }
  } catch (error) {
    console.warn('Could not parse date value:', value);
  }

  // If no valid date found, return empty string to avoid errors
  return '';
};

// Type for student data based on the schema
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

interface AddEditFormProps {
  mode: 'add' | 'edit';
  studentData?: StudentData;
  onSubmit?: (data: StudentData) => Promise<void>;
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AddEditForm({
  mode,
  studentData,
  onSubmit,
  children,
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
}: AddEditFormProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Use external state if provided, otherwise use internal state
  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = externalOnOpenChange || setInternalOpen;

  const form = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      gender: undefined,
      unique_code: '',
      educational_qualification: '',
      region: '',
      center_name: '',
      city: '',
      state: '',
      address: '',
      course: '',
      reporting_month: '',
      start_date: '',
      end_date: '',
      company_name: '',
      designation: '',
      sector: '',
      placement_month: '',
      placement_county: '',
      pre_training_income: '',
      post_training_income: '',
      photo: '',
      photo_key: '',
      application_form: '',
      application_form_key: '',
      attendance: '',
      attendance_key: '',
      placement_doc: '',
      placement_doc_key: '',
      placement_proof: '',
      placement_proof_key: '',
      training_proof: '',
      training_proof_key: '',
      posting_entry_level_job: 'No',
      green_job: 'No',
      household_women_headed: 'No',
      training_proof_uploaded: 'No',
      placement_proof_uploaded: 'No',
      remarks: '',
    },
  });

  const handleFileUpload = (field: keyof StudentFormData, url: string, key: string) => {
    const keyField = `${field}_key` as keyof StudentFormData;
    form.setValue(field, url);
    form.setValue(keyField, key);
  };

  const handleFileRemove = (field: keyof StudentFormData, _key: string) => {
    const keyField = `${field}_key` as keyof StudentFormData;
    form.setValue(field, '');
    form.setValue(keyField, '');
  };

  const handleFormSubmit = async (data: StudentFormData) => {
    setLoading(true);
    console.log('🚀 Form submission started');
    console.log('Mode:', mode);
    console.log('Student data ID:', studentData?.id);
    console.log('Form data:', data);

    try {
      // Prepare data for submission
      const submitData = mode === 'edit' && studentData?.id ? { ...data, id: studentData.id } : data;

      console.log('📤 Submit data prepared:', submitData);
      console.log('Is edit mode?', mode === 'edit');
      console.log('Has student ID?', !!studentData?.id);

      const result: FormActionResult = await studentFormAction(submitData);

      console.log('📥 Action result:', result);

      if (result.success) {
        console.log('✅ Form submitted successfully:', result.message);
        setOpen(false);
        if (mode === 'add') {
          form.reset();
        }
        // Optionally call onSubmit callback if provided and result.data exists
        if (onSubmit && result.data) {
          await onSubmit(result.data as StudentData);
        }
      } else {
        console.error('❌ Form submission failed:', result.error);
        // You could show a toast notification here
      }
    } catch (error) {
      console.error('💥 Error submitting form:', error);
    } finally {
      setLoading(false);
      console.log('🏁 Form submission completed');
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen && mode === 'add') {
      form.reset();
    } else if (isOpen && studentData) {
      console.log('🔄 Resetting form with student data:', studentData);
      const formData = convertStudentDataForForm(studentData);
      console.log('📋 Converted form data:', formData);
      form.reset(formData);
    }
  };

  // Update form data when studentData prop changes
  React.useEffect(() => {
    if (studentData && open) {
      console.log('🔄 Effect: Resetting form with student data:', studentData);
      const formData = convertStudentDataForForm(studentData);
      console.log('📋 Effect: Converted form data:', formData);
      form.reset(formData);
    } else if (open && mode === 'add') {
      form.reset();
    }
  }, [studentData, open, mode, form]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}

      {!children && (
        <DialogTrigger asChild>
          <Button variant={mode === 'add' ? 'default' : 'outline'}>
            {mode === 'add' ? (
              <>
                <Plus className="h-4 w-4" />
                Add Student
              </>
            ) : (
              <>
                <Edit className="h-4 w-4" />
                Edit
              </>
            )}
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="min-w-10/12 max-w-11/12 sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === 'add' ? 'Add New Student' : 'Edit Student'}</DialogTitle>
          <DialogDescription>
            {mode === 'add'
              ? 'Fill in the details to add a new student record.'
              : 'Update the student information below.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={(e) => {
              console.log('📝 Form onSubmit event fired');
              console.log('🔍 Event details:', e);
              return form.handleSubmit(handleFormSubmit)(e);
            }}
            className="space-y-6"
          >
            {/* Basic Information Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">Basic Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone (10 digits)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="1234567890"
                          maxLength={10}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex flex-row space-x-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Male" id="male" />
                            <Label htmlFor="male">Male</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Female" id="female" />
                            <Label htmlFor="female">Female</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Other" id="other" />
                            <Label htmlFor="other">Other</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="unique_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unique Code</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="educational_qualification"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Educational Qualification</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Location Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Location Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="region"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Region</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="center_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Center Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="md:row-span-2">
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Enter full address..." className="min-h-[100px]" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Training Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Training Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="course"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="reporting_month"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reporting Month</FormLabel>
                      <FormControl>
                        <MonthPicker
                          value={field.value}
                          onValueChange={field.onChange}
                          placeholder="Select reporting month"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="start_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <DatePicker
                          value={field.value}
                          onValueChange={field.onChange}
                          placeholder="Select start date"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="end_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <DatePicker value={field.value} onValueChange={field.onChange} placeholder="Select end date" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Placement Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Placement Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="company_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="designation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Designation</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sector"
                  render={({ field }) => (
                    <FormItem className="md:row-span-2">
                      <FormLabel>Sector</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Enter sector details..." className="min-h-[100px]" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="placement_month"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Placement Month</FormLabel>
                        <FormControl>
                          <MonthPicker
                            value={field.value}
                            onValueChange={field.onChange}
                            placeholder="Select placement month"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="placement_county"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Placement County</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Income Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Income Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="pre_training_income"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pre-Training Income</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="post_training_income"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Post-Training Income</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Document Uploads Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Document Uploads</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FileUpload
                  label="Photo"
                  accept="image/*"
                  placeholder="Upload student photo (JPG, PNG, etc.)"
                  currentFileUrl={form.watch('photo') || undefined}
                  currentFileKey={form.watch('photo_key') || undefined}
                  onFileUpload={(url, key) => handleFileUpload('photo', url, key)}
                  onFileRemove={(key) => handleFileRemove('photo', key)}
                  disabled={loading}
                />
                <FileUpload
                  label="Application Form"
                  accept=".pdf,.doc,.docx"
                  placeholder="Upload application form (PDF, DOC, etc.)"
                  currentFileUrl={form.watch('application_form') || undefined}
                  currentFileKey={form.watch('application_form_key') || undefined}
                  onFileUpload={(url, key) => handleFileUpload('application_form', url, key)}
                  onFileRemove={(key) => handleFileRemove('application_form', key)}
                  disabled={loading}
                />
                <FileUpload
                  label="Attendance Document"
                  accept=".pdf,.doc,.docx,.xls,.xlsx"
                  placeholder="Upload attendance record (PDF, DOC, XLS, etc.)"
                  currentFileUrl={form.watch('attendance') || undefined}
                  currentFileKey={form.watch('attendance_key') || undefined}
                  onFileUpload={(url, key) => handleFileUpload('attendance', url, key)}
                  onFileRemove={(key) => handleFileRemove('attendance', key)}
                  disabled={loading}
                />
                <FileUpload
                  label="Placement Document"
                  accept=".pdf,.doc,.docx"
                  placeholder="Upload placement document (PDF, DOC, etc.)"
                  currentFileUrl={form.watch('placement_doc') || undefined}
                  currentFileKey={form.watch('placement_doc_key') || undefined}
                  onFileUpload={(url, key) => handleFileUpload('placement_doc', url, key)}
                  onFileRemove={(key) => handleFileRemove('placement_doc', key)}
                  disabled={loading}
                />
                <FileUpload
                  label="Placement Proof"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  placeholder="Upload placement proof (PDF, DOC, Image, etc.)"
                  currentFileUrl={form.watch('placement_proof') || undefined}
                  currentFileKey={form.watch('placement_proof_key') || undefined}
                  onFileUpload={(url, key) => handleFileUpload('placement_proof', url, key)}
                  onFileRemove={(key) => handleFileRemove('placement_proof', key)}
                  disabled={loading}
                />
                <FileUpload
                  label="Training Proof"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  placeholder="Upload training proof (PDF, DOC, Image, etc.)"
                  currentFileUrl={form.watch('training_proof') || undefined}
                  currentFileKey={form.watch('training_proof_key') || undefined}
                  onFileUpload={(url, key) => handleFileUpload('training_proof', url, key)}
                  onFileRemove={(key) => handleFileRemove('training_proof', key)}
                  disabled={loading}
                />
              </div>
            </div>

            <Separator />

            {/* Status Flags Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Status Flags</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="posting_entry_level_job"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value === 'Yes'}
                          onCheckedChange={(checked) => field.onChange(checked ? 'Yes' : 'No')}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">Entry Level Job Posting</FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="green_job"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value === 'Yes'}
                          onCheckedChange={(checked) => field.onChange(checked ? 'Yes' : 'No')}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">Green Job</FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="household_women_headed"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value === 'Yes'}
                          onCheckedChange={(checked) => field.onChange(checked ? 'Yes' : 'No')}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">Women Headed Household</FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="training_proof_uploaded"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value === 'Yes'}
                          onCheckedChange={(checked) => field.onChange(checked ? 'Yes' : 'No')}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">Training Proof Uploaded</FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="placement_proof_uploaded"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value === 'Yes'}
                          onCheckedChange={(checked) => field.onChange(checked ? 'Yes' : 'No')}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">Placement Proof Uploaded</FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Remarks Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Additional Information</h3>
              <FormField
                control={form.control}
                name="remarks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Remarks</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Enter any additional remarks..." className="min-h-[80px]" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                onClick={(e) => {
                  console.log('🔘 Submit button clicked! Mode:', mode, 'Loading:', loading);
                  console.log('🔍 Form state:', {
                    isValid: form.formState.isValid,
                    isSubmitting: form.formState.isSubmitting,
                    errors: form.formState.errors,
                    dirtyFields: form.formState.dirtyFields,
                    touchedFields: form.formState.touchedFields,
                  });
                  console.log('📋 Current form values:', form.getValues());

                  // Don't prevent default, let the form handle submission
                }}
              >
                {loading ? 'Saving...' : mode === 'add' ? 'Add Student' : 'Update Student'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
