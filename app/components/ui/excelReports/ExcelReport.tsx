import { Button, Tooltip } from '@nextui-org/react';
import { FaFileExcel } from 'react-icons/fa';


export const ExcelReport = () => {
  return (
    <Tooltip
        content={
            <div className="px-1 py-2">
                <div className="text-small font-bold">Generar reporte en excel</div>
                <div className="text-tiny">Genera el reporte dependiendo de los filtros</div>
            </div>
        }
    >
        <Button 
            variant='ghost'
            color='success'
            isIconOnly
        ><FaFileExcel /></Button>
    </Tooltip>
  )
}
