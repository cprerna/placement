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
import { ArrowUpDown, ChevronDown, Printer } from 'lucide-react';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import data from '@/data/data.json';

export type PlacementData = {
  id: string;
  region: string;
  center_name: string;
  reporting_month: string;
  unique_code: string;
  name: string;
  photo: string;
  application_form: string;
  attendance: string;
  placement_doc: string;
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
  placement_proof: string;
  training_proof: string;
  training_proof_uploaded: string;
  placement_proof_uploaded: string;
  green_job: string;
  household_women_headed: string;
  pre_training_income: string;
  post_training_income: string;
  remarks: string;
};

export const columns: ColumnDef<PlacementData>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
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
    accessorKey: 'photo',
    header: 'Photo',
    cell: ({ row }) =>
      row.getValue('photo') ? (
        <img
          src={row.getValue('photo')}
          alt="Photo"
          style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 6 }}
        />
      ) : (
        <span className="text-xs text-gray-400">No Photo</span>
      ),
  },
  {
    accessorKey: 'application_form',
    header: 'Application Form',
    cell: ({ row }) =>
      row.getValue('application_form') ? (
        <a
          href={row.getValue('application_form')}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          View
        </a>
      ) : (
        <span className="text-xs text-gray-400">N/A</span>
      ),
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
    accessorKey: 'attendance',
    header: 'Attendance',
    cell: ({ row }) =>
      row.getValue('attendance') ? (
        <a
          href={row.getValue('attendance')}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          View
        </a>
      ) : (
        <span className="text-xs text-gray-400">N/A</span>
      ),
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
    accessorKey: 'placement_doc',
    header: 'Placement Doc',
    cell: ({ row }) =>
      row.getValue('placement_doc') ? (
        <a
          href={row.getValue('placement_doc')}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          View
        </a>
      ) : (
        <span className="text-xs text-gray-400">N/A</span>
      ),
  },
  {
    accessorKey: 'sector',
    header: 'Sector',
    cell: ({ row }) => <div className="max-w-[200px] truncate">{row.getValue('sector')}</div>,
  },
  {
    accessorKey: 'placement_month',
    header: 'Placement Month',
    cell: ({ row }) => <div>{row.getValue('placement_month')}</div>,
  },
  {
    accessorKey: 'start_date',
    header: 'Start Date',
    cell: ({ row }) => <div className="font-mono">{row.getValue('start_date')}</div>,
  },
  {
    accessorKey: 'end_date',
    header: 'End Date',
    cell: ({ row }) => <div className="font-mono">{row.getValue('end_date')}</div>,
  },
  {
    accessorKey: 'pre_training_income',
    header: 'Pre-Training Income',
    cell: ({ row }) => <div>{row.getValue('pre_training_income')}</div>,
  },
  {
    accessorKey: 'post_training_income',
    header: 'Post-Training Income',
    cell: ({ row }) => <div className="font-medium">{row.getValue('post_training_income')}</div>,
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
    cell: ({ row }) => <div className="max-w-[200px] truncate">{row.getValue('address')}</div>,
  },
  {
    accessorKey: 'remarks',
    header: 'Remarks',
    cell: ({ row }) => <div className="max-w-[150px] truncate">{row.getValue('remarks')}</div>,
  },
];

export function DataTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [selectedRow, setSelectedRow] = React.useState<PlacementData | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleRowClick = (row: PlacementData) => {
    setSelectedRow(row);
    setIsModalOpen(true);
  };

  const handlePrint = () => {
    // Small delay to ensure modal is fully rendered
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const handleEdit = () => {
    // TODO: Implement edit functionality
    console.log('Edit clicked for:', selectedRow);
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
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: 'includesString',
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
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
      <div>
          <div className="flex items-center mr-auto py-4">
            <Input
              placeholder="Search all fields..."
              value={globalFilter ?? ''}
              onChange={(event) => setGlobalFilter(String(event.target.value))}
              className="max-w-sm"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-4">
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
          </div>
          {/* Responsive Table Wrapper */}
          <div className="w-full">
            <div className="overflow-x-auto">
              <div className="h-[500px] overflow-y-auto">
                <Table className="min-w-full">
                  <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => {
                          return (
                            <TableHead key={header.id}>
                              {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
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
                          data-state={row.getIsSelected() && 'selected'}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handleRowClick(row.original)}
                        >
                          {row.getVisibleCells().map((cell) => (
                            <TableCell
                              key={cell.id}
                              onClick={(e) => {
                                // Prevent row click when clicking on checkbox
                                if (cell.column.id === 'select') {
                                  e.stopPropagation();
                                }
                              }}
                            >
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
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
            {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
            selected.
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

        {/* Details Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="min-w-[80vw] max-w-none h-[80vh] flex flex-col print:min-w-full print:max-w-none print:h-auto print:max-h-none print:overflow-visible print:block print:p-8">
            <DialogHeader className="flex-shrink-0 print:mb-6">
              <DialogTitle className="print:text-2xl print:font-bold print:text-center print:mb-4">
                Placement Details
              </DialogTitle>
              <DialogDescription className="print:text-lg print:text-center print:mb-6">
                Complete information for {selectedRow?.name}
              </DialogDescription>
              {selectedRow?.photo && (
                <div className="mb-2">
                  <img
                    src={selectedRow.photo}
                    alt="Photo"
                    style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8 }}
                  />
                </div>
              )}
              {selectedRow?.application_form && (
                <div className="mb-4">
                  <a
                    href={selectedRow.application_form}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    Open Application Form
                  </a>
                </div>
              )}
            </DialogHeader>

            {selectedRow && (
              <div className="flex-1 overflow-y-auto print:overflow-visible print:text-black print:bg-white print:block">
                {/* Print Title - only visible in print */}
                <div className="hidden print:block print:text-center print:mb-8">
                  <h1 className="text-3xl font-bold mb-2">Placement Record</h1>
                  <h2 className="text-xl mb-4">
                    {selectedRow.name} - {selectedRow.unique_code}
                  </h2>
                  <hr className="border-gray-800 border-t-2" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4 print:grid-cols-1 print:gap-4 print:py-0">
                  {/* Personal Information */}
                  <div className="space-y-4 print:mb-6 print:break-inside-avoid">
                    <h3 className="text-lg font-semibold border-b pb-2 print:text-xl print:font-bold print:border-b-2 print:border-gray-800 print:pb-3 print:mb-4">
                      Personal Information
                    </h3>
                    
                    <div className="space-y-2 print:space-y-3">
                      <div>
                        <strong>Unique Code:</strong> {selectedRow.unique_code}
                      </div>
                      <div>
                        <strong>Name:</strong> {selectedRow.name}
                      </div>
                      <div>
                        <strong>Email:</strong> {selectedRow.email}
                      </div>
                      <div>
                        <strong>Phone:</strong> {selectedRow.phone}
                      </div>
                      <div>
                        <strong>Gender:</strong> {selectedRow.gender}
                      </div>
                      <div>
                        <strong>Education:</strong> {selectedRow.educational_qualification}
                      </div>
                    </div>
                  </div>

                  {/* Location Information */}
                  <div className="space-y-4 print:mb-6 print:break-inside-avoid">
                    <h3 className="text-lg font-semibold border-b pb-2 print:text-xl print:font-bold print:border-b-2 print:border-gray-800 print:pb-3 print:mb-4">
                      Location Information
                    </h3>
                    <div className="space-y-2 print:space-y-3">
                      <div>
                        <strong>Region:</strong> {selectedRow.region}
                      </div>
                      <div>
                        <strong>City:</strong> {selectedRow.city}
                      </div>
                      <div>
                        <strong>State:</strong> {selectedRow.state}
                      </div>
                      <div>
                        <strong>Country:</strong> {selectedRow.placement_county}
                      </div>
                      <div>
                        <strong>Address:</strong> {selectedRow.address}
                      </div>
                    </div>
                  </div>

                  {/* Training Information */}
                  <div className="space-y-4 print:mb-6 print:break-inside-avoid">
                    <h3 className="text-lg font-semibold border-b pb-2 print:text-xl print:font-bold print:border-b-2 print:border-gray-800 print:pb-3 print:mb-4">
                      Training Information
                    </h3>
                    <div className="space-y-2 print:space-y-3">
                      <div>
                        <strong>Course:</strong> {selectedRow.course}
                      </div>
                      <div>
                        <strong>Start Date:</strong> {selectedRow.start_date}
                      </div>
                      <div>
                        <strong>End Date:</strong> {selectedRow.end_date}
                      </div>
                      <div>
                        <strong>Reporting Month:</strong> {selectedRow.reporting_month}
                      </div>
                      <div>
                        <strong>Center Name:</strong> {selectedRow.center_name}
                      </div>
                      {selectedRow.attendance && (
                        <div>
                          <strong>Attendance:</strong>{' '}
                          <a
                            href={selectedRow.attendance}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                          >
                            View Attendance
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Placement Information */}
                  <div className="space-y-4 print:mb-6 print:break-inside-avoid">
                    <h3 className="text-lg font-semibold border-b pb-2 print:text-xl print:font-bold print:border-b-2 print:border-gray-800 print:pb-3 print:mb-4">
                      Placement Information
                    </h3>
                    <div className="space-y-2 print:space-y-3">
                      <div>
                        <strong>Company:</strong> {selectedRow.company_name}
                      </div>
                      <div>
                        <strong>Designation:</strong> {selectedRow.designation}
                      </div>
                      <div>
                        <strong>Placement Month:</strong> {selectedRow.placement_month}
                      </div>
                      <div>
                        <strong>Entry Level Job:</strong> {selectedRow.posting_entry_level_job}
                      </div>
                      {selectedRow.placement_doc && (
                        <div>
                          <strong>Placement Doc:</strong>{' '}
                          <a
                            href={selectedRow.placement_doc}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                          >
                            View Placement Document
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Sector & Categories */}
                  <div className="space-y-4 md:col-span-2 print:mb-6 print:break-inside-avoid">
                    <h3 className="text-lg font-semibold border-b pb-2 print:text-xl print:font-bold print:border-b-2 print:border-gray-800 print:pb-3 print:mb-4">
                      Sector & Categories
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-1 print:space-y-3">
                      <div>
                        <strong>Sector:</strong> {selectedRow.sector}
                      </div>
                      <div>
                        <strong>Green Job:</strong> {selectedRow.green_job}
                      </div>
                      <div>
                        <strong>Women Headed Household:</strong> {selectedRow.household_women_headed}
                      </div>
                    </div>
                  </div>

                  {/* Income Information */}
                  <div className="space-y-4 print:mb-6 print:break-inside-avoid">
                    <h3 className="text-lg font-semibold border-b pb-2 print:text-xl print:font-bold print:border-b-2 print:border-gray-800 print:pb-3 print:mb-4">
                      Income Information
                    </h3>
                    <div className="space-y-2 print:space-y-3">
                      <div>
                        <strong>Pre-Training Income:</strong> {selectedRow.pre_training_income || 'N/A'}
                      </div>
                      <div>
                        <strong>Post-Training Income:</strong> {selectedRow.post_training_income}
                      </div>
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="space-y-4 print:mb-6 print:break-inside-avoid">
                    <h3 className="text-lg font-semibold border-b pb-2 print:text-xl print:font-bold print:border-b-2 print:border-gray-800 print:pb-3 print:mb-4">
                      Additional Information
                    </h3>
                    <div className="space-y-2 print:space-y-3">
                      <div>
                        <strong>Training Proof:</strong> {selectedRow.training_proof || 'N/A'}
                      </div>
                      <div>
                        <strong>Placement Proof:</strong> {selectedRow.placement_proof || 'N/A'}
                      </div>
                      <div>
                        <strong>Remarks:</strong> {selectedRow.remarks || 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter className="flex-shrink-0 print:hidden">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Close
              </Button>
              <Button variant="outline" onClick={handleEdit}>
                Edit
              </Button>
              <Button onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" />
                Print
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
  );
}
