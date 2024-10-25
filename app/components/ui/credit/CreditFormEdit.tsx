import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Card, CardHeader, CardBody, Input } from "@nextui-org/react"
import { creditEditSchema } from "~/schemas/creditSchema";
import { AutocompleteValidation } from "../forms/AutocompleteValidation";

interface Props {
    id: number,
    totalAmount: number,
    currentDebt: number,
    paymentAmount: number,
    nextPayment: Date,
    lastPayment: Date,
    amount: number,
    status: string,
    type: string,
    clientGuarantee: string,
    avalGuarantee: string,
    folder: string,
    group: number,
    creditAt: Date
}

export const CreditFormEdit = ({ 
    id,
    totalAmount,
    currentDebt,
    paymentAmount,
    nextPayment,
    lastPayment,
    amount,
    status,
    type,
    clientGuarantee,
    avalGuarantee,
    folder,
    group,
    creditAt
}: Props) => {

    const [form, fields] = useForm({
        onValidate({ formData }) {
          return parseWithZod(formData, { schema: creditEditSchema });
        },
        defaultValue: {
            group,
            amount,
            creditAt,
            folder,
            types: type,
        },
        shouldValidate: 'onSubmit',
        shouldRevalidate: 'onInput',
    }); 

  return (
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
            metadata={credit.folder}      
            onValueChange={folder.change}
            defaultValue={{ id: idFolder, value: folder.value ?? '' }}
            selectedItem={{ id: idFolder, value: folder.value ?? '' }}
        />

        </CardBody>
    </Card>
  )
}
