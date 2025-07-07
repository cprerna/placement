import { db } from './db/drizzle';
import { studentsTable } from './db/schema';
import { NewStudent, StudentData } from './db/types';
import studentsData from './data/data.json';

async function testSingleInsert() {
  try {
    console.log('Testing single record insertion...');

    // Get the first student record and remove the id
    const firstStudent = studentsData[4];
    const { id, ...studentWithoutId } = firstStudent;

    console.log('Sample data structure:', JSON.stringify(studentWithoutId, null, 2));

    // Test inserting just one record
    const result = await db.insert(studentsTable).values(studentWithoutId);

    console.log('Single record inserted successfully!');
    console.log('Result:', result);
  } catch (error) {
    console.error('Error inserting single record:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
  }
}

testSingleInsert();
