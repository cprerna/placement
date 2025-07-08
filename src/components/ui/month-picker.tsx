'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';

interface MonthPickerProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function MonthPicker({
  value,
  onValueChange,
  placeholder = 'Select month',
  disabled = false,
}: MonthPickerProps) {
  const [open, setOpen] = React.useState(false);
  const [year, setYear] = React.useState(new Date().getFullYear());

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const handleMonthSelect = (monthIndex: number) => {
    const selectedMonth = `${year}-${String(monthIndex + 1).padStart(2, '0')}`;
    onValueChange?.(selectedMonth);
    setOpen(false);
  };

  const getDisplayValue = () => {
    if (!value) return placeholder;

    try {
      // Try to parse the value as a valid date
      const dateStr = value.includes('-') ? value + '-01' : `2025-01-01`;
      return format(new Date(dateStr), 'MMMM yyyy');
    } catch (error) {
      // If parsing fails, return the original value or placeholder
      console.warn('Invalid date value in MonthPicker:', value);
      return value || placeholder;
    }
  };

  const displayValue = getDisplayValue();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-full justify-start text-left font-normal', !value && 'text-muted-foreground')}
          disabled={disabled}
        >
          {displayValue}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="flex items-center justify-between p-3 border-b">
          <Button variant="outline" size="icon" onClick={() => setYear(year - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="font-semibold">{year}</div>
          <Button variant="outline" size="icon" onClick={() => setYear(year + 1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-2 p-3">
          {months.map((month, index) => (
            <Button
              key={month}
              variant="ghost"
              className={cn(
                'h-9 text-sm',
                value === `${year}-${String(index + 1).padStart(2, '0')}` && 'bg-primary text-primary-foreground'
              )}
              onClick={() => handleMonthSelect(index)}
            >
              {month.slice(0, 3)}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
