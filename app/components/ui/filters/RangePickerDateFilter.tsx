import { useEffect, useState } from "react";
import { DateValue, parseDate } from "@internationalized/date";
import { RangeValue, DateRangePicker, Button } from "@nextui-org/react";
import dayjs from 'dayjs';
import { useSearchParams } from "@remix-run/react";
import { FaSearch } from "react-icons/fa";


interface Props {
    label: string,
    startName: string,
    endName: string,
    start?: string,
    end?: string,
    className?: string,
}

export const RangePickerDateFilter = ({
    label,
    startName, 
    endName,
    start,
    end,
    className
}: Props) => {

    const [ selectedDates, setSelectedDates ] = useState<RangeValue<DateValue> | null>(null);
    const [ , setSearchParams] = useSearchParams();

    useEffect(() => {

        if(!selectedDates && start && end) {
    
          const newDates = { 
            start: parseDate(start),
            end: parseDate(end)
          }
          setSelectedDates(newDates);
        }
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [start, end]);
      

      const handleDates = (dates: RangeValue<DateValue>) => {
        const start = dayjs(dates.start.toDate('America/Mexico_City')).format('YYYY-MM-DD');
        const end = dayjs(dates.end.toDate('America/Mexico_City')).format('YYYY-MM-DD');

        setSelectedDates(dates);
    
        setSearchParams((prev) => {
          prev.set(startName, start);
          prev.set(endName, String(end));
          return prev;
        }, {preventScrollReset: true});
      }

    const handleClick = () => {
        setSelectedDates(null);
        setSearchParams((prev) => {
          prev.delete(startName);
          prev.delete(endName);
          return prev;
        }, {preventScrollReset: true});
    }

    return (
      <DateRangePicker
        label={label}
        className={`${className || 'w-full md:max-w-[40%]'}`}
        variant='bordered'
        onChange={handleDates}
        value={selectedDates}
        aria-label="date ranger picker"
        startContent={<FaSearch />}
        labelPlacement='outside'
        CalendarBottomContent={
        <Button 
          className="mb-2 ml-2"
          size="sm" 
          aria-label="delete_filter_date"
          variant="ghost"
          color='primary'
          onClick={handleClick}
        >
          Limpiar
        </Button>}
      />
    )
}