import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import api from '@/services/api'
import { toast } from 'sonner'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'

import { cn } from '@/lib/utils'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

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

export function FoodCreate() {
  const navigate = useNavigate()

  const [createFood, setCreateFood] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FoodForm>({
    resolver: zodResolver(foodForm),
  })

  async function handleCreateFood(data: FoodForm) {
    try {
      setCreateFood(true)
      await api.post('food?foodId', data)
      toast.success('Alimento cadastrado com sucesso!')
      navigate('/food')
    } catch (error) {
      toast.error(
        'Ocorreu um erro para cadastrar alimento, tente novamente mais tarde!',
      )
    } finally {
      setCreateFood(false)
    }
  }

  return (
    <>
      <Helmet title="Alimento" />
      <div className="p-4">
        <div>
          <h1 className="mb-4 text-xl font-bold">Cadastrar Alimento</h1>
        </div>

        <div className="w-full">
          <form
            className={cn('grid items-start gap-4')}
            onSubmit={handleSubmit(handleCreateFood)}
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
              <Label htmlFor="portion">Porção(g)</Label>
              <Input
                id="portion"
                placeholder="Porção"
                {...register('portion')}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="calories">Calorias (kcal)</Label>
              <Input
                id="calories"
                placeholder="Calorias"
                {...register('calories')}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="carbohydrates">Carboidrato (g)</Label>
              <Input
                id="carbohydrates"
                placeholder="Quantidade de carboidrato"
                {...register('carbohydrates')}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="protein">Proteína (g)</Label>
              <Input
                id="protein"
                placeholder="Quantidade de proteína"
                {...register('protein')}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="fat">Gordura (g)</Label>
              <Input
                id="fat"
                placeholder="Quantidade de gordura"
                {...register('fat')}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="fiber">Fibra (g)</Label>
              <Input
                id="fiber"
                placeholder="Quantidade de fibra"
                {...register('fiber')}
              />
            </div>

            <Button type="submit" disabled={isSubmitting || createFood}>
              Salvar alteração
            </Button>
          </form>
        </div>
      </div>
    </>
  )
}
