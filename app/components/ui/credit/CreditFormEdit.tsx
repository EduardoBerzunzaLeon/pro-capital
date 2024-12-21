import { getFormProps, getSelectProps, useForm, useInputControl } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Card, CardHeader, CardBody, Select, SelectItem, Input, Calendar, Chip, CardFooter, Button } from "@nextui-org/react"
import { creditEditSchema } from "~/schemas/creditSchema";
import { AutocompleteValidation } from "../forms/AutocompleteValidation";
import { Autocomplete } from "~/.server/interfaces";
import { InputValidation } from "../forms/Input";
import { useEffect, useState} from "react";
import { useFetcher } from "@remix-run/react";
import { permissions, useCalculateDebt } from "~/application";
import { TextareaValidation } from "../forms/Textarea";
import { ChipStatusCredit } from "./ChipStatusCredit";
import { parseDate } from "@internationalized/date";
import { Permission } from "../auth/Permission";

interface Props {
    id: number,
    currentDebt: number,
    nextPayment: string,
    lastPayment: string,
    creditAt: string,
    amount: number,
    status: string,
    type: string,
    clientGuarantee: string,
    avalGuarantee: string,
    folder: { id: number, name: string },
    group: { id: number, name: number },
}

export const CreditFormEdit = ({ 
    id,
    currentDebt,
    nextPayment,
    lastPayment,
    creditAt,
    amount,
    status,
    type,
    clientGuarantee,
    avalGuarantee,
    folder,
    group,
}: Props) => {
    const fetcher = useFetcher<any>();
    const fetcherSubmit = useFetcher<any>();
    const [ isEditable, setIsEditable ] = useState(false);
    
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

    const amountInput = useInputControl(fields.amount);
    const typeInput = useInputControl(fields.types);
    const folderInput = useInputControl(fields.folder);
    const groupInput = useInputControl(fields.group);

    const { payment, total }  = useCalculateDebt(amountInput.value, typeInput.value);
      
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

    
    const handleCancel = () => {
      setIsEditable(false);
      form.reset();
    }

    const handleEnableEdit = () => {
        setIsEditable(true);
    }

    const handleSelected = ({ id, value }: Autocomplete) => {
        folderInput.change(value);
        fetcher.load(`/folder/group?id=${id}`);
    }

    const handleSelectedType = (e: React.ChangeEvent<HTMLSelectElement>) => {
      typeInput.change(e.target.value);
    }

  return (
    <fetcherSubmit.Form
        method='POST' 
        action={`/clients/${id}`}
        { ...getFormProps(form) }
    >
    <Card>
        <CardHeader className='flex gap-2'>
            Datos del Crédito 
            <ChipStatusCredit status={status} />
            { isEditable && (<Chip variant='bordered' color='warning'>En edición</Chip>)}
        </CardHeader>
        <CardBody className="flex flex-row flex-wrap justify-between gap-x-2 gap-y-4">
        <AutocompleteValidation 
            keyFetcher='findFolderAutocomplete' 
            actionRoute='/folder/search' 
            label='Carpeta' 
            comboBoxName='folder' 
            placeholder='Ingresa la carpeta' 
            onSelected={handleSelected}
            metadata={fields.folder}   
            isReadOnly={!isEditable}   
            onValueChange={folderInput.change}
            defaultValue={{ id: folder.id, value: folderInput.value ?? '' }}
            selectedItem={{ id: folder.id, value: folderInput.value ?? '' }}
            className='w-full sm:max-w-[32%]' 
            isRequired
        />
        <InputValidation
          label="Grupo"
          placeholder="Ingresa el grupo"
          metadata={fields.group}
          value={groupInput.value ?? ''}
          onValueChange={groupInput.change}
          isReadOnly={!isEditable}
          isRequired
          className='w-full sm:max-w-[32%]' 
        />
        <InputValidation
          label="Cantidad prestada"
          inputType='number'
          placeholder="Ingresa la cantidad prestada"
          metadata={fields.amount}
          value={amountInput.value ?? ''}
          onValueChange={amountInput.change}
          isReadOnly={!isEditable}
          isRequired
          className='w-full sm:max-w-[32%]' 
          startContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-400 text-small">$</span>
            </div>
          }
        />
       <Select 
          variant='bordered'
          labelPlacement="outside"
          label='Tipo de credito'
          onChange={handleSelectedType}
          selectedKeys={[typeInput.value || 'NORMAL']}
          isDisabled={!isEditable}
          disallowEmptySelection
          isRequired
          className='w-full sm:max-w-[32%]' 
          {...getSelectProps(fields.types)}
      >
        <SelectItem key='NORMAL'>Normal</SelectItem>
        <SelectItem key='EMPLEADO'>Empleado</SelectItem>
        <SelectItem key='LIDER'>Lider</SelectItem>
      </Select>
       <Input
          label="Pagos Semanal"
          placeholder="0.00"
          labelPlacement="outside"
          variant='bordered'
          isDisabled
          className='w-full sm:max-w-[32%]' 
          value={payment+''}
          startContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-400 text-small">$</span>
            </div>
          }
        />
        <Input
            label="Total a pagar"
            placeholder="0.00"
            labelPlacement="outside"
            isDisabled
            value={total+''}
            variant='bordered'
            className='w-full sm:max-w-[32%]' 
            startContent={
              <div className="pointer-events-none flex items-center">
                <span className="text-default-400 text-small">$</span>
              </div>
            }
          />
        <Input
            label="Deuda Actual"
            placeholder="0.00"
            labelPlacement="outside"
            isDisabled
            value={currentDebt+''}
            variant='bordered'
            className='w-full sm:max-w-[32%]' 
            startContent={
              <div className="pointer-events-none flex items-center">
                <span className="text-default-400 text-small">$</span>
              </div>
            }
          />
          <TextareaValidation 
            label='Garantías del cliente'
            placeholder="Ingresa las garantías"
            metadata={fields.clientGuarantee}
            isReadOnly={!isEditable}
            isRequired
          />
          <TextareaValidation 
            label='Garantías del aval'
            placeholder="Ingresa las garantías"
            metadata={fields.avalGuarantee}
            isReadOnly={!isEditable}
            isRequired
          />
          <div className='flex gap-4 flex-wrap justify-evenly w-full'>
            <Calendar 
              aria-label="Credit At Date" 
              topContent={<p className='font-semibold text-center'>Fecha del crédito</p>}
              isReadOnly
              defaultValue={parseDate(creditAt.substring(0,10))} 
              // className='w-full sm:max-w-[32%] md:max-w-[50%]' 
            />
            <Calendar 
              aria-label="NextPayment Date" 
              isReadOnly
              topContent={<p className='font-semibold text-center'>Fecha del siguiente pago</p>}
              defaultValue={parseDate(nextPayment.substring(0,10))} 
              // className='w-full sm:max-w-[32%]' 
            />
            {
              (lastPayment) ? (
                <Calendar 
                  aria-label="LastPayment Date" 
                  defaultValue={parseDate(lastPayment.substring(0,10))}
                  topContent={<p className='font-semibold text-center'>Fecha del ultimo pago</p>}
                  // className='w-full sm:max-w-[32%]' 
                  isReadOnly
                />
              ) : (<Calendar 
                aria-label="LastPayment Date" 
                topContent={<p className='font-semibold text-center'>Último pago: sin pagos</p>}
                // className='w-full sm:max-w-[32%]' 
                isReadOnly
              />)
            }
          </div>
          
        </CardBody>
        <Permission permission={permissions.credits.permissions.update}>
          <CardFooter>
          {
                isEditable  
                ? (
                  <>
                        <Button variant="ghost" color='danger' onPress={handleCancel}>
                            Cancelar Edición
                        </Button>
                        <Button 
                          variant="ghost" 
                          color='success'
                          type='submit'
                          name='_action'
                          value='update'
                          isLoading={fetcher.state !== 'idle'}
                          isDisabled={fetcher.state !== 'idle'}
                        >
                            Editar
                        </Button>
                    </>
                )
                : (
                  <Button 
                    variant="ghost" 
                    color='primary'
                    onPress={handleEnableEdit}
                    >
                        Habilitar Edición
                    </Button>
                )
            }
          </CardFooter>
        </Permission>
    </Card>
    </fetcherSubmit.Form>
  )
}
