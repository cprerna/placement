'use server';

import { db } from '@/db/drizzle';
import { studentsTable } from '@/db/schema';
import { eq, InferInsertModel } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { deleteStudentFiles } from '@/lib/s3-utils';

// Use Drizzle's inferred types
type Student = InferInsertModel<typeof studentsTable>;
type StudentFormData = Partial<Student> & { id?: number };

export interface FormActionResult {
  success: boolean;
  data?: Student;
  error?: string;
  message: string;
}

// Unified action to handle both add and edit operations
export async function studentFormAction(data: StudentFormData): Promise<FormActionResult> {
  console.log('🔄 Server action called with data:', data);

  try {
    // Detect if this is an add or edit operation
    const isEdit = data.id !== undefined && data.id !== null;

    console.log('📝 Operation type:', isEdit ? 'EDIT' : 'ADD');
    console.log('🆔 ID present:', data.id);

    if (isEdit) {
      // Edit operation
      console.log('🔄 Calling updateStudent function');
      return await updateStudent(data as StudentFormData & { id: number });
    } else {
      // Add operation
      console.log('➕ Calling addStudent function');
      return await addStudent(data);
    }
  } catch (error) {
    console.error('💥 Error in student form action:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      message: 'Failed to process student form',
    };
  }
}

// Add new student
async function addStudent(data: StudentFormData): Promise<FormActionResult> {
  try {
    // Remove id field for insert operation
    const { id, ...insertData } = data;

    // Remove undefined values to avoid inserting null
    const cleanedData = Object.fromEntries(
      Object.entries(insertData).filter(([_, value]) => value !== undefined && value !== '')
    ) as Student;

    // Validate required fields
    if (!cleanedData.name || !cleanedData.email) {
      throw new Error('Name and email are required fields');
    }

    // Insert the new student record
    const newStudent = await db.insert(studentsTable).values(cleanedData).returning();

    if (newStudent.length === 0) {
      throw new Error('Failed to create student record');
    }

    // Revalidate the page to reflect changes
    revalidatePath('/');

    return {
      success: true,
      data: newStudent[0],
      message: 'Student record created successfully',
    };
  } catch (error) {
    console.error('Error adding student record:', error);
    throw error;
  }
}

// Update existing student
async function updateStudent(data: StudentFormData & { id: number }): Promise<FormActionResult> {
  console.log('🔧 UpdateStudent function called with:', data);

  try {
    if (!data.id) {
      throw new Error('Student ID is required for update');
    }

    // Extract id from data and create update object without id
    const { id, ...updateData } = data;

    console.log('🆔 Student ID:', id);
    console.log('📊 Update data (before cleaning):', updateData);

    // Remove undefined values to avoid updating with null
    const cleanedData = Object.fromEntries(Object.entries(updateData).filter(([_, value]) => value !== undefined));

    console.log('🧹 Cleaned data:', cleanedData);
    console.log('📈 Fields to update count:', Object.keys(cleanedData).length);

    if (Object.keys(cleanedData).length === 0) {
      throw new Error('No data provided for update');
    }

    // Update the student record
    console.log('💾 Executing database update...');
    const updatedStudent = await db.update(studentsTable).set(cleanedData).where(eq(studentsTable.id, id)).returning();

    console.log('📤 Database response:', updatedStudent);

    if (updatedStudent.length === 0) {
      throw new Error('Student not found or no changes were made');
    }

    // Revalidate the page to reflect changes
    revalidatePath('/');

    console.log('✅ Update successful!');
    return {
      success: true,
      data: updatedStudent[0],
      message: 'Student record updated successfully',
    };
  } catch (error) {
    console.error('💥 Error updating student record:', error);
    throw error;
  }
}

// Delete student
export async function deleteStudentAction(id: number): Promise<FormActionResult> {
  console.log('🗑️ Delete student action called with ID:', id);

  try {
    if (!id) {
      throw new Error('Student ID is required for deletion');
    }

    // First, get the student record to retrieve file keys for cleanup
    const studentToDelete = await db.select().from(studentsTable).where(eq(studentsTable.id, id));

    if (studentToDelete.length === 0) {
      throw new Error('Student not found');
    }

    const student = studentToDelete[0];
    console.log('📋 Student found for deletion:', student.name);

    // Delete associated files from S3
    try {
      await deleteStudentFiles({
        photo_key: student.photo_key,
        application_form_key: student.application_form_key,
        attendance_key: student.attendance_key,
        placement_doc_key: student.placement_doc_key,
        placement_proof_key: student.placement_proof_key,
        training_proof_key: student.training_proof_key,
      });
      console.log('🗂️ Associated files deleted from S3');
    } catch (fileError) {
      console.error('⚠️ Error deleting files from S3:', fileError);
      // Continue with database deletion even if file deletion fails
    }

    // Delete the student record from database
    const deletedStudent = await db.delete(studentsTable).where(eq(studentsTable.id, id)).returning();

    if (deletedStudent.length === 0) {
      throw new Error('Failed to delete student record');
    }

    // Revalidate the page to reflect changes
    revalidatePath('/');

    console.log('✅ Student deleted successfully');
    return {
      success: true,
      data: deletedStudent[0],
      message: 'Student record deleted successfully',
    };
  } catch (error) {
    console.error('💥 Error deleting student record:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      message: 'Failed to delete student record',
    };
  }
}
