import { db } from './db/drizzle';
import { studentsTable } from './db/schema';
import studentsData from './data/data.json';

async function main() {
  try {
    // Remove id field from each record and insert into database
    const studentsToInsert = studentsData.map((student) => {
      const { id, ...studentWithoutId } = student;
      return studentWithoutId;
    });

    console.log(`Preparing to insert ${studentsToInsert.length} students...`);

    // Insert in smaller batches to avoid parameter limit issues
    const batchSize = 100;
    const batches = [];

    for (let i = 0; i < studentsToInsert.length; i += batchSize) {
      batches.push(studentsToInsert.slice(i, i + batchSize));
    }

    console.log(`Splitting into ${batches.length} batches of ${batchSize} records each...`);

    for (let i = 0; i < batches.length; i++) {
      console.log(`Inserting batch ${i + 1}/${batches.length}...`);

      try {
        const result = await db.insert(studentsTable).values(batches[i]);
        console.log(`Batch ${i + 1} inserted successfully!`);
      } catch (batchError) {
        console.error(`Error inserting batch ${i + 1}:`, batchError);
        // Log the first record of the failed batch for debugging
        console.log('First record in failed batch:', JSON.stringify(batches[i][0], null, 2));
        break;
      }
    }

    console.log('All students inserted successfully!');
  } catch (error) {
    console.error('Error inserting students:', error);
  }
}

main();
