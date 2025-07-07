import studentsData from './data/data.json';

// Check if all data fields are accounted for in the schema
function validateSchema() {
  console.log('Validating schema against data...');

  // Get all unique keys from the data
  const allKeys = new Set();
  const sampleRecord = studentsData[0];

  Object.keys(sampleRecord).forEach((key) => {
    allKeys.add(key);
  });

  console.log('Fields found in data:', Array.from(allKeys).sort());

  // Schema fields (excluding id which will be auto-generated)
  const schemaFields = [
    'region',
    'center_name',
    'reporting_month',
    'unique_code',
    'name',
    'photo',
    'application_form',
    'attendance',
    'placement_doc',
    'course',
    'gender',
    'phone',
    'email',
    'educational_qualification',
    'start_date',
    'end_date',
    'placement_month',
    'city',
    'state',
    'address',
    'company_name',
    'designation',
    'sector',
    'posting_entry_level_job',
    'placement_county',
    'placement_proof',
    'training_proof',
    'training_proof_uploaded',
    'placement_proof_uploaded',
    'green_job',
    'household_women_headed',
    'pre_training_income',
    'post_training_income',
    'remarks',
  ];

  console.log('Schema fields:', schemaFields.sort());

  // Check for missing fields in schema
  const dataFields = Array.from(allKeys).filter((key) => key !== 'id');
  const missingInSchema = dataFields.filter((field) => !schemaFields.includes(field as string));
  const missingInData = schemaFields.filter((field) => !dataFields.includes(field));

  if (missingInSchema.length > 0) {
    console.error('❌ Fields in data but missing in schema:', missingInSchema);
  }

  if (missingInData.length > 0) {
    console.error('❌ Fields in schema but missing in data:', missingInData);
  }

  if (missingInSchema.length === 0 && missingInData.length === 0) {
    console.log('✅ Schema and data fields match perfectly!');
  }

  // Check for potential data type issues
  console.log('\nChecking data types and lengths...');

  // Check for very long values that might exceed varchar limits
  const longFields: Array<{
    record: number;
    field: string;
    length: number;
    value: string;
  }> = [];

  studentsData.slice(0, 10).forEach((record, index) => {
    Object.entries(record).forEach(([key, value]) => {
      if (typeof value === 'string' && value.length > 255) {
        longFields.push({
          record: index,
          field: key,
          length: value.length,
          value: value.substring(0, 100) + '...',
        });
      }
    });
  });

  if (longFields.length > 0) {
    console.log('⚠️  Fields with values longer than 255 characters:');
    longFields.forEach((field) => {
      console.log(`  Record ${field.record}, Field: ${field.field}, Length: ${field.length}`);
      console.log(`  Value: ${field.value}`);
    });
  } else {
    console.log('✅ All field values are within reasonable length limits');
  }

  // Sample data structure
  console.log('\nSample record structure:');
  const { id, ...recordWithoutId } = sampleRecord;
  console.log(JSON.stringify(recordWithoutId, null, 2));
}

validateSchema();
