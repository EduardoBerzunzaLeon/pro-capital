import { useEffect } from "react"

import { getFormProps, useForm } from "@conform-to/react"
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, DatePicker } from "@nextui-org/react"
import { rangeDatesCreditSchema } from "~/schemas/creditSchema"
import { parseWithZod } from "@conform-to/zod"
import { useFetcher } from "@remix-run/react"
import { getLocalTimeZone, today } from "@internationalized/date"
import { AutocompleteValidation } from "../forms/AutocompleteValidation"
import { loader } from "~/routes/_app+/clients/statistics/_index";
import saveAS from 'file-saver';
import ExcelJS from 'exceljs';
import { toast as notify } from 'react-toastify';

interface ExportProps {
  folder: string,
  overDueCredits: number,
  currentDebtTotal: number,
  newCreditsCount: number,
  newPaymentsCount: number,
  newPaymentsSum: number,
}

const exportToExcel = async (exportData: ExportProps[], fileName: string) => {

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('estadisticas');

  worksheet.columns = [
    { header: 'CARPETA', key: 'folder', width: 20 },
    { header: 'CUENTAS VENCIDAS', key: 'overDueCredits', width: 20 },
    { header: 'DEUDA NO PAGADA TOTAL', key: 'currentDebtTotal', width: 27 },
    { header: 'NUEVOS CREDITOS', key: 'newCreditsCount', width: 20 },
    { header: 'CANTIDAD DE PAGOS', key: 'newPaymentsCount', width: 21 },
    { header: 'PAGOS DEL PERIODO', key: 'newPaymentsSum', width: 21 },
    { header: 'CREDITOS NO LIQUIDADOS', key: 'activeCredits', width: 27 },
  ];

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

  const size = exportData.length;
  for (let row = 0; row < size; row++) {
    const newRow  = worksheet.addRow([...Object.keys(exportData[row]).map((val) => exportData[row][val as keyof ExportProps])]);
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
  saveAS(blob, `${fileName}.xlsx`);
}

interface Props {
    isOpen: boolean,
    onOpenChange: () => void
}


export const ModalExportStatistics = ({ isOpen, onOpenChange }: Props) => {

    const fetcher = useFetcher<typeof loader>();

    const [form, fields] = useForm({
        onValidate({ formData }) {
          return parseWithZod(formData, { schema: rangeDatesCreditSchema });
        },
        shouldValidate: 'onSubmit',
        shouldRevalidate: 'onInput',
    }); 

    useEffect(() => {

      if(fetcher.data?.error) {
        notify(fetcher.data.error, { type: 'error' });
      }

      if(fetcher.state === 'idle'  && fetcher.data && !fetcher.data.error) { 
        exportToExcel(fetcher.data, `Reporte_estadisticas_${fields.folder.value ?? 'TOTAL'}`);
      } 


    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetcher.data, fetcher.state])

  return (
    <>  
      <Modal 
            isOpen={isOpen} 
            onOpenChange={onOpenChange}
            placement="top-center"
            className='red-dark text-foreground bg-content1'
            isDismissable={false}
        >
        <ModalContent>
          {(onClose) => (
            <fetcher.Form
                method='GET'
                action={`/clients/statistics`}
                { ...getFormProps(form) }
            >
              <ModalHeader className="flex flex-col gap-1">
                Exportar a excel las estadisticas
              </ModalHeader>
              <ModalBody>
                <DatePicker 
                    label="Fecha de inicio" 
                    variant='bordered' 
                    id='start'
                    key={fields.start.key}
                    name={fields.start.name}
                    isInvalid={!!fields.start.errors}
                    errorMessage={fields.start.errors}
                    defaultValue={today(getLocalTimeZone())}
                    granularity="day"
                />
                <DatePicker 
                    label="Fecha de fin" 
                    variant='bordered' 
                    id='end'
                    key={fields.end.key}
                    name={fields.end.name}
                    isInvalid={!!fields.end.errors}
                    errorMessage={fields.end.errors}
                    defaultValue={today(getLocalTimeZone())}
                    granularity="day"
                />
                <AutocompleteValidation 
                  keyFetcher='findFolderAutocomplete' 
                  actionRoute='/folder/search' 
                  label='Carpeta' 
                  comboBoxName='folder' 
                  placeholder='Ingresa la carpeta' 
                  metadata={fields.folder}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cerrar
                </Button>
                <Button 
                    color="success" 
                    variant='bordered' 
                    type='submit' 
                    name='_action'
                    value='exportLayout' 
                    isLoading={fetcher.state !== 'idle'}
                    isDisabled={fetcher.state !== 'idle'}
                >
                  Exportar
                </Button>
              </ModalFooter>
            </fetcher.Form>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}