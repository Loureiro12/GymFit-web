import { useState } from 'react'
import { Helmet } from 'react-helmet-async'

import { cn } from '@/lib/utils'

import { ArrowUpDown, Pencil, Trash2 } from 'lucide-react'
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
import { Select } from '@/components/Select'

type Payment = {
  id: string
  name: string
  muscleGroup:
    | 'thorax'
    | 'shoulder'
    | 'triceps'
    | 'back'
    | 'abdomen'
    | 'biceps'
    | 'leg'
    | 'glute'
}

const data: Payment[] = [
  {
    id: 'm5gr84i9',
    name: 'Supino Inclinado',
    muscleGroup: 'thorax',
  },
  {
    id: '3u1reuv4',
    name: 'Rosca bíceps',
    muscleGroup: 'biceps',
  },
  {
    id: 'derv1ws0',
    name: 'Extensão de tríceps',
    muscleGroup: 'triceps',
  },
]

const exercisesData = [
  {
    value: 'thorax',
    label: 'Tórax',
  },
  {
    value: 'shoulder',
    label: 'Ombro',
  },
  {
    value: 'triceps',
    label: 'Tríceps',
  },
  {
    value: 'back',
    label: 'Costas',
  },
  {
    value: 'abdomen',
    label: 'Abdômen',
  },
  {
    value: 'biceps',
    label: 'Bíceps',
  },
  {
    value: 'leg',
    label: 'Pena',
  },
  {
    value: 'glute',
    label: 'Glúteo',
  },
]

export function ExerciseHome() {
  const [openSelect, setOpenSelect] = useState(false)
  const [valueSelect, setValueSelect] = useState('')
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [openModal, setOpenModal] = useState(false)
  const [openEditExercise, setOpenEditExercise] = useState(false)

  function EditExerciseForm({ className }: React.ComponentProps<'form'>) {
    return (
      <form className={cn('grid items-start gap-4', className)}>
        <div className="grid gap-2">
          <Label htmlFor="name">Nome do exercício</Label>
          <Input id="name" placeholder="Nome do exercício" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="name">Grupo Muscular</Label>
          <Select
            data={exercisesData}
            open={openSelect}
            placeholder="Selecione o grupo muscular"
            setOpen={setOpenSelect}
            setValue={setValueSelect}
            value={valueSelect}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="videoUrl">URL do vídeo</Label>
          <Input id="videoUrl" type="url" placeholder="Url do vídeo" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="imageUrl">URL da imagem</Label>
          <Input id="imageUrl" type="url" placeholder="Url da imagem" />
        </div>
        <Button type="submit">Salvar alteração</Button>
      </form>
    )
  }

  const columns: ColumnDef<Payment>[] = [
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
      accessorKey: 'muscleGroup',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Grupo muscular
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('muscleGroup')}</div>
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
            onClick={() => setOpenEditExercise(true)}
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
      <Helmet title="Exercício" />
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold">Exercício</h1>
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
        title="Tem certeza que deseja deletar esse exercício?"
        description="Essa ação não pode ser desfeita. Isso excluirá permanentemente o exercício."
        titleButtonConfirm="Continuar"
        titleButtonDelete="Cancelar"
        openModal={openModal}
        closeModal={() => setOpenModal(false)}
      />
      <DrawerDialog
        title="Editar exercício"
        description="Edite o exercício de um jeito simples e rápido."
        titleButtonCancel="Cancelar"
        open={openEditExercise}
        setOpen={setOpenEditExercise}
      >
        <EditExerciseForm />
      </DrawerDialog>
    </>
  )
}
