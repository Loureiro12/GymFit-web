import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'

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
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import api from '@/services/api'
import { Loading } from '@/components/Loading'

type Exercise = {
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

interface ApiResponse {
  data: {
    exercises: Exercise[]
  }
}

export function ExerciseHome() {
  const navigate = useNavigate()

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [openModal, setOpenModal] = useState(false)
  const [exercise, setExercise] = useState<Exercise[]>([])
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null,
  )
  const [page, setPage] = useState(1)
  const [disableButtonNext, setDisableButtonNext] = useState(false)
  const [loadingFetchExercise, setLoadingFetchExercise] = useState(false)

  const fetchExercise = async () => {
    try {
      setLoadingFetchExercise(true)
      const response: ApiResponse = await api.get(`exercise?page=${page}`)

      if (response.data.exercises.length > 0) {
        setExercise(response.data.exercises)
        setDisableButtonNext(false)
      }

      if (response.data.exercises.length === 0) {
        setDisableButtonNext(true)
      }
    } catch (error) {
      toast.error(
        'Ocorreu um erro para carregar os exercícios, tente novamente mais tarde!',
      )
    } finally {
      setLoadingFetchExercise(false)
    }
  }

  const handleNextPage = () => {
    console.log('handleNextPage')
    setPage(page + 1)
  }

  const handleAfterPage = () => {
    if (page === 1) {
      setPage(1)
    }
    setPage(page - 1)
  }

  const deleteExercise = async () => {
    try {
      await api.delete(`exercise?exerciseId=${selectedExercise?.id}`)
      toast.success('Exercício deletado com sucesso!')
      setOpenModal(false)
      fetchExercise()
    } catch (error) {
      toast.error(
        'Ocorreu um erro para deletar o exercício, tente novamente mais tarde!',
      )
    }
  }

  const openModalDeleteExercise = (exerciseId: string) => {
    setOpenModal(true)
    const filterExercise = exercise.filter((item) => item.id === exerciseId)
    setSelectedExercise(filterExercise[0])
  }

  useEffect(() => {
    fetchExercise()
  }, [page])

  const columns: ColumnDef<Exercise>[] = [
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
      accessorKey: 'id',
      header: 'Ação',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="default"
            size="icon"
            onClick={() => navigate(`/exercise/${row.getValue('id')}`)}
          >
            <Pencil size={14} />
          </Button>
          <Button
            variant="destructive"
            size="icon"
            onClick={() => openModalDeleteExercise(row.getValue('id'))}
          >
            <Trash2 size={14} />
          </Button>
        </div>
      ),
    },
  ]

  const table = useReactTable({
    data: exercise,
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
          <Button onClick={() => navigate('/exercise/create')}>
            Adicionar
          </Button>
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
                {loadingFetchExercise ? (
                  <div className="m-3 ">
                    <Loading />
                  </div>
                ) : table.getRowModel().rows?.length ? (
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
                onClick={handleAfterPage}
                disabled={page === 1}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={disableButtonNext}
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
        onClickActionButton={deleteExercise}
        openModal={openModal}
        closeModal={() => setOpenModal(false)}
      />
    </>
  )
}
