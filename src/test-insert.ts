import { db } from './db/drizzle';
import { studentsTable } from './db/schema';
import studentsData from './data/data.json';
import { InferInsertModel } from 'drizzle-orm';

type StudentInsert = InferInsertModel<typeof studentsTable>;

async function testConnection() {
  try {
    console.log('Testing database connection...');
    console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
    console.log('DATABASE_URL preview:', process.env.DATABASE_URL?.substring(0, 30) + '...');

    // Test basic connection
    const testQuery = await db.select().from(studentsTable).limit(1);
    console.log('✅ Database connection successful');
    console.log('Existing records:', testQuery.length);
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

async function testSingleInsert() {
  try {
    console.log('Testing single record insertion...');

    // First test connection
    const connectionOk = await testConnection();
    if (!connectionOk) {
      console.log('Skipping insert test due to connection failure');
      return;
    }

    // Get the first student record and remove the id
    const firstStudent = studentsData[0];
    const { id, ...studentWithoutId } = firstStudent;

    console.log('Sample data structure:', JSON.stringify(studentWithoutId, null, 2));

    // Clean the data - remove any undefined values and ensure proper types
    const cleanedData = Object.fromEntries(
      Object.entries(studentWithoutId).filter(([_, value]) => value !== undefined && value !== null && value !== '')
    ) as StudentInsert;

    console.log('Cleaned data for insertion:', JSON.stringify(cleanedData, null, 2));

    // Ensure required fields are present
    if (!cleanedData.name || !cleanedData.email) {
      throw new Error('Required fields (name, email) are missing');
    }

    // Test inserting just one record with returning clause
    const result = await db.insert(studentsTable).values(cleanedData).returning();

    console.log('✅ Single record inserted successfully!');
    console.log('Inserted record:', result[0]);
  } catch (error) {
    console.error('❌ Error inserting single record:', error);

    // More detailed error logging
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }

    // Check if it's a specific Neon/database error
    if (error && typeof error === 'object' && 'code' in error) {
      console.error('Database error code:', (error as any).code);
      console.error('Database error detail:', (error as any).detail);
    }
  }
}

testSingleInsert();
