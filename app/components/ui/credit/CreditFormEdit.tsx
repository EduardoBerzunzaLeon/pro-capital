import { getFormProps, useForm, useInputControl } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Card, CardHeader, CardBody } from "@nextui-org/react"
import { creditEditSchema } from "~/schemas/creditSchema";
import { AutocompleteValidation } from "../forms/AutocompleteValidation";
import { Autocomplete } from "~/.server/interfaces";
import { InputValidation } from "../forms/Input";
import { useEffect} from "react";
import { useFetcher } from "@remix-run/react";

interface Props {
    // id: number,
    // totalAmount: number,
    // currentDebt: number,
    // paymentAmount: number,
    // nextPayment: Date,
    // lastPayment: Date,
    amount: number,
    // status: string,
    type: string,
    clientGuarantee: string,
    avalGuarantee: string,
    folder: { id: number, name: string },
    group: { id: number, name: number },
    // creditAt: Date
}

//  monto prestado
// carpeta
// grupos  
// garantias
// tipo credito

export const CreditFormEdit = ({ 
    // id,
    // totalAmount,
    // currentDebt,
    // paymentAmount,
    // nextPayment,
    // lastPayment,
    amount,
    // status,
    type,
    clientGuarantee,
    avalGuarantee,
    folder,
    group,
    // creditAt
}: Props) => {
    const fetcher = useFetcher<any>();
    const fetcherSubmit = useFetcher<any>();

    const [form, fields] = useForm({
        onValidate({ formData }) {
          return parseWithZod(formData, { schema: creditEditSchema });
        },
        defaultValue: {
            group: group.name.toString(),
            amount,
            avalGuarantee,
            clientGuarantee,
            folder: folder.name,
            types: type,
        },
        shouldValidate: 'onSubmit',
        shouldRevalidate: 'onInput',
    }); 


    useEffect(() => {

        if(fetcher.state === 'idle' && fetcher.data?.status === 'success' ) {
            const groups = fetcher.data?.serverData?.group.groups;
            if(groups.length === 1 ) {
                groupInput.change(groups[0].name)
            } else {
              groupInput.change('1')
            }
    
        }
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [fetcher.state, fetcher.data]);
    
    //   useEffect(() => {
    //     fetcher.load(`/folder/group?id=${folderId}`);
    //   // eslint-disable-next-line react-hooks/exhaustive-deps
    //   }, [ idFolder ])



    const handleSelected = ({ id, value }: Autocomplete) => {
        folderInput.change(value);
        fetcher.load(`/folder/group?id=${id}`);
  }

    const folderInput = useInputControl(fields.folder);
    const groupInput = useInputControl(fields.group);


  return (
    <fetcherSubmit.Form
        method='POST' 
        // action={`/${urlAction}/edit/${id}`}
        { ...getFormProps(form) }
    >
    <Card>
        <CardHeader>
            Datos del Crédito
        </CardHeader>
        <CardBody>
        <AutocompleteValidation 
            keyFetcher='findFolderAutocomplete' 
            actionRoute='/folder/search' 
            label='Carpeta' 
            comboBoxName='folder' 
            placeholder='Ingresa la carpeta' 
            onSelected={handleSelected}
            metadata={fields.folder}      
            onValueChange={folderInput.change}
            defaultValue={{ id: folder.id, value: folderInput.value ?? '' }}
            selectedItem={{ id: folder.id, value: folderInput.value ?? '' }}
        />
        <InputValidation
          label="Grupo"
          placeholder="Ingresa el grupo"
          metadata={fields.group}
          value={groupInput.value ?? ''}
          onValueChange={groupInput.change}
        />

        </CardBody>
    </Card>
    </fetcherSubmit.Form>
  )
}
