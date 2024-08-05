import { getLocalTimeZone, today } from "@internationalized/date";
import {Card, CardHeader, CardBody, Divider, Avatar, Chip, Button, Input, Textarea, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Calendar, useDisclosure, Modal, ModalContent, ModalBody, ModalFooter, ModalHeader, DatePicker, Popover, PopoverContent, PopoverTrigger, Select, SelectItem, User, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger} from "@nextui-org/react";
import { FaChevronDown, FaPlus } from "react-icons/fa";
import ExcelExport from "~/components/utils/ExcelExport";
import { groupOptions, statusOptions } from "../data";
import { capitalize } from "../utils";

export default function Client() {

  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  return (
    <Card className="w-full">
      <CardHeader className="flex gap-3">
        <Avatar 
          alt="nextui logo"
          radius="full" 
          size="md" 
          src="https://nextui.org/avatars/avatar-1.png"
        />
        <div className="flex flex-row flex-wrap gap-2 items-center justify-between w-full">
        <div className="flex flex-col gap-1">
          <p className="text-md">Fatima Pacheco Bernes</p>
          <Chip color="danger" size="sm" variant="bordered">Vencido</Chip>
        </div>
        <div className="flex gap-2">
        <Popover 
          placement="top" 
          showArrow
          className='red-dark bg-content1 text-foreground'
          radius="none"
          backdrop='opaque'
        >
          <PopoverTrigger>
            <Button 
              variant='ghost' 
              size='md'
              color='primary'
            >Renovar</Button>
          </PopoverTrigger>
          <PopoverContent className="w-[240px]">
            <div className="px-1 py-2">
            <User
              description='BELE930829TS5'
              name='Fatima Pachecho Bernes'
            >
              Fatima Pachecho Bernes
            </User>
            <p className='uppercase'>Renovacion</p>
            <Divider className='mt-2'/>
            <div className="flex flex-col gap-2 w-full">
              <Input 
                type='number'
                isRequired
                labelPlacement="outside" 
                label="Importe de prestamo" 
                size="sm" 
                variant="bordered" 
                startContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-default-400 text-small">$</span>
                  </div>
                }
              />
              <DatePicker 
                isRequired
                size='sm'
                label="Fecha de inicio" 
                variant="bordered"
                labelPlacement="outside" 
              />
              <Select
                labelPlacement="outside"
                label="Semana Perdonada"
                placeholder="Seleccione la semana"
                className="max-w-xs"
                variant='bordered'
              >
                  <SelectItem key="primera">
                    Primera Semana
                  </SelectItem>
                  <SelectItem key="ultima">
                    Ultima Semana
                  </SelectItem>
              </Select>
              <Input 
                isRequired
                labelPlacement="outside" 
                label="Descuento semanal" 
                size="sm" 
                variant="bordered" 
                type='number'
                startContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-default-400 text-small">$</span>
                  </div>
                }
              />
              
              <Input 
                isDisabled
                labelPlacement="outside" 
                label="Deuda faltante" 
                defaultValue="300"
                size="sm" 
                variant="bordered" 
                type='number'
                startContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-default-400 text-small">$</span>
                  </div>
                }
              />
              
              <Input 
                isDisabled
                labelPlacement="outside" 
                label="Importe Real" 
                size="sm" 
                variant="bordered" 
                defaultValue='3200'
                type='number'
                startContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-default-400 text-small">$</span>
                  </div>
                }
              />

            <Button 
              variant='ghost' 
              size='sm'
              color='primary'
              className='mt-2'
            >Renovar</Button>
            </div>
            </div>
          </PopoverContent>
        </Popover>
        <Button 
          variant="ghost" 
          color="secondary"
          endContent={<FaPlus />}
          onPress={onOpen}
        >Agregar Pago</Button>
        </div>

        </div>
      </CardHeader>
      <Divider/>
      <CardBody>
          <div className="flex flex-wrap gap-3">
            <Input
              isReadOnly
              key='rfc'
              variant="bordered"
              defaultValue="BELE930829TS5"
              labelPlacement="outside"
              label='RFC'
              className="flex-1 min-w-max"
            />
            <Input
              isReadOnly
              key='telefono'
              variant="bordered"
              defaultValue="9811754107"
              labelPlacement="outside"
              label='Teléfono'
              className="flex-1 min-w-max"
            />
            <Input
              isReadOnly
              key='municipio'
              variant="bordered"
              defaultValue="Campeche"
              labelPlacement="outside"
              label='Municipio'
              className="flex-1 min-w-max"
            />
            <Input
              isReadOnly
              key='localidad'
              variant="bordered"
              defaultValue="Champoton"
              labelPlacement="outside"
              label='Localidad'
              className="flex-1 min-w-max"
            />
            <Input
              isReadOnly
              key='nombre_aval'
              variant="bordered"
              defaultValue="Eduardo Jesus Berzunza Leon"
              labelPlacement="outside"
              label='Nombre del aval'
              className="flex-1 min-w-max"
            />
            <Input
              isReadOnly
              key='refencia_aval'
              variant="bordered"
              defaultValue="A lado de la polleria el pollo loco"
              labelPlacement="outside"
              label='Referencia del aval'
              className="flex-1 min-w-max"
            />
            <Textarea
              isReadOnly
              label="Garantía"
              variant="bordered"
              labelPlacement="outside"
              placeholder="Enter your description"
              defaultValue="Una televisión samsung, un ventilador toshiba"
            />
            <div className="flex flex-row flex-wrap gap-3 w-full items-center justify-around">
                  <div className="flex flex-col sm:justify-evenly md:h-full flex-1 gap-2">
                    <Input
                      isReadOnly
                      label="Total de deuda"
                      placeholder="0.00"
                      variant="bordered"
                      labelPlacement="outside"
                      defaultValue="1500"
                      className="min-w-max"
                      startContent={
                        <div className="pointer-events-none flex items-center">
                          <span className="text-default-400 text-small">$</span>
                        </div>
                      }
                    />
                    <Input
                      isReadOnly
                      label="Importe quincenal"
                      placeholder="0.00"
                      variant="bordered"
                      labelPlacement="outside"
                      defaultValue="300"
                      startContent={
                        <div className="pointer-events-none flex items-center">
                          <span className="text-default-400 text-small">$</span>
                        </div>
                      }
                    />
                    <Input
                      isReadOnly
                      label="Deuda Actual"
                      placeholder="0.00"
                      variant="bordered"
                      labelPlacement="outside"
                      defaultValue="1000"
                      startContent={
                        <div className="pointer-events-none flex items-center">
                          <span className="text-default-400 text-small">$</span>
                        </div>
                      }
                    />         
                  </div>   
                  <div className="flex flex-col gap-2 mb-3">
                    <p>Proxima Fecha de cobro</p>
                    <Calendar 
                      aria-label="Próxima fecha de cobro" 
                      value={today(getLocalTimeZone())} 
                      isReadOnly 
                    />
                  </div>
            </div>
          </div>

      <Modal 
        backdrop='opaque'
        isOpen={isOpen} 
        onOpenChange={onOpenChange} 
        className='red-dark text-foreground bg-content1'
        
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Agregar Pago</ModalHeader>
              <ModalBody>
                <Input 
                  isRequired
                  type='number'
                  label="Folio" 
                  labelPlacement="outside" 
                  variant="bordered" 
                  className="min-w-max"
                  placeholder="Escribir el folio"
                />
                <Input 
                  isRequired
                  label="Grupo" 
                  labelPlacement="outside" 
                  variant="bordered" 
                  className="min-w-max"
                  placeholder="Escribir el grupo"
                />
                <Input
                  isRequired
                  type="number"
                  label="Importe"
                  placeholder="0.00"
                  variant="bordered"
                  labelPlacement="outside"
                  className="min-w-max"
                  startContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-default-400 text-small">$</span>
                    </div>
                  }
                />
                <Input
                  isRequired
                  label="Agente"
                  placeholder="Escribir el agente"
                  variant="bordered"
                  labelPlacement="outside"
                  className="min-w-max"
                />
                <DatePicker 
                  isRequired
                  label="Fecha del cobro" 
                  variant="bordered"
                  labelPlacement="outside" 
                />
                <Textarea
                  label="Observaciones"
                  variant="bordered"
                  labelPlacement="outside"
                  placeholder="Escribe las observaciones"
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cerrar
                </Button>
                <Button color="primary" variant='ghost' onPress={onClose}>
                  Guardar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <div className='mb-2 flex w-full justify-between items-center'>
          <ExcelExport  data={[]} fileName='test2'/>
          <Dropdown>
              <DropdownTrigger className="sm:flex">
                <Button endContent={<FaChevronDown  className="text-small" />} variant="flat">
                  Créditos
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectionMode="multiple"
              >
                {groupOptions.map((group) => (
                  <DropdownItem key={group.uid} className="capitalize">
                    {capitalize(group.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
      </div>
        <Table aria-label="Tabla de cobros">
          <TableHeader>
            <TableColumn>IMPORTE</TableColumn>
            <TableColumn>FECHA</TableColumn>
            <TableColumn>AGENTE</TableColumn>
            <TableColumn>ESTATUS</TableColumn>
            <TableColumn>GRUPO</TableColumn>
            <TableColumn>FOLIO</TableColumn>
            <TableColumn>OBSERVACIONES</TableColumn>
          </TableHeader>
          <TableBody>
            <TableRow key="1">
              <TableCell>$300</TableCell>
              <TableCell>2024-05-09</TableCell>
              <TableCell>Carlos Berzunza</TableCell>
              <TableCell><Chip color="success" size="sm" variant="bordered">Pagado</Chip></TableCell>
              <TableCell>Grupo 77</TableCell>
              <TableCell>11980</TableCell>
              <TableCell></TableCell>
            </TableRow>
            <TableRow key="2">
              <TableCell>$200</TableCell>
              <TableCell>2024-05-16</TableCell>
              <TableCell>Eduardo Ruiz</TableCell>
              <TableCell><Chip color="warning" size="sm" variant="bordered">Pago Incompleto</Chip></TableCell>
              <TableCell>Grupo 77</TableCell>
              <TableCell>11980</TableCell>
              <TableCell>A la señora no le pagaron su tanda</TableCell>
            </TableRow>
            <TableRow key="3">
              <TableCell>$0</TableCell>
              <TableCell>2024-05-23</TableCell>
              <TableCell>Joaquin Mendoza</TableCell>
              <TableCell><Chip color="danger" size="sm" variant="bordered">No pago</Chip></TableCell>
              <TableCell>Grupo 77</TableCell>
              <TableCell>11980</TableCell>
              <TableCell>Me tiro cerveza y me insulto</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardBody>
      <Divider/>
    </Card>
  );
}