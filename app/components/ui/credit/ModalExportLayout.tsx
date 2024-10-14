import { getFormProps, useForm, useInputControl } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react"
import { useFetcher } from "@remix-run/react";
import { exportLayoutSchema } from "~/schemas/creditSchema";
import { AutocompleteValidation } from "../forms/AutocompleteValidation";
import { Autocomplete, Generic } from "~/.server/interfaces";
import { useEffect } from "react";
import { InputValidation } from "../forms/Input";

import XLSX from "xlsx-js-style";
import saveAS from 'file-saver';

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

const fakeDuplicateData = (exportData: ExportProps) => {

  const { data } = exportData;

  const values = data[0];

  return  [
    values,
    values,
    values,
    values,
    values,
    values,
    values,
    values,
    values,
    values,
  ]
} 

const printSheet = (header: Omit<ExportProps, 'data'>, data: Generic[]) => {

  const initialValue: number = 0;

  const total = data.reduce((acc: number, current) => {
    acc += Number(current.Prestamo);
    return acc;
  }, initialValue);

  const worksheet = XLSX.utils.aoa_to_sheet([ 
    [ '', header.folder.toUpperCase() ],
    [ '',`GRUPO ${header.group}`, 'TOTAL:',  `$${total}`],
    [ '',header.creditAt],
    ['','','','',1,2,3,4,5,6,7,8,9,10,11,12,13,14,15] 
  ], { cellStyles: true });

  XLSX.utils.sheet_add_json(worksheet, data, { origin: "A5" });

    [1,2,3].forEach((value) => {
      worksheet[`B${value}`].s = {
        font: { bold: true },
        border: { 
          top: { style: 'thin'},
          bottom: { style: 'thin' },
          left: { style: 'thin' },
          right: { style: 'thin' },  
        },
        alignment: {
          wrapText: true,
        },
      }
    });

    const size = data.length+2;
    const columns = Object.keys(data[0]).length;
    

    for (let col = 0; col < columns; col++) {
      for (let row = 0; row < size; row++) {
        
        const cellRef = XLSX.utils.encode_cell({ r: row + 3, c: col });
        
        worksheet[cellRef].s = {
          alignment: {
              horizontal: "center",
              vertical: "center",
              wrapText: true,
          },
          border: { 
            top: { style: 'thin'},
            bottom: { style: 'thin' },
            left: { style: 'thin' },
            right: { style: 'thin' },  
          }
        }
      }
      
    } 

    worksheet["!margins"] = {
      left: 0.25,
      right: 0.25,
      top: 0.75,
      bottom: 0.75,
      header: 0.3,
      footer: 0.3
    }

    // worksheet.
    // worksheet['!pageSetup'] = { scale: 10, orientation: 'landscape' };
    return worksheet;
}

const exportToExcel = (exportData: ExportProps, fileName: string, folder: string) => {

  const data = fakeDuplicateData(exportData);
 
  const workbook = XLSX.utils.book_new();

  let min = 0;
  let max = 4;
  let count = 1;

  while (min < data.length) {

    const credits =  data.slice(min, max);
    const worksheet = printSheet(exportData, credits);
    XLSX.utils.book_append_sheet(workbook, worksheet, `${folder}-${count}`);

    min += 4;
    max += 4;
    count++;

  }

  // XLSX.utils.book_append_sheet(workbook, worksheet, `${folder}-2`);


  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], {type: 'application/octet-stream'});
  saveAS(blob, `${fileName}.xlsx`);
};

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