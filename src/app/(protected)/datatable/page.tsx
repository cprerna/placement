import { DataTable } from '@/components/datatable';
import { db } from '@/db/drizzle';
import { studentsTable } from '@/db/schema';

export default async function Page() {
  let data;
  try {
    data = await db.select().from(studentsTable);
  } catch (error) {
    console.error('Error fetching data:', error);
    return <div>Error loading data</div>;
  }

  return (
    <div className="rounded-2xl bg-white p-6 w-full max-w-full overflow-hidden">
      <DataTable data={data} />
    </div>
  );
}
