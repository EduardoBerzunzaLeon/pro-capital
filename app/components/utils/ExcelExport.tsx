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
    // const worksheet = utils.json_to_sheet(data);
    const worksheet = utils.aoa_to_sheet([ 
      [ '','TETIZ' ],
      [ '','GRUPO 22'],
      [ '','30-09-24'],
      ['','','','',1,2,3,4,5,6,7,8,9,10,11,12,13,14,15] 
    ], { cellStyles: true });

    utils.sheet_add_json(worksheet, data, { origin: "A5" });

    // utils.sheet_add_aoa(worksheet, ['holiwis']);
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
