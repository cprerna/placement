'use client';

import * as React from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { ArrowUpDown, ChevronDown, Printer, Eye } from 'lucide-react';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';

import { Button } from '@/components/ui/button';
import { AddEditForm } from '@/components/add-edit-form';
import { ViewForm } from '@/components/view-form';
import { deleteStudentAction } from '@/actions/student-form-action';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import data from '@/data/data.json';
import { InferSelectModel } from 'drizzle-orm';
import { studentsTable } from '@/db/schema';

export type PlacementData = {
  id: number;
  region: string;
  center_name: string;
  reporting_month: string;
  unique_code: string;
  name: string;
  course: string;
  gender: string;
  phone: string;
  email: string;
  educational_qualification: string;
  start_date: string;
  end_date: string;
  placement_month: string;
  city: string;
  state: string;
  address: string;
  company_name: string;
  designation: string;
  sector: string;
  posting_entry_level_job: string;
  placement_county: string;
  training_proof_uploaded: string;
  placement_proof_uploaded: string;
  green_job: string;
  household_women_headed: string;
  pre_training_income: string;
  post_training_income: string;
  remarks: string;
};

export const columns: ColumnDef<InferSelectModel<typeof studentsTable>>[] = [
  {
    accessorKey: 'unique_code',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Code
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => <div className="font-mono">{row.getValue('unique_code')}</div>,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Name
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Email
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => <div className="lowercase">{row.getValue('email')}</div>,
  },
  {
    accessorKey: 'phone',
    header: 'Phone',
    cell: ({ row }) => <div className="font-mono">{row.getValue('phone')}</div>,
  },
  {
    accessorKey: 'gender',
    header: 'Gender',
    cell: ({ row }) => <div className="capitalize">{row.getValue('gender')}</div>,
  },
  {
    accessorKey: 'course',
    header: 'Course',
    cell: ({ row }) => <div>{row.getValue('course')}</div>,
  },
  {
    accessorKey: 'educational_qualification',
    header: 'Education',
    cell: ({ row }) => <div>{row.getValue('educational_qualification')}</div>,
  },
  {
    accessorKey: 'region',
    header: 'Region',
    cell: ({ row }) => <div>{row.getValue('region')}</div>,
  },
  {
    accessorKey: 'city',
    header: 'City',
    cell: ({ row }) => <div>{row.getValue('city')}</div>,
  },
  {
    accessorKey: 'state',
    header: 'State',
    cell: ({ row }) => <div>{row.getValue('state')}</div>,
  },
  {
    accessorKey: 'company_name',
    header: 'Company',
    cell: ({ row }) => <div className="font-medium">{row.getValue('company_name')}</div>,
  },
  {
    accessorKey: 'designation',
    header: 'Designation',
    cell: ({ row }) => <div>{row.getValue('designation')}</div>,
  },
  {
    accessorKey: 'sector',
    header: 'Sector',
    cell: ({ row }) => <div className="max-w-[150px] truncate">{row.getValue('sector')}</div>,
  },
  {
    accessorKey: 'placement_month',
    header: 'Placement Month',
    cell: ({ row }) => <div className="whitespace-nowrap">{row.getValue('placement_month')}</div>,
  },
  {
    accessorKey: 'start_date',
    header: 'Start Date',
    cell: ({ row }) => <div className="font-mono whitespace-nowrap">{row.getValue('start_date')}</div>,
  },
  {
    accessorKey: 'end_date',
    header: 'End Date',
    cell: ({ row }) => <div className="font-mono whitespace-nowrap">{row.getValue('end_date')}</div>,
  },
  {
    accessorKey: 'pre_training_income',
    header: 'Pre-Training Income',
    cell: ({ row }) => <div className="whitespace-nowrap">{row.getValue('pre_training_income')}</div>,
  },
  {
    accessorKey: 'post_training_income',
    header: 'Post-Training Income',
    cell: ({ row }) => <div className="font-medium whitespace-nowrap">{row.getValue('post_training_income')}</div>,
  },
  {
    accessorKey: 'green_job',
    header: 'Green Job',
    cell: ({ row }) => <div className="capitalize">{row.getValue('green_job')}</div>,
  },
  {
    accessorKey: 'household_women_headed',
    header: 'Women Headed Household',
    cell: ({ row }) => <div className="capitalize">{row.getValue('household_women_headed')}</div>,
  },
  {
    accessorKey: 'posting_entry_level_job',
    header: 'Entry Level',
    cell: ({ row }) => <div className="capitalize">{row.getValue('posting_entry_level_job')}</div>,
  },
  {
    accessorKey: 'placement_county',
    header: 'Country',
    cell: ({ row }) => <div>{row.getValue('placement_county')}</div>,
  },
  {
    accessorKey: 'address',
    header: 'Address',
    cell: ({ row }) => <div className="max-w-[150px] truncate">{row.getValue('address')}</div>,
  },
  {
    accessorKey: 'remarks',
    header: 'Remarks',
    cell: ({ row }) => <div className="max-w-[120px] truncate">{row.getValue('remarks')}</div>,
  },
];

export function DataTable({ data = [] }: { data: InferSelectModel<typeof studentsTable>[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [selectedRow, setSelectedRow] = React.useState<InferSelectModel<typeof studentsTable> | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);

  const handleRowClick = (row: InferSelectModel<typeof studentsTable>) => {
    setSelectedRow(row);
    setIsEditDialogOpen(false); // Reset edit dialog state
    setIsViewDialogOpen(true);
  };

  const handleViewDialogClose = (open: boolean) => {
    setIsViewDialogOpen(open);
    // Don't clear selectedRow here if we're transitioning to edit
    if (!open && !isEditDialogOpen) {
      setSelectedRow(null);
    }
  };

  const handleEdit = () => {
    console.log('Edit button clicked, current selectedRow:', selectedRow);
    console.log('Setting edit dialog to true');
    setIsViewDialogOpen(false);
    setIsEditDialogOpen(true);
  };

  const handleEditComplete = async (data: any) => {
    console.log('Edit completed, refreshing data...');
    // Handle any data refresh logic here if needed
    setIsEditDialogOpen(false);
    setIsViewDialogOpen(false);
    setSelectedRow(null);
  };

  const handleEditDialogClose = (open: boolean) => {
    setIsEditDialogOpen(open);
    if (!open) {
      setSelectedRow(null);
      setIsViewDialogOpen(false);
    }
  };

  const handleDelete = async (id: number) => {
    console.log('Delete student with ID:', id);

    try {
      const result = await deleteStudentAction(id);

      if (result.success) {
        console.log('Student deleted successfully:', result.message);
        setIsViewDialogOpen(false);
        setSelectedRow(null);
        // The page will be revalidated automatically by the server action
      } else {
        console.error('Failed to delete student:', result.error);
        alert(`Failed to delete student: ${result.error}`);
      }
    } catch (error) {
      console.error('Error deleting student:', error);
      alert('An error occurred while deleting the student. Please try again.');
    }
  };

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: 'includesString',
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
    },
  });

  // Count male and female
  const genderCounts = data.reduce(
    (acc, curr) => {
      const gender = (curr.gender || '').toLowerCase();
      if (gender === 'male') acc.male += 1;
      else if (gender === 'female') acc.female += 1;
      else acc.other += 1;
      return acc;
    },
    { male: 0, female: 0, other: 0 }
  );

  const genderChartData = {
    labels: ['Male', 'Female', 'Other'],
    datasets: [
      {
        data: [genderCounts.male, genderCounts.female, genderCounts.other],
        backgroundColor: ['#60a5fa', '#f472b6', '#a3a3a3'],
      },
    ],
  };

  // Count by region
  const regionMap: Record<string, number> = {};
  data.forEach((item) => {
    const region = item.region || 'Unknown';
    regionMap[region] = (regionMap[region] || 0) + 1;
  });

  const regionChartData = {
    labels: Object.keys(regionMap),
    datasets: [
      {
        label: 'Placements',
        data: Object.values(regionMap),
        backgroundColor: '#34d399',
      },
    ],
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center space-x-4">
          <Input
            placeholder="Search all fields..."
            value={globalFilter ?? ''}
            onChange={(event) => setGlobalFilter(String(event.target.value))}
            className="max-w-sm lg:min-w-md"
          />
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Columns <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                      onSelect={(event) => event.preventDefault()}
                    >
                      {column.id.replace(/_/g, ' ')}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          <AddEditForm mode="add" />
        </div>
      </div>
      {/* Responsive Table Wrapper */}
      <div className="w-full">
        <div className="overflow-x-auto border rounded-lg">
          <div className="overflow-y-auto">
            <Table className="w-full">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} className="whitespace-nowrap">
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleRowClick(row.original)}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredRowModel().rows.length} total row(s).
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>

      {/* View Student Modal */}
      {selectedRow && (
        <ViewForm
          studentData={selectedRow}
          open={isViewDialogOpen}
          onOpenChange={handleViewDialogClose}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Edit Student Modal */}
      {selectedRow && (
        <AddEditForm
          mode="edit"
          studentData={selectedRow}
          open={isEditDialogOpen}
          onOpenChange={handleEditDialogClose}
          onSubmit={handleEditComplete}
        />
      )}
    </div>
  );
}
