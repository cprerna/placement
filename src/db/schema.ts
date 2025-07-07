import { integer, pgTable, text, varchar } from 'drizzle-orm/pg-core';

export const studentsTable = pgTable('students', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  region: varchar({ length: 255 }),
  center_name: varchar({ length: 255 }),
  reporting_month: varchar({ length: 100 }),
  unique_code: varchar({ length: 50 }),
  name: varchar({ length: 255 }).notNull(),
  photo_key: varchar({ length: 255 }), // S3 key for deletion
  application_form_key: varchar({ length: 255 }), // S3 key for deletion
  attendance_key: varchar({ length: 255 }), // S3 key for deletion
  placement_doc_key: varchar({ length: 255 }), // S3 key for deletion
  course: varchar({ length: 100 }),
  gender: varchar({ length: 100 }),
  phone: varchar({ length: 100 }),
  email: varchar({ length: 255 }).notNull(),
  educational_qualification: varchar({ length: 100 }),
  start_date: varchar({ length: 100 }),
  end_date: varchar({ length: 100 }),
  placement_month: varchar({ length: 100 }),
  city: varchar({ length: 100 }),
  state: varchar({ length: 100 }),
  address: text(),
  company_name: varchar({ length: 255 }),
  designation: varchar({ length: 100 }),
  sector: text(),
  posting_entry_level_job: varchar({ length: 10 }),
  placement_county: varchar({ length: 100 }),
  placement_proof_key: varchar({ length: 255 }), // S3 key for deletion
  training_proof_key: varchar({ length: 255 }), // S3 key for deletion
  training_proof_uploaded: varchar({ length: 10 }),
  placement_proof_uploaded: varchar({ length: 10 }),
  green_job: varchar({ length: 10 }),
  household_women_headed: varchar({ length: 10 }),
  pre_training_income: varchar({ length: 100 }),
  post_training_income: varchar({ length: 100 }),
  remarks: text(),
});
