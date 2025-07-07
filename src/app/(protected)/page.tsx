import Graphs from '@/components/graphs';
import { db } from '@/db/drizzle';
import { studentsTable } from '@/db/schema';
import { sql, count } from 'drizzle-orm';

export default async function App() {
  // Fetch aggregated gender data using GROUP BY
  const genderData = await db
    .select({
      name: studentsTable.gender,
      value: count(studentsTable.id),
    })
    .from(studentsTable)
    .where(sql`${studentsTable.gender} IS NOT NULL AND ${studentsTable.gender} != ''`)
    .groupBy(studentsTable.gender);

  // Fetch aggregated region data using GROUP BY
  const regionData = await db
    .select({
      name: studentsTable.region,
      value: count(studentsTable.id),
    })
    .from(studentsTable)
    .where(sql`${studentsTable.region} IS NOT NULL AND ${studentsTable.region} != ''`)
    .groupBy(studentsTable.region);

  return (
    <div className="rounded-2xl bg-white p-6 w-full max-w-full overflow-hidden">
      <Graphs genderData={genderData} regionData={regionData} />
    </div>
  );
}
