'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface DatePickerProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function DatePicker({ value, onValueChange, placeholder = 'Pick a date', disabled = false }: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  const getDateValue = () => {
    if (!value) return undefined;
    try {
      return new Date(value);
    } catch (error) {
      console.warn('Invalid date value in DatePicker:', value);
      return undefined;
    }
  };

  const dateValue = getDateValue();

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      onValueChange?.(format(date, 'yyyy-MM-dd'));
      setOpen(false);
    }
  };

  const getDisplayValue = () => {
    if (!value) return placeholder;
    try {
      return format(new Date(value), 'PPP');
    } catch (error) {
      console.warn('Invalid date value for display:', value);
      return value || placeholder;
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn('w-full justify-start text-left font-normal', !value && 'text-muted-foreground')}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {getDisplayValue()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={dateValue} onSelect={handleDateSelect} initialFocus />
      </PopoverContent>
    </Popover>
  );
}
