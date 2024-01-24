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
import { Select } from '@/components/Select'

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

type Exercise = {
  id: string
  name: string
  imageUrl: string
  videoUrl: string
  muscleGroup: string
}

interface ApiResponse {
  data: {
    exercises: Exercise[]
  }
}

const exerciseForm = z.object({
  name: z.string().min(1),
  imageUrl: z.string().min(1),
  videoUrl: z.string().min(1),
})

type ExerciseForm = z.infer<typeof exerciseForm>

export function ExerciseEdit() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [valueSelect, setValueSelect] = useState('')
  const [openSelect, setOpenSelect] = useState(false)
  const [exercise, setExercise] = useState<Exercise | null>(null)
  const [loadingFetchExercise, setLoadingFetchExercise] = useState(false)
  const [updateExercise, setUpdateExercise] = useState(false)

  useEffect(() => {
    const fetchFood = async () => {
      try {
        setLoadingFetchExercise(true)
        const response: ApiResponse = await api.get(`exercise?id=${id}`)
        setExercise(response.data.exercises[0])
        setLoadingFetchExercise(false)
      } catch (error) {
        toast.error(
          'Ocorreu um erro para carregar o alimento, tente novamente mais tarde!',
        )
        setLoadingFetchExercise(false)
      }
    }

    fetchFood()
  }, [id])

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<ExerciseForm>({
    resolver: zodResolver(exerciseForm),
    defaultValues: exercise || {},
  })

  useEffect(() => {
    setValue('name', exercise?.name || '')
    setValue('imageUrl', exercise?.imageUrl || '')
    setValue('videoUrl', exercise?.videoUrl || '')
    setValueSelect(exercise?.muscleGroup || '')
  }, [exercise, setValue])

  async function handleEditExercise(data: ExerciseForm) {
    try {
      setUpdateExercise(true)
      if (valueSelect.length === 0) {
        toast.error('Selecione o Grupo Muscular para continuar!')
      }

      const dataSend = { ...data, muscleGroup: valueSelect }

      await api.patch(`exercise?exerciseId=${id}`, dataSend)
      toast.success('Exercício atualizado com sucesso!')
      navigate('/exercise')
    } catch (error) {
      toast.error(
        'Ocorreu um erro para atualizar o exercício, tente novamente mais tarde!',
      )
    } finally {
      setUpdateExercise(false)
    }
  }

  return (
    <>
      <Helmet title="Alimento" />
      <div className="p-4">
        <div>
          <h1 className="mb-4 text-xl font-bold">Editar Exercício</h1>
        </div>

        {loadingFetchExercise ? (
          <div className="mt-4 content-center">
            <Loading />
          </div>
        ) : (
          <div className="w-full">
            {exercise !== null && (
              <form
                className={cn('grid items-start gap-4')}
                onSubmit={handleSubmit(handleEditExercise)}
              >
                <div className="grid gap-2">
                  <Label htmlFor="name">Nome do exercício</Label>
                  <Input
                    id="name"
                    placeholder="Nome do exercício"
                    {...register('name')}
                  />
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
                  <Input
                    id="videoUrl"
                    type="url"
                    placeholder="Url do vídeo"
                    {...register('videoUrl')}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="imageUrl">URL da imagem</Label>
                  <Input
                    id="imageUrl"
                    type="url"
                    placeholder="Url da imagem"
                    {...register('imageUrl')}
                  />
                </div>
                <Button type="submit" disabled={isSubmitting || updateExercise}>
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
