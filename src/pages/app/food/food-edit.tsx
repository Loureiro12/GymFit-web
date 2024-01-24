import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import api from '@/services/api'
import { toast } from 'sonner'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useParams } from 'react-router-dom'

import { cn } from '@/lib/utils'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Loading } from '@/components/Loading'

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

const foodForm = z.object({
  name: z.string().min(1),
  portion: z.string().min(1),
  calories: z.string().min(1),
  carbohydrates: z.string().min(1),
  protein: z.string().min(1),
  fat: z.string().min(1),
  fiber: z.string().min(1),
})

type FoodForm = z.infer<typeof foodForm>

export function FoodEdit() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [food, setFood] = useState<Food | null>(null)
  const [loadingFetchFood, setLoadingFetchFood] = useState(false)
  const [updateFood, setUpdateFood] = useState(false)

  useEffect(() => {
    const fetchFood = async () => {
      try {
        setLoadingFetchFood(true)
        const response = await api.get(`food?id=${id}`)
        setFood(response.data.foods[0])
        setLoadingFetchFood(false)
      } catch (error) {
        toast.error(
          'Ocorreu um erro para carregar o alimento, tente novamente mais tarde!',
        )
        setLoadingFetchFood(false)
      }
    }

    fetchFood()
  }, [id])

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<FoodForm>({
    resolver: zodResolver(foodForm),
    defaultValues: food || {},
  })

  useEffect(() => {
    setValue('name', food?.name || '')
    setValue('portion', food?.portion || '')
    setValue('calories', food?.calories || '')
    setValue('carbohydrates', food?.carbohydrates || '')
    setValue('protein', food?.protein || '')
    setValue('fat', food?.fat || '')
    setValue('fiber', food?.fiber || '')
  }, [food, setValue])

  async function handleEditFood(data: FoodForm) {
    try {
      setUpdateFood(true)
      await api.patch(`food?foodId=${id}`, data)
      toast.success('Alimento atualizado com sucesso!')
      navigate('/food')
    } catch (error) {
      toast.error(
        'Ocorreu um erro para atualizar alimento, tente novamente mais tarde!',
      )
    } finally {
      setUpdateFood(false)
    }
  }

  return (
    <>
      <Helmet title="Alimento" />
      <div className="p-4">
        <div>
          <h1 className="mb-4 text-xl font-bold">Editar alimento</h1>
        </div>

        {loadingFetchFood ? (
          <div className="mt-4 content-center">
            <Loading />
          </div>
        ) : (
          <div className="w-full">
            {food !== null && (
              <form
                className={cn('grid items-start gap-4')}
                onSubmit={handleSubmit(handleEditFood)}
              >
                <div className="grid gap-2">
                  <Label htmlFor="name">Nome do Alimento</Label>
                  <Input
                    id="name"
                    placeholder="Nome do alimento"
                    {...register('name')}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="portion">Porção</Label>
                  <Input
                    id="portion"
                    placeholder="Porção"
                    {...register('portion')}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="calories">Calorias</Label>
                  <Input
                    id="calories"
                    placeholder="Calorias"
                    {...register('calories')}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="carbohydrates">Carboidrato</Label>
                  <Input
                    id="carbohydrates"
                    placeholder="Quantidade de carboidrato"
                    {...register('carbohydrates')}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="protein">Proteína</Label>
                  <Input
                    id="protein"
                    placeholder="Quantidade de proteína"
                    {...register('protein')}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="fat">Gordura</Label>
                  <Input
                    id="fat"
                    placeholder="Quantidade de gordura"
                    {...register('fat')}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="fiber">Fibra</Label>
                  <Input
                    id="fiber"
                    placeholder="Quantidade de fibra"
                    {...register('fiber')}
                  />
                </div>

                <Button type="submit" disabled={isSubmitting || updateFood}>
                  Salvar alteração
                </Button>
              </form>
            )}
          </div>
        )}
      </div>
    </>
  )
}
