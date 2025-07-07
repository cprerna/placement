import { DataTable } from "@/components/datatable";
import Graphs from "@/components/graphs";

export default function App() {
  return (
    <div className="rounded-2xl bg-white p-6">
      <Graphs/>
      <DataTable/>
    </div>
  );
}
