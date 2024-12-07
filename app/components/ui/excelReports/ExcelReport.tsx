import { Button, Tooltip } from '@nextui-org/react';
import { FaFileExcel } from 'react-icons/fa';
import { useFetcher } from '@remix-run/react';
import { Generic } from '~/.server/interfaces';
import saveAS from 'file-saver';
import ExcelJS from 'exceljs';
import { useEffect } from 'react';

interface Props {
    url: string,
    name: string,
    columns: string[]
}

const exportToExcel = async (data: Generic[], columns: string[], name: string) => {

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(name);

    worksheet.columns = columns.map(column => ({
        header: column,
        key: column.replace(' ','_'),
        width: 20
    }));

    const headers = worksheet.getRow(1);

    headers.eachCell((cell) => {
        if(cell.value !== '' ) {
        cell.font = { name: 'ARIAL', size: 10,  bold: true  };
        cell.border = {
            top: {style:'medium', color: { argb:'000000' }},
            left: {style:'medium', color: { argb:'000000' }},
            bottom: {style:'medium', color: { argb:'000000' }},
            right: {style:'medium', color: { argb:'000000' }}
        }
        }
    });

    const size = data.length;
    for (let row = 0; row < size; row++) {
        const newRow  = worksheet.addRow([...Object.keys(data[row]).map((val) => data[row][val as keyof Generic])]);
        // newRow.height = 140;
        newRow.eachCell((cell) => {
        cell.font = { name: 'ARIAL', size: 10  };
        cell.border = {
            top: {style:'thin', color: { argb: '000000' }},
            left: {style:'thin', color: { argb: '000000' }},
            bottom: {style:'thin', color: { argb: '000000' }},
            right: {style:'thin', color: { argb: '000000' }}
        }
        cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true }
        });
        
    }

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    saveAS(blob, `${name}.xlsx`);
}

export const ExcelReport = ({ url, name, columns }: Props) => {

    const { load, state, data } = useFetcher<any>();

    useEffect(() => {

        if(state === 'idle'  && data?.serverData) { 
            exportToExcel(data.serverData, columns, name);
        } 

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, state])

    const handlePress = () => {
        load(url);
    }

  return (
        <Tooltip
            content={
                <div className="px-1 py-2">
                    <div className="text-small font-bold">Exporta la tabla en excel</div>
                    <div className="text-tiny">Los datos exportados dependen de los filtros</div>
                </div>
            }
        >
            <Button 
                variant='ghost'
                color='success'
                isIconOnly
                type='submit'
                isLoading={state !== 'idle'}
                isDisabled={state !== 'idle'}
                onPress={handlePress}
            ><FaFileExcel /></Button>
        </Tooltip>
  )
}
