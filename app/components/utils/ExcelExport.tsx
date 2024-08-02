import { Button } from '@nextui-org/react';

import { utils, write } from 'xlsx';
import saveAS from 'file-saver';
import { FaFileExcel } from 'react-icons/fa';

interface Props {
    data: unknown[],
    fileName: string
}

export default function ExcelExport({ data, fileName }: Props) {
  const exportToExcel = () => {
    const worksheet = utils.json_to_sheet(data);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    const excelBuffer = write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], {type: 'application/octet-stream'});
    saveAS(blob, `${fileName}.xlsx`);
  };

  return (
    <Button 
        variant="ghost" 
        color="success" 
        endContent={<FaFileExcel />}
        onClick={exportToExcel}
    >
        Exportar a Excel
    </Button>
  );
}
