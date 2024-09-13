import { SortDescriptor, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react"
import { Generic, Key, LoadingState } from "~/.server/interfaces"


interface Column {
    key: string,
    label: string,
    sortable?: boolean
}

interface Props<T> {
  columns: Column[],
  loadingState: LoadingState,
  emptyContent: string,
  onSortChange: ((descriptor: SortDescriptor) => void),
  sortDescriptor: SortDescriptor,
  bottomContent: React.ReactNode,
  topContent: React.ReactNode,
  'aria-label': string,
  renderCell: (item: T, columnKey: Key) => JSX.Element
  data: T[]
}

export const TableDetail = <T extends Generic>({ 
  columns, 
  data, 
  loadingState, 
  emptyContent, 
  renderCell, 
  ...rest
}: Props<T>) => {
  return (
    <Table
      {...rest}
    >
      <TableHeader>
        {columns.map((column) =>
            <TableColumn 
                key={column.key} 
                allowsSorting={column.sortable}
                allowsResizing
                className={column.key === "actions" ? "text-center" : "text-start"}
            >{column.label}</TableColumn>
        )}
      </TableHeader>
      <TableBody 
          emptyContent={emptyContent}
          items={data ?? []}
          loadingContent={<Spinner />}
          loadingState={loadingState}
      >
          {(item) => {
              return (
              <TableRow key={item?.id}>
                  {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
              </TableRow>
          )}}
      </TableBody>
    </Table>
  )
}