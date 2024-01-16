import { useState } from 'react'
import { Helmet } from 'react-helmet-async'

import { cn } from '@/lib/utils'

import { Pencil, Trash2 } from 'lucide-react'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'

import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { DeleteModal } from '@/components/DeleteModal'
import { DrawerDialog } from '@/components/DrawerDialog'
import { Label } from '@/components/ui/label'

type Food = {
  id: string
  name: string
  calories: string
  carbohydrates: string
  fat: string
  fiber: string
  portion: string
  protein: string
}

const data: Food[] = [
  {
    id: 'm5gr84i9',
    name: 'Feijão carioca cozido',
    calories: '7600',
    carbohydrates: '1360',
    fat: '050',
    fiber: '850',
    portion: '100',
    protein: '480',
  },
  {
    id: 'f82ade8f-8796-4a21-abfc-9ea57822830f',
    name: 'arroz branco cozido',
    portion: '100',
    calories: '12800',
    carbohydrates: '2650',
    protein: '250',
    fat: '020',
    fiber: '160',
  },
]

export function FoodHome() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [openModal, setOpenModal] = useState(false)
  const [openEditFood, setOpenEditFood] = useState(false)

  function EditExerciseForm({ className }: React.ComponentProps<'form'>) {
    return (
      <form className={cn('grid items-start gap-4', className)}>
        <div className="grid gap-2">
          <Label htmlFor="name">Nome do Alimento</Label>
          <Input id="name" placeholder="Nome do alimento" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="portion">Porção</Label>
          <Input id="portion" placeholder="Porção" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="calories">Calorias</Label>
          <Input id="calories" placeholder="Calorias" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="carbohydrates">Carboidrato</Label>
          <Input id="carbohydrates" placeholder="Quantidade de carboidrato" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="protein">Proteína</Label>
          <Input id="protein" placeholder="Quantidade de proteína" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="fat">Gordura</Label>
          <Input id="fat" placeholder="Quantidade de gordura" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="fiber">Fibra</Label>
          <Input id="fiber" placeholder="Quantidade de fibra" />
        </div>

        <Button type="submit">Salvar alteração</Button>
      </form>
    )
  }

  const columns: ColumnDef<Food>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      header: 'Nome',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('name')}</div>
      ),
    },
    {
      accessorKey: 'calories',
      header: () => {
        return <Label>Caloria</Label>
      },
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('calories')}</div>
      ),
    },
    {
      accessorKey: 'carbohydrates',
      header: () => {
        return <Label>Carboidrato</Label>
      },
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('carbohydrates')}</div>
      ),
    },
    {
      accessorKey: 'fat',
      header: () => {
        return <Label>Gordura</Label>
      },
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('fat')}</div>
      ),
    },
    {
      accessorKey: 'protein',
      header: () => {
        return <Label>Proteína</Label>
      },
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('protein')}</div>
      ),
    },
    {
      accessorKey: 'fiber',
      header: () => {
        return <Label>Fibra</Label>
      },
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('fiber')}</div>
      ),
    },
    {
      accessorKey: 'action',
      header: 'Ação',
      cell: () => (
        <div className="flex gap-2">
          <Button
            variant="default"
            size="icon"
            onClick={() => setOpenEditFood(true)}
          >
            <Pencil size={14} />
          </Button>
          <Button
            variant="destructive"
            size="icon"
            onClick={() => setOpenModal(true)}
          >
            <Trash2 size={14} />
          </Button>
        </div>
      ),
    },
  ]

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <>
      <Helmet title="Alimento" />
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold">Alimento</h1>
          <Button>Adicionar</Button>
        </div>
        <div className="w-full">
          <div className="flex items-center py-4">
            <Input
              placeholder="Filtrar por nome..."
              value={
                (table.getColumn('name')?.getFilterValue() as string) ?? ''
              }
              onChange={(event) =>
                table.getColumn('name')?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
            {table.getFilteredSelectedRowModel().rows.length > 1 && (
              <Button
                variant="destructive"
                className="ml-auto"
                onClick={() => console.log('########')}
              >
                Excluir
              </Button>
            )}
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      Nem um resultado encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} de{' '}
              {table.getFilteredRowModel().rows.length} linha(s) selecionada(s).
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Próximo
              </Button>
            </div>
          </div>
        </div>
      </div>
      <DeleteModal
        title="Tem certeza que deseja deletar esse alimento?"
        description="Essa ação não pode ser desfeita. Isso excluirá permanentemente o alimento."
        titleButtonConfirm="Continuar"
        titleButtonDelete="Cancelar"
        openModal={openModal}
        closeModal={() => setOpenModal(false)}
      />
      <DrawerDialog
        title="Editar alimento"
        description="Edite o alimento de um jeito simples e rápido."
        titleButtonCancel="Cancelar"
        open={openEditFood}
        setOpen={setOpenEditFood}
      >
        <EditExerciseForm />
      </DrawerDialog>
    </>
  )
}
