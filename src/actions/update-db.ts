'use server';

import { db } from '@/db/drizzle';
import { studentsTable } from '@/db/schema';
import { eq, InferInsertModel } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

// Use Drizzle's inferred types
type Student = InferInsertModel<typeof studentsTable>;
type StudentUpdateData = Partial<Student> & { id: number };

// Update database
export default async function updatedStudent(data: StudentUpdateData) {
  try {
    if (!data.id) {
      throw new Error('Student ID is required for update');
    }

    // Extract id from data and create update object without id
    const { id, ...updateData } = data;

    // Remove undefined values to avoid updating with null
    const cleanedData = Object.fromEntries(Object.entries(updateData).filter(([_, value]) => value !== undefined));

    if (Object.keys(cleanedData).length === 0) {
      throw new Error('No data provided for update');
    }

    // Update the student record
    const updatedStudent = await db.update(studentsTable).set(cleanedData).where(eq(studentsTable.id, id)).returning();

    if (updatedStudent.length === 0) {
      throw new Error('Student not found or no changes were made');
    }

    // Revalidate the page to reflect changes
    revalidatePath('/');

    return {
      success: true,
      data: updatedStudent[0],
      message: 'Student record updated successfully',
    };
  } catch (error) {
    console.error('Error updating student record:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      message: 'Failed to update student record',
    };
  }
}
