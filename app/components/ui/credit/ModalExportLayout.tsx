import { getFormProps, useForm, useInputControl } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react"
import { useFetcher } from "@remix-run/react";
import { exportLayoutSchema } from "~/schemas/creditSchema";
import { AutocompleteValidation } from "../forms/AutocompleteValidation";
import { Autocomplete, Generic } from "~/.server/interfaces";
import { useEffect } from "react";
import { InputValidation } from "../forms/Input";

import saveAS from 'file-saver';
import ExcelJS from 'exceljs';

interface Props {
    isOpen: boolean,
    onOpenChange: () => void
}

interface ExportProps {
  data: Generic[],
  group: number;
  folder: string;
  creditAt: string;

}

// TODO: delete this
// const fakeDuplicateData = (exportData: ExportProps) => {

//   const { data } = exportData;

//   const values = data[0];


//   return  [
//     values,
//     values,
//     values,
//     values,
//     values,
//     values,
//     values,
//     values,
//     values,
//     values,
//   ]
// } 

interface PrintSheetProps {
  header: Omit<ExportProps, 'data'>,
  data: Generic[],
  workbook: ExcelJS.Workbook,
  name: string
}

const printSheet = ({ header, data, workbook, name }: PrintSheetProps) => {

  const initialValue: number = 0;

  const total = data.reduce((acc: number, current) => {
    acc += Number(current.Prestamo);
    return acc;
  }, initialValue);

  const numeral = data.map((_, index) => ( [index+1].toString() )); 

  const worksheet =  workbook.addWorksheet(name, {
    pageSetup:{ 
      paperSize: undefined, 
      orientation:'landscape',
      margins: {
        left: 0, 
        right: 0,
        top: .75, 
        bottom: 0,
        header: 0, 
        footer: 0
      },
      fitToPage: true,
      printArea: `A1:T${data.length+4}`
    },
  });

  const headers =  worksheet.getRow(1);
  headers.values = ['',header.folder.toUpperCase(), `GRUPO ${header.group}`, header.creditAt];
  headers.eachCell((cell) => {
    if(cell.value !== '') {
      cell.font = { name: 'ARIAL', size: 10, bold: true };
      cell.border = {
        top: {style:'medium', color: { argb:'000000' }},
        left: {style:'medium', color: { argb:'000000' }},
        bottom: {style:'medium', color: { argb:'000000' }},
        right: {style:'medium', color: { argb:'000000' }}
      }
    }
  });

  const folderColumn = worksheet.getColumn(2);
  folderColumn.width =  16;

  const groupColumn = worksheet.getColumn(3);
  groupColumn.width = 16;

  const dateColumn = worksheet.getColumn(4);
  dateColumn.width = 10;

  const paymentColumn = worksheet.getColumn(5);
  paymentColumn.width =  5;

  const numbersTitle =  worksheet.getRow(2);
  numbersTitle.values = ['','','','','',1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
  numbersTitle.eachCell((cell) => {
      cell.font = { name: 'ARIAL', size: 7.5 };
      cell.border = {
        top: {style:'thin', color: { argb:'000000' }},
        left: {style:'thin', color: { argb:'000000' }},
        bottom: {style:'thin', color: { argb:'000000' }},
        right: {style:'thin', color: { argb:'000000' }}
      }
      cell.alignment = { horizontal: 'center', vertical: 'middle' }
  });

  const columns = Object.keys(data[0]);
  
  const columnsTitle =  worksheet.getRow(3);
  columnsTitle.values = ['No.', ...columns];
  columnsTitle.eachCell((cell) => {
    cell.font = { name: 'ARIAL', size: 7.5 };
    cell.border = {
      top: {style:'thin', color: { argb:'000000' }},
      left: {style:'thin', color: { argb:'000000' }},
      bottom: {style:'thin', color: { argb:'000000' }},
      right: {style:'thin', color: { argb:'000000' }}
    }
    cell.alignment = { horizontal: 'center', vertical: 'middle' }
  });
  
  const size = data.length;
  for (let row = 0; row < size; row++) {
    const newRow  = worksheet.addRow(['', ...Object.keys(data[row]).map((val) => data[row][val].toString().toUpperCase())]);
    // newRow.height = 140;
    newRow.eachCell((cell) => {
      cell.font = { name: 'ARIAL', size: 10,  bold: true  };
      cell.border = {
        top: {style:'thin', color: { argb: '000000' }},
        left: {style:'thin', color: { argb: '000000' }},
        bottom: {style:'thin', color: { argb: '000000' }},
        right: {style:'thin', color: { argb: '000000' }}
      }
      cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true }
  });
      
  } 
    const numerals = worksheet.getColumn(1);
    numerals.width = 3;
    numerals.values = ['', '', 'No.', ...numeral];

    numerals.eachCell((cell) => {
      if(cell.value !== '' ) {
        cell.font = { name: 'ARIAL', size: 7.5 };
        cell.border = {
          top: {style:'thin', color: { argb:'000000' }},
          left: {style:'thin', color: { argb:'000000' }},
          bottom: {style:'thin', color: { argb:'000000' }},
          right: {style:'thin', color: { argb:'000000' }}
        }
        cell.alignment = { horizontal: 'center', vertical: 'middle' }
      }
    });

    const totalRow =  worksheet.getRow(3+data.length+1);

    totalRow.values = ['','', 'TOTAL=', total];
    
    totalRow.eachCell((cell) => {
      cell.font = { name: 'ARIAL', size: 10, bold: true };
      cell.alignment = { horizontal: 'center', vertical: 'middle' }
    });

    return worksheet;
}

const exportToExcel = async (exportData: ExportProps, fileName: string, folder: string) => {
  const { data } = exportData;
  const workbook = new ExcelJS.Workbook();

  let min = 0;
  let max = 5;
  let count = 1;
  
  while (min < data.length) {

    const credits =  data.slice(min, max);
    printSheet({ header: exportData, data: credits, name: `${folder}-${count}`, workbook });

    min += 5;
    max += 5;
    count++;

  }

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/octet-stream' });
  saveAS(blob, `${fileName}.xlsx`);

}

export const ModalExportLayout = ({ isOpen, onOpenChange }: Props) => {

    const fetcherGroup = useFetcher<any>();
    const fetcher = useFetcher<ExportProps>();
    const isCreating = fetcher.state !== 'idle';

    const [form, fields] = useForm({
        onValidate({ formData }) {

          return parseWithZod(formData, { schema: exportLayoutSchema });
        },
        shouldValidate: 'onSubmit',
        shouldRevalidate: 'onInput',
    }); 
    
    const folder = useInputControl(fields.folder);
    const group = useInputControl(fields.group);

    useEffect(() => {

      if(fetcherGroup.state === 'idle' && fetcherGroup.data?.status === 'success') {
          const groups = fetcherGroup.data?.serverData?.group.groups;
          if(groups.length === 1 ) {
              group.change(groups[0].name)
          } else {
            group.change('1')
          }
  
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetcherGroup.state, fetcherGroup.data]);

    useEffect(() => {
      if(fetcher.state === 'idle' && fetcher.data && folder.value) {
        exportToExcel(fetcher.data, `Reporte_${folder.value}`, folder.value);
      }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ fetcher.state, fetcher.data ])

    const handleSelected = ({ id, value }: Autocomplete) => {
      folder.change(value);
      fetcherGroup.load(`/folder/group?id=${id}`);
    }

    
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
                method='POST'
                action={`/clients/export`}
                { ...getFormProps(form) }
            >
              <ModalHeader className="flex flex-col gap-1">
                Exportar a excel la plantilla
              </ModalHeader>
              <ModalBody>
              <AutocompleteValidation 
                    keyFetcher='findFolderAutocomplete' 
                    actionRoute='/folder/search' 
                    label='Carpeta' 
                    comboBoxName='folder' 
                    placeholder='Ingresa la carpeta' 
                    onSelected={handleSelected}
                    metadata={fields.folder}      
                    onValueChange={folder.change}
                />
              <InputValidation
                label="Grupo"
                placeholder="Ingresa el grupo"
                metadata={fields.group}
                value={group.value ?? ''}
                onValueChange={group.change}
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
                    isLoading={isCreating}
                    isDisabled={isCreating}
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