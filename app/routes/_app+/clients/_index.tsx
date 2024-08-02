import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DateRangePicker,
  Chip,
  User,
  Pagination,
  RangeValue,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Divider,
  Select,
  SelectItem,
  DatePicker,
  Slider,
} from "@nextui-org/react";
import { FaPlus , FaSearch, FaChevronDown  } from "react-icons/fa";
import { FaEllipsisVertical, FaFilterCircleXmark } from "react-icons/fa6";
import {columns, users, statusOptions, Client, Columns,ColumnSort, SortColumn, Status, StatusColors, renovateOptions} from "./data";
import {capitalize} from "./utils";
import { ClientOnly } from "remix-utils/client-only";
import { DateValue } from "@internationalized/date";
import { useOutlet, useNavigate } from "@remix-run/react";
import ExcelExport from '../../../components/utils/ExcelExport';


const statusColorMap: Record<Status, StatusColors> = {
  activo: "warning",
  vencido: "danger",
  liquidado: "success",
  renovado: "primary"
};

const INITIAL_VISIBLE_COLUMNS = ["name", "localidad", "aval", "import","fecha_pago", "status", "can_renovate", "actions"];

export default function ClientsPage() {
  const navigate = useNavigate();
  const [filterValue, setFilterValue] = React.useState("");
  const [filterValueAval, setFilterValueAval] = React.useState("");
  const [filterValueLocalidad, setFilterValueLocalidad] = React.useState("");
  const [filterDate, setFilterDate] = React.useState<RangeValue<DateValue> | null>(null);
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState(new Set(INITIAL_VISIBLE_COLUMNS));
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortColumn>({
    column: "name",
    direction: "ascending",
  });
  const [page, setPage] = React.useState(1);
  const outlet = useOutlet();
  
  console.log(selectedKeys);
  const hasSearchFilter = Boolean(filterValue);
  const hasSearchFilterAval = Boolean(filterValueAval);
  const hasSearchFilterLocalidad = Boolean(filterValueLocalidad);
  // const hasSearchFilterDate = Boolean(filterDate);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns.has("all")) return columns;

    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredUsers = [...users];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        user.name.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }
    
    if (hasSearchFilterAval) {
      filteredUsers = filteredUsers.filter((user) =>
        user.aval.toLowerCase().includes(filterValueAval.toLowerCase()),
      );
    }
    
    if (hasSearchFilterLocalidad) {
      filteredUsers = filteredUsers.filter((user) =>
        user.localidad.toLowerCase().includes(filterValueLocalidad.toLowerCase()),
      );
    }
    
    if (filterDate) {
      filteredUsers = filteredUsers.filter((user) =>{
          const userDate = Date.parse(user.fecha_pago);
          
          return userDate >= Date.parse(filterDate?.start.toString()+'T00:00:00.000Z') 
            && userDate <= filterDate!.end.toDate().getTime() 
      });
    }

    if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
      filteredUsers = filteredUsers.filter((user) =>
        Array.from(statusFilter).includes(user.status),
      );
    }

    return filteredUsers;
  }, [hasSearchFilter, hasSearchFilterAval, hasSearchFilterLocalidad, statusFilter, filterValue, filterValueAval, filterValueLocalidad, filterDate]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items: Client[] = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => {
      const { column } = sortDescriptor;
      const first = a[column];
      const second = b[column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback((user: Client, columnKey: Columns) => {
  
    const cellValue = user[columnKey as ColumnSort];

    switch (columnKey) {
      case "name":
        return (
          <User
            description={user.rfc}
            name={cellValue}
          >
            {user.name}
          </User>
        );
      case "localidad":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{cellValue}</p>
            <p className="text-bold text-tiny capitalize text-default-400">{user.municipio}</p>
          </div>
        );
      case "status":
        return (
          <Chip className="capitalize" color={statusColorMap[user.status]} size="sm" variant="bordered">
            {cellValue}
          </Chip>
        );
      case "can_renovate":
        return (
          <>
            { cellValue && (
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
                    size='sm'
                    color='primary'
                  >Renovar</Button>
                </PopoverTrigger>
                <PopoverContent className="w-[240px]">
                  <div className="px-1 py-2">
                  <User
                    description={user.rfc}
                    name={user.name}
                  >
                    {user.name}
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
              )
            }
          </> 
        );
      case "actions":
        return (
          <div className="relative flex justify-end items-center gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <FaEllipsisVertical  className="text-default-300"/>
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                arial-label="Actvion client even"
                onAction={(e) => 
                {
                  if(e === 'see') navigate(`/clients/${user.id}`)
                }}
              >
                <DropdownItem key='see' >Ver más</DropdownItem>
                <DropdownItem key='delete'>Eliminar</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = React.useCallback((value: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);
  
  const onSearchChangeAval = React.useCallback((value: string) => {
    if (value) {
      setFilterValueAval(value);
      setPage(1);
    } else {
      setFilterValueAval("");
    }
  }, []);
  
  const onSearchChangeLocalidad = React.useCallback((value: string) => {
    if (value) {
      setFilterValueLocalidad(value);
      setPage(1);
    } else {
      setFilterValueLocalidad("");
    }
  }, []);

  const onClear = React.useCallback(()=>{
    setFilterValue("")
    setPage(1)
  },[])

  const onClearAval = React.useCallback(()=>{
    setFilterValueAval("")
    setPage(1)
  },[])

  const onClearLocalidad = React.useCallback(()=>{
    setFilterValueLocalidad("")
    setPage(1)
  },[])

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end  flex-wrap">
          <Input
            isClearable
            className="w-full md:max-w-[30%] grow"
            placeholder="Buscar por nombre..."
            startContent={<FaSearch />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <Input
            isClearable
            className="w-full md:max-w-[30%] grow"
            placeholder="Buscar por aval..."
            startContent={<FaSearch />}
            value={filterValueAval}
            onClear={() => onClearAval()}
            onValueChange={onSearchChangeAval}
          />
          <Input
            isClearable
            className="w-full md:max-w-[30%] grow"
            placeholder="buscar por localidad..."
            startContent={<FaSearch />}
            value={filterValueLocalidad}
            onClear={() => onClearLocalidad()}
            onValueChange={onSearchChangeLocalidad}
          />
          <Input
            isClearable
            className="w-full md:max-w-[30%] grow"
            placeholder="buscar por grupo..."
            startContent={<FaSearch />}
            value={filterValueLocalidad}
            onClear={() => onClearLocalidad()}
            onValueChange={onSearchChangeLocalidad}
          />
          <Input
            isClearable
            className="w-full md:max-w-[30%] grow"
            placeholder="buscar por Folio..."
            startContent={<FaSearch />}
            value={filterValueLocalidad}
            onClear={() => onClearLocalidad()}
            onValueChange={onSearchChangeLocalidad}
          />
          
          <Slider 
            label="Rango del importe de la deuda"
            step={50} 
            minValue={0} 
            maxValue={4500} 
            defaultValue={[0, 4500]} 
            formatOptions={{style: "currency", currency: "USD"}}
            className="w-full md:max-w-[30%] grow"
            endContent={
              <Button
                isIconOnly
                radius="full"
                variant="light"
              >
                <FaSearch />
              </Button>
            }
          />
          <div className="flex gap-3 flex-wrap w-full items-end">
          <DateRangePicker
              label="Rango de la Fecha de cobro"
              className='w-full md:max-w-[40%]'
              value={filterDate}
              onChange={setFilterDate}
              
              labelPlacement='outside'
              CalendarBottomContent={
              <Button 
                className="mb-2 ml-2"
                size="sm" 
                aria-label="delete_filter_date"
                variant="ghost"
                color='primary'
                onClick={() => {
                  setFilterDate(null)
                }}
              >
                Limpiar
              </Button>}
            />

          <DateRangePicker
              label="Rango de la Fecha de alta"
              className='w-full md:max-w-[40%]'
              value={filterDate}
              onChange={setFilterDate}
              
              labelPlacement='outside'
              CalendarBottomContent={
              <Button 
                className="mb-2 ml-2"
                size="sm" 
                aria-label="delete_filter_date"
                variant="ghost"
                color='primary'
                onClick={() => {
                  setFilterDate(null)
                }}
              >
                Limpiar
              </Button>}
            />
            
            
            <Dropdown>
              <DropdownTrigger className="sm:flex">
                <Button endContent={<FaChevronDown  className="text-small" />} variant="flat">
                  Estatus
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="sm:flex">
                <Button endContent={<FaChevronDown  className="text-small" />} variant="flat">
                  Renovación
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                {renovateOptions.map((renovate) => (
                  <DropdownItem key={renovate.uid} className="capitalize">
                    {capitalize(renovate.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown
              className='overflow-y-scroll max-h-96'
            >
              <DropdownTrigger className="sm:flex">
                <Button endContent={<FaChevronDown  className="text-small" />} variant="flat">
                  Columnas
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button 
              variant="ghost" 
              color="danger" 
              endContent={<FaFilterCircleXmark />}
              onClick={() => {
                setFilterValue('')
                setFilterValueAval('')
                setFilterValueLocalidad('')
                setFilterDate(null)
                setStatusFilter('all')
              }}
            >
              Limpiar Filtros
            </Button>
            <Button 
              variant="ghost" 
              color="secondary" 
              endContent={<FaPlus />}
            >
              Agregar Nuevo
            </Button>
            <ExcelExport data={filteredItems} fileName='test'/>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">Total {users.length} Clientes</span>
          <label className="flex items-center text-default-400 text-small">
            Registros por Página: 
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [filterValue, onSearchChange, filterValueAval, onSearchChangeAval, filterValueLocalidad, onSearchChangeLocalidad, filterDate, statusFilter, visibleColumns, onRowsPerPageChange, onClear, onClearAval, onClearLocalidad]);
  
  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === 'all'
            ? "All items selected"
            : `${selectedKeys.size} of ${filteredItems.length} selected`}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onPreviousPage}>
            Previous
          </Button>
          <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onNextPage}>
            Next
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, filteredItems.length, page, pages, onPreviousPage, onNextPage]);

  return (
    <ClientOnly >
      {() => 
      <>
         { outlet || 
         <Table
         aria-label="Example table with custom cells, pagination and sorting"
         isHeaderSticky
         bottomContent={bottomContent}
         bottomContentPlacement="outside"
         classNames={{
           wrapper: "max-h-[382px]",
         }}
         selectedKeys={selectedKeys}
         selectionMode="multiple"
         sortDescriptor={sortDescriptor}
         topContent={topContent}
         topContentPlacement="outside"
         onSelectionChange={setSelectedKeys}
         onSortChange={setSortDescriptor}
       >
         <TableHeader columns={headerColumns}>
           {(column) => (
             <TableColumn
               key={column.uid}
               align={column.uid === "actions" ? "center" : "start"}
               allowsSorting={column.sortable}
             >
               {column.name}
             </TableColumn>
           )}
         </TableHeader>
         <TableBody emptyContent={"No users found"} items={sortedItems}>
           {(item) => (
             <TableRow key={item.id}>
               {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
             </TableRow>
           )}
         </TableBody>
       </Table>
         }
          
      
     
      </>
      }
    </ClientOnly>

  );
}

