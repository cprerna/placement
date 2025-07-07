import { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { studentsTable } from './schema';

// Type for selecting data from the database (includes all fields including auto-generated id)
export type Student = InferSelectModel<typeof studentsTable>;

// Type for inserting data into the database (excludes auto-generated id)
export type NewStudent = InferInsertModel<typeof studentsTable>;

// Type for updating data (all fields optional except id)
export type UpdateStudent = Partial<NewStudent> & { id: number };

// Type for the raw data from your JSON file (includes id as it might be present)
export type StudentData = {
  id?: number;
  region?: string | null;
  center_name?: string | null;
  reporting_month?: string | null;
  unique_code?: string | null;
  name: string;
  photo?: string | null;
  application_form?: string | null;
  attendance?: string | null;
  placement_doc?: string | null;
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
  training_proof?: string | null;
  training_proof_uploaded?: string | null;
  placement_proof_uploaded?: string | null;
  green_job?: string | null;
  household_women_headed?: string | null;
  pre_training_income?: string | null;
  post_training_income?: string | null;
  remarks?: string | null;
};
