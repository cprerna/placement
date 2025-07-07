import { DataTable } from '@/components/datatable';
import Graphs from '@/components/graphs';
import { db } from '@/db/drizzle';
import { studentsTable } from '@/db/schema';

export default async function App() {
  const data = await db.select().from(studentsTable);

  return (
    <div className="rounded-2xl bg-white p-6 w-full max-w-full overflow-hidden">
      <Graphs />
      <DataTable data={data} />
    </div>
  );
}
