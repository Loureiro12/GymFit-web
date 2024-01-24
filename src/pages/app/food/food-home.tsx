import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'

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

import { Label } from '@/components/ui/label'
import api from '@/services/api'
import { toast } from 'sonner'
import { Loading } from '@/components/Loading'
import { useNavigate } from 'react-router-dom'

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

interface ApiResponse {
  data: {
    foods: Food[]
  }
}

export function FoodHome() {
  const navigate = useNavigate()

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [openModal, setOpenModal] = useState(false)
  const [food, setFood] = useState<Food[]>([])
  const [loadingFetchFood, setLoadingFetchFood] = useState(false)
  const [selectedFood, setSelectedFood] = useState<Food | null>(null)
  const [page, setPage] = useState(1)
  const [disableButtonNext, setDisableButtonNext] = useState(false)

  const fetchFood = async () => {
    try {
      setLoadingFetchFood(true)
      const response: ApiResponse = await api.get(`food?page=${page}`)

      if (response.data.foods.length > 0) {
        setFood(response.data.foods)
        setDisableButtonNext(false)
      }

      if (response.data.foods.length === 0) {
        setDisableButtonNext(true)
      }
    } catch (error) {
      toast.error(
        'Ocorreu um erro para carregar os alimentos, tente novamente mais tarde!',
      )
    } finally {
      setLoadingFetchFood(false)
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

  const deleteFood = async () => {
    try {
      await api.delete(`food?foodId=${selectedFood?.id}`)
      toast.success('Alimento deletado com sucesso!')
      setOpenModal(false)
      fetchFood()
    } catch (error) {
      toast.error(
        'Ocorreu um erro para deletar alimentos, tente novamente mais tarde!',
      )
    }
  }

  const openModalDeleteFood = (foodId: string) => {
    setOpenModal(true)
    const filterFood = food.filter((item) => item.id === foodId)
    setSelectedFood(filterFood[0])
  }

  useEffect(() => {
    fetchFood()
  }, [page])

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
        return <Label>Caloria (kcal)</Label>
      },
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('calories')}</div>
      ),
    },
    {
      accessorKey: 'carbohydrates',
      header: () => {
        return <Label>Carboidrato (g)</Label>
      },
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('carbohydrates')}</div>
      ),
    },
    {
      accessorKey: 'fat',
      header: () => {
        return <Label>Gordura (g)</Label>
      },
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('fat')}</div>
      ),
    },
    {
      accessorKey: 'protein',
      header: () => {
        return <Label>Proteína (g)</Label>
      },
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('protein')}</div>
      ),
    },
    {
      accessorKey: 'fiber',
      header: () => {
        return <Label>Fibra (g)</Label>
      },
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('fiber')}</div>
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
            onClick={() => navigate(`/food/${row.getValue('id')}`)}
          >
            <Pencil size={14} />
          </Button>
          <Button
            variant="destructive"
            size="icon"
            onClick={() => openModalDeleteFood(row.getValue('id'))}
          >
            <Trash2 size={14} />
          </Button>
        </div>
      ),
    },
  ]

  const table = useReactTable({
    data: food,
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
          <Button onClick={() => navigate('/food/create')}>Adicionar</Button>
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
                {loadingFetchFood ? (
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
        title="Tem certeza que deseja deletar esse alimento?"
        description="Essa ação não pode ser desfeita. Isso excluirá permanentemente o alimento."
        titleButtonConfirm="Continuar"
        titleButtonDelete="Cancelar"
        openModal={openModal}
        closeModal={() => setOpenModal(false)}
        onClickActionButton={deleteFood}
      />
    </>
  )
}
