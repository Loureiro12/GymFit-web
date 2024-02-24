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
import { Select } from '@/components/Select'
import axios from 'axios'

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

const exerciseForm = z.object({
  name: z.string().min(1),
  // imageUrl: z.string().min(1),
  // videoUrl: z.string().min(1),
})

type ExerciseForm = z.infer<typeof exerciseForm>

export function ExerciseCreate() {
  const navigate = useNavigate()

  const [valueSelect, setValueSelect] = useState('')
  const [openSelect, setOpenSelect] = useState(false)
  const [updateExercise, setUpdateExercise] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ExerciseForm>({
    resolver: zodResolver(exerciseForm),
  })

  async function handleCreateExercise(data: ExerciseForm) {
    try {
      setUpdateExercise(true)
      if (valueSelect.length === 0) {
        toast.error('Selecione o Grupo Muscular para continuar!')
      }

      const dataSend = {
        name: data.name,
        muscleGroup: valueSelect,
        contentType: 'video/mp4',
      }

      const response = await api.post('exercise', dataSend)

      await axios.put(response.data.signedUrl, data.videoUrl, {
        headers: {
          'Content-Type': 'video/mp4',
        },
      })

      toast.success('Exercício criado com sucesso!')
      navigate('/exercise')
    } catch (error) {
      toast.error(
        'Ocorreu um erro para criar o exercício, tente novamente mais tarde!',
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

        <div className="w-full">
          <form
            className={cn('grid items-start gap-4')}
            onSubmit={handleSubmit(handleCreateExercise)}
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
                type="file"
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
        </div>
      </div>
    </>
  )
}
